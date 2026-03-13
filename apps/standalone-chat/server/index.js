var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
import express from 'express';
import http from 'http';
import { WebSocketServer } from 'ws';
import { Anthropic } from '@anthropic-ai/sdk';
import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import cors from 'cors';
var app = express();
app.use(cors());
var server = http.createServer(app);
var wss = new WebSocketServer({ server: server });
var PORT = 3001;
// Initialize Anthropic SDK.
var anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY || 'dummy_key',
});
// Setup MCP Client for Puppeteer/Chrome DevTools
var mcpClient = null;
function setupMcpClient() {
    return __awaiter(this, void 0, void 0, function () {
        var transport, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    transport = new StdioClientTransport({
                        command: 'npx',
                        args: ['-y', '@modelcontextprotocol/server-puppeteer'],
                    });
                    mcpClient = new Client({ name: 'standalone-chat-bff', version: '1.0.0' }, { capabilities: {} });
                    return [4 /*yield*/, mcpClient.connect(transport)];
                case 1:
                    _a.sent();
                    console.log('Connected to Chrome DevTools MCP server');
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.error('Failed to setup MCP client:', error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    });
}
function getAvailableTools() {
    return __awaiter(this, void 0, void 0, function () {
        var tools, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!mcpClient)
                        return [2 /*return*/, []];
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, mcpClient.listTools()];
                case 2:
                    tools = (_a.sent()).tools;
                    return [2 /*return*/, tools.map(function (tool) { return ({
                            name: tool.name,
                            description: tool.description,
                            input_schema: tool.inputSchema,
                        }); })];
                case 3:
                    error_2 = _a.sent();
                    console.error('Error listing MCP tools:', error_2);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
wss.on('connection', function (ws) {
    console.log('Client connected');
    ws.on('message', function (message) { return __awaiter(void 0, void 0, void 0, function () {
        var data, messages_1, tools_1, processInteraction_1, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 4, , 5]);
                    data = JSON.parse(message.toString());
                    if (!(data.type === 'chat')) return [3 /*break*/, 3];
                    messages_1 = data.messages || [];
                    return [4 /*yield*/, getAvailableTools()];
                case 1:
                    tools_1 = _a.sent();
                    processInteraction_1 = function () { return __awaiter(void 0, void 0, void 0, function () {
                        var stream, currentToolCall, assistantMessage, toolUseContentBlock, _a, stream_1, stream_1_1, chunk, lastContent, inputArgs, toolResultContent, result, resultText, images, _i, _b, content, base64Data, toolError_1, e_1, e_2_1, error_4;
                        var _c, e_2, _d, _e;
                        return __generator(this, function (_f) {
                            switch (_f.label) {
                                case 0:
                                    _f.trys.push([0, 25, , 26]);
                                    return [4 /*yield*/, anthropic.messages.create({
                                            max_tokens: 4096,
                                            messages: messages_1,
                                            model: 'claude-3-7-sonnet-20250219',
                                            tools: tools_1.length > 0 ? tools_1 : undefined,
                                            stream: true,
                                        })];
                                case 1:
                                    stream = _f.sent();
                                    currentToolCall = null;
                                    assistantMessage = { role: 'assistant', content: [] };
                                    toolUseContentBlock = null;
                                    _f.label = 2;
                                case 2:
                                    _f.trys.push([2, 18, 19, 24]);
                                    _a = true, stream_1 = __asyncValues(stream);
                                    _f.label = 3;
                                case 3: return [4 /*yield*/, stream_1.next()];
                                case 4:
                                    if (!(stream_1_1 = _f.sent(), _c = stream_1_1.done, !_c)) return [3 /*break*/, 17];
                                    _e = stream_1_1.value;
                                    _a = false;
                                    chunk = _e;
                                    if (!(chunk.type === 'content_block_start')) return [3 /*break*/, 5];
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
                                    }
                                    else if (chunk.content_block.type === 'text') {
                                        assistantMessage.content.push({ type: 'text', text: chunk.content_block.text });
                                        ws.send(JSON.stringify({ type: 'text', text: chunk.content_block.text }));
                                    }
                                    return [3 /*break*/, 16];
                                case 5:
                                    if (!(chunk.type === 'content_block_delta')) return [3 /*break*/, 6];
                                    if (chunk.delta.type === 'text_delta') {
                                        lastContent = assistantMessage.content[assistantMessage.content.length - 1];
                                        if (lastContent && lastContent.type === 'text') {
                                            lastContent.text += chunk.delta.text;
                                        }
                                        ws.send(JSON.stringify({ type: 'text', text: chunk.delta.text }));
                                    }
                                    else if (chunk.delta.type === 'input_json_delta') {
                                        if (currentToolCall) {
                                            currentToolCall.input += chunk.delta.partial_json;
                                        }
                                    }
                                    return [3 /*break*/, 16];
                                case 6:
                                    if (!(chunk.type === 'content_block_stop')) return [3 /*break*/, 16];
                                    if (!currentToolCall) return [3 /*break*/, 16];
                                    _f.label = 7;
                                case 7:
                                    _f.trys.push([7, 14, , 15]);
                                    inputArgs = JSON.parse(currentToolCall.input);
                                    toolUseContentBlock.input = inputArgs; // Complete the tool use block for history
                                    ws.send(JSON.stringify({
                                        type: 'tool_running',
                                        id: currentToolCall.id,
                                        input: inputArgs
                                    }));
                                    toolResultContent = {
                                        type: 'tool_result',
                                        tool_use_id: currentToolCall.id,
                                        content: []
                                    };
                                    if (!mcpClient) return [3 /*break*/, 13];
                                    _f.label = 8;
                                case 8:
                                    _f.trys.push([8, 10, , 11]);
                                    return [4 /*yield*/, mcpClient.callTool({
                                            name: currentToolCall.name,
                                            arguments: inputArgs
                                        })];
                                case 9:
                                    result = _f.sent();
                                    resultText = '';
                                    images = [];
                                    if (result && result.content && Array.isArray(result.content)) {
                                        for (_i = 0, _b = result.content; _i < _b.length; _i++) {
                                            content = _b[_i];
                                            if (content.type === 'text') {
                                                resultText += content.text + '\n';
                                                toolResultContent.content.push({ type: 'text', text: content.text });
                                            }
                                            // Handle image output (like screenshots)
                                            if (content.type === 'image') {
                                                base64Data = content.data || content.base64;
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
                                    return [3 /*break*/, 11];
                                case 10:
                                    toolError_1 = _f.sent();
                                    toolResultContent.content.push({ type: 'text', text: "Error calling tool: ".concat(toolError_1.message) });
                                    toolResultContent.is_error = true;
                                    ws.send(JSON.stringify({
                                        type: 'tool_result',
                                        id: currentToolCall.id,
                                        result: "Error: ".concat(toolError_1.message)
                                    }));
                                    return [3 /*break*/, 11];
                                case 11:
                                    // Append assistant's tool use and user's tool result to history
                                    messages_1.push(assistantMessage);
                                    messages_1.push({ role: 'user', content: [toolResultContent] });
                                    // Recursively call to get the LLM's response to the tool output
                                    return [4 /*yield*/, processInteraction_1()];
                                case 12:
                                    // Recursively call to get the LLM's response to the tool output
                                    _f.sent();
                                    return [2 /*return*/]; // Important: exit current loop since processInteraction takes over
                                case 13: return [3 /*break*/, 15];
                                case 14:
                                    e_1 = _f.sent();
                                    console.error("Error parsing tool input", e_1);
                                    return [3 /*break*/, 15];
                                case 15:
                                    currentToolCall = null;
                                    _f.label = 16;
                                case 16:
                                    _a = true;
                                    return [3 /*break*/, 3];
                                case 17: return [3 /*break*/, 24];
                                case 18:
                                    e_2_1 = _f.sent();
                                    e_2 = { error: e_2_1 };
                                    return [3 /*break*/, 24];
                                case 19:
                                    _f.trys.push([19, , 22, 23]);
                                    if (!(!_a && !_c && (_d = stream_1.return))) return [3 /*break*/, 21];
                                    return [4 /*yield*/, _d.call(stream_1)];
                                case 20:
                                    _f.sent();
                                    _f.label = 21;
                                case 21: return [3 /*break*/, 23];
                                case 22:
                                    if (e_2) throw e_2.error;
                                    return [7 /*endfinally*/];
                                case 23: return [7 /*endfinally*/];
                                case 24:
                                    // If no tools were called in this chunk, mark as done
                                    ws.send(JSON.stringify({ type: 'done' }));
                                    return [3 /*break*/, 26];
                                case 25:
                                    error_4 = _f.sent();
                                    console.error('Error during LLM interaction:', error_4);
                                    ws.send(JSON.stringify({ type: 'error', error: String(error_4) }));
                                    return [3 /*break*/, 26];
                                case 26: return [2 /*return*/];
                            }
                        });
                    }); };
                    return [4 /*yield*/, processInteraction_1()];
                case 2:
                    _a.sent();
                    _a.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    error_3 = _a.sent();
                    console.error('Error handling message:', error_3);
                    ws.send(JSON.stringify({ type: 'error', error: String(error_3) }));
                    return [3 /*break*/, 5];
                case 5: return [2 /*return*/];
            }
        });
    }); });
    ws.on('close', function () {
        console.log('Client disconnected');
    });
});
setupMcpClient().then(function () {
    server.listen(PORT, function () {
        console.log("BFF Server running on http://localhost:".concat(PORT));
    });
});
