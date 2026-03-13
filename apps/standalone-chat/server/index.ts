import express from 'express';
import http from 'http';
import { WebSocket, WebSocketServer } from 'ws';
import { Anthropic } from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import cors from 'cors';

const app = express();
app.use(cors());
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const PORT = 3001;

// Initialize Anthropic SDK.
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});

// Setup MCP Client for Puppeteer/Chrome DevTools
let mcpClient: Client | null = null;

async function setupMcpClient() {
  try {
    const transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', '@modelcontextprotocol/server-puppeteer'],
    });

    mcpClient = new Client(
      { name: 'standalone-chat-bff', version: '1.0.0' },
      { capabilities: {} }
    );

    await mcpClient.connect(transport);
    console.log('Connected to Chrome DevTools MCP server');
  } catch (error) {
    console.error('Failed to setup MCP client:', error);
  }
}

async function getAvailableTools() {
  if (!mcpClient) return [];
  try {
    const { tools } = await mcpClient.listTools();
    return tools.map((tool) => ({
      name: tool.name,
      description: tool.description,
      input_schema: tool.inputSchema as any,
    }));
  } catch (error) {
    console.error('Error listing MCP tools:', error);
    return [];
  }
}

wss.on('connection', (ws) => {
  console.log('Client connected');

  ws.on('message', async (message) => {
    try {
      const data = JSON.parse(message.toString());
      if (data.type === 'chat') {
        let messages = data.messages || [];
        const tools = await getAvailableTools();

        const processInteraction = async () => {
            try {
                const stream = await anthropic.messages.create({
                    max_tokens: 4096,
                    messages: messages,
                    model: 'claude-3-7-sonnet-20250219',
                    tools: tools.length > 0 ? tools : undefined,
                    stream: true,
                });

                let currentToolCall: any = null;
                let assistantMessage: any = { role: 'assistant', content: [] };
                let toolUseContentBlock: any = null;

                for await (const chunk of stream) {
                    if (chunk.type === 'content_block_start') {
                        if (chunk.content_block.type === 'tool_use') {
                            currentToolCall = {
                                id: chunk.content_block.id,
                                name: chunk.content_block.name,
                                input: '',
                            };
                            toolUseContentBlock = {
                                type: 'tool_use',
                                id: chunk.content_block.id,
                                name: chunk.content_block.name,
                                input: {}
                            };
                            assistantMessage.content.push(toolUseContentBlock);

                            ws.send(JSON.stringify({
                                type: 'tool_start',
                                tool: currentToolCall.name,
                                id: currentToolCall.id
                            }));
                        } else if (chunk.content_block.type === 'text') {
                            assistantMessage.content.push({ type: 'text', text: chunk.content_block.text });
                            ws.send(JSON.stringify({ type: 'text', text: chunk.content_block.text }));
                        }
                    } else if (chunk.type === 'content_block_delta') {
                        if (chunk.delta.type === 'text_delta') {
                            const lastContent = assistantMessage.content[assistantMessage.content.length - 1];
                            if (lastContent && lastContent.type === 'text') {
                                lastContent.text += chunk.delta.text;
                            }
                            ws.send(JSON.stringify({ type: 'text', text: chunk.delta.text }));
                        } else if (chunk.delta.type === 'input_json_delta') {
                            if (currentToolCall) {
                                currentToolCall.input += chunk.delta.partial_json;
                            }
                        }
                    } else if (chunk.type === 'content_block_stop') {
                        if (currentToolCall) {
                            try {
                                const inputArgs = JSON.parse(currentToolCall.input);
                                toolUseContentBlock.input = inputArgs; // Complete the tool use block for history

                                ws.send(JSON.stringify({
                                    type: 'tool_running',
                                    id: currentToolCall.id,
                                    input: inputArgs
                                }));

                                let toolResultContent: any = {
                                    type: 'tool_result',
                                    tool_use_id: currentToolCall.id,
                                    content: []
                                };

                                if (mcpClient) {
                                    try {
                                        const result: any = await mcpClient.callTool({
                                            name: currentToolCall.name,
                                            arguments: inputArgs
                                        });

                                        let resultText = '';
                                        let images: string[] = [];

                                        if (result && result.content && Array.isArray(result.content)) {
                                            for (const content of result.content) {
                                                if (content.type === 'text') {
                                                    resultText += content.text + '\n';
                                                    toolResultContent.content.push({ type: 'text', text: content.text });
                                                }
                                                // Handle image output (like screenshots)
                                                if (content.type === 'image') {
                                                     const base64Data = content.data || content.base64; // Handle possible structure variations
                                                     if (base64Data) {
                                                         images.push(base64Data);
                                                         toolResultContent.content.push({
                                                             type: 'image',
                                                             source: {
                                                                 type: 'base64',
                                                                 media_type: content.mimeType || 'image/png',
                                                                 data: base64Data
                                                             }
                                                         });
                                                     }
                                                }
                                            }
                                        }

                                        ws.send(JSON.stringify({
                                            type: 'tool_result',
                                            id: currentToolCall.id,
                                            result: resultText,
                                            images: images
                                        }));
                                    } catch (toolError: any) {
                                         toolResultContent.content.push({ type: 'text', text: `Error calling tool: ${toolError.message}`});
                                         toolResultContent.is_error = true;
                                         ws.send(JSON.stringify({
                                            type: 'tool_result',
                                            id: currentToolCall.id,
                                            result: `Error: ${toolError.message}`
                                         }));
                                    }

                                    // Append assistant's tool use and user's tool result to history
                                    messages.push(assistantMessage);
                                    messages.push({ role: 'user', content: [toolResultContent] });

                                    // Recursively call to get the LLM's response to the tool output
                                    await processInteraction();
                                    return; // Important: exit current loop since processInteraction takes over
                                }
                            } catch(e) {
                                console.error("Error parsing tool input", e);
                            }
                            currentToolCall = null;
                        }
                    }
                }

                // If no tools were called in this chunk, mark as done
                ws.send(JSON.stringify({ type: 'done' }));

            } catch (error) {
                 console.error('Error during LLM interaction:', error);
                 ws.send(JSON.stringify({ type: 'error', error: String(error) }));
            }
        };

        await processInteraction();
      }
    } catch (error) {
      console.error('Error handling message:', error);
      ws.send(JSON.stringify({ type: 'error', error: String(error) }));
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
  });
});

setupMcpClient().then(() => {
  server.listen(PORT, () => {
    console.log(`BFF Server running on http://localhost:${PORT}`);
  });
});