import { useState, useRef, useEffect, useCallback } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Send, Terminal, Cpu, CheckCircle, CircleDashed, AlertCircle, Bot, Wrench, ChevronDown, Trash2 } from 'lucide-react';
import './index.css';
import {
  buildStandaloneSessionKey,
  normalizeSessionsList,
  parseStandaloneSessionKey,
  normalizeAgentsList,
  normalizeModelsList,
  type AgentSummary,
  type ModelChoice,
  type SavedSession,
  type SessionScope,
} from './gateway-session';
import { applyAssistantChatEvent, extractChatMessageText } from './chat-events';

// --- Types ---

type Message = {
  id?: string;
  role: 'user' | 'assistant';
  content: ContentBlock[];
};

type ContentBlock = { type: 'text'; text: string };

type ToolCall = {
  id: string;
  name: string;
  input: Record<string, unknown> | string | null;
  status: 'running' | 'completed' | 'error';
  result?: string;
};

// --- App ---

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isConnecting, setIsConnecting] = useState(true);
  const [isStreaming, setIsStreaming] = useState(false);
  const [activeToolCalls, setActiveToolCalls] = useState<Record<string, ToolCall>>({});
  const [sessionKey, setSessionKey] = useState(() =>
    buildStandaloneSessionKey({ agentId: 'main', mainKey: 'main', scope: 'per-sender' }),
  );
  const [currentRunId, setCurrentRunId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Gateway feature state
  const [agents, setAgents] = useState<AgentSummary[]>([]);
  const [currentAgent, setCurrentAgent] = useState<string>('main');
  const [models, setModels] = useState<ModelChoice[]>([]);
  const [currentModel, setCurrentModel] = useState<string>('');
  const [sessionMainKey, setSessionMainKey] = useState('main');
  const [sessionScope, setSessionScope] = useState<SessionScope>('per-sender');
  const [savedSessions, setSavedSessions] = useState<SavedSession[]>([]);
  const [showAgentPicker, setShowAgentPicker] = useState(false);
  const [showModelPicker, setShowModelPicker] = useState(false);

  const wsRef = useRef<WebSocket | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const rpcIdCounter = useRef(0);
  const pendingRpcs = useRef<Map<string, { resolve: (v: unknown) => void; reject: (e: Error) => void }>>(new Map());
  const sessionKeyRef = useRef(sessionKey);
  const loadHistoryRef = useRef<((targetSessionKey: string) => Promise<void>) | null>(null);
  const fetchAgentsAndModelsRef = useRef<
    ((preferred?: { agentId?: string; mainKey?: string }) => Promise<string>) | null
  >(null);
  const handleGatewayEventRef = useRef<((event: string, payload: any) => void) | null>(null);

  // --- WebSocket connection ---

  const sendRpc = useCallback(
    (method: string, params?: Record<string, unknown>): Promise<unknown> => {
      return new Promise((resolve, reject) => {
        const ws = wsRef.current;
        if (!ws || ws.readyState !== WebSocket.OPEN) {
          reject(new Error('Not connected'));
          return;
        }
        const id = `rpc-${++rpcIdCounter.current}`;
        pendingRpcs.current.set(id, { resolve, reject });
        ws.send(JSON.stringify({ type: 'rpc', id, method, params }));
      });
    },
    [],
  );

  const loadHistory = useCallback(
    async (targetSessionKey: string) => {
      try {
        const res: any = await sendRpc('chat.history', { sessionKey: targetSessionKey, limit: 200 });
        if (res?.messages) {
          setMessages(
            res.messages.map((m: any) => ({
              id: typeof m?.runId === 'string' ? m.runId : undefined,
              role: m.role,
              content: normalizeContent(m.content),
            })),
          );
          return;
        }
      } catch {
        // History load failures should not block the UI from connecting.
      }
      setMessages([]);
    },
    [sendRpc],
  );

  useEffect(() => {
    sessionKeyRef.current = sessionKey;
  }, [sessionKey]);

  useEffect(() => {
    loadHistoryRef.current = loadHistory;
  }, [loadHistory]);

  const refreshSessions = useCallback(async (preferredSessionKey?: string) => {
    try {
      const res: any = await sendRpc('sessions.list', {
        includeGlobal: false,
        includeUnknown: false,
        includeDerivedTitles: true,
        includeLastMessage: true,
        limit: 100,
      });
      const sessions = normalizeSessionsList(res);
      setSavedSessions(sessions);
      const activeKey = preferredSessionKey ?? sessionKeyRef.current;
      const activeSession = sessions.find((session) => session.key === activeKey);
      if (activeSession) {
        setSessionMainKey(activeSession.mainKey);
      }
    } catch {
      // Session listing should not block chat usage.
    }
  }, [sendRpc]);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('Connected to BFF');
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case 'gateway.ready':
          setIsConnecting(false);
          setErrorMsg(null);
          fetchAgentsAndModelsRef.current?.().then((nextSessionKey) => {
            void loadHistoryRef.current?.(nextSessionKey);
            void refreshSessions(nextSessionKey);
          });
          break;

        case 'gateway.event':
          handleGatewayEventRef.current?.(data.event, data.payload);
          break;

        case 'gateway.disconnected':
          setIsConnecting(true);
          setErrorMsg(`Gateway disconnected (${data.code}): ${data.reason}`);
          break;

        case 'gateway.error':
          setErrorMsg(`Gateway error: ${data.message}`);
          setIsConnecting(false);
          break;

        case 'resp': {
          const pending = pendingRpcs.current.get(data.id);
          if (pending) {
            pendingRpcs.current.delete(data.id);
            if (data.ok) {
              pending.resolve(data.payload);
            } else {
              pending.reject(new Error(data.error?.message ?? 'Unknown error'));
            }
          }
          break;
        }
      }
    };

    ws.onclose = () => {
      setIsConnecting(true);
      setTimeout(() => {
        // Reconnect
        window.location.reload();
      }, 3000);
    };

    ws.onerror = () => {
      setErrorMsg('WebSocket connection error');
    };

    return () => {
      ws.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Gateway event handler ---

  const handleGatewayEvent = useCallback(
    (event: string, payload: any) => {
      if (event === 'chat' && payload?.sessionKey === sessionKeyRef.current) {
        const chatEvent = payload;
        if (chatEvent.state === 'delta' || chatEvent.state === 'final') {
          setCurrentRunId(chatEvent.runId);
          if (chatEvent.message) {
            const textDelta = extractChatMessageText(chatEvent.message);
            if (textDelta) {
              setMessages((prev) => applyAssistantChatEvent({ messages: prev, runId: chatEvent.runId, text: textDelta }));
            }
          }
        }
        if (
          chatEvent.state === 'final' ||
          chatEvent.state === 'error' ||
          chatEvent.state === 'aborted'
        ) {
          void refreshSessions(chatEvent.sessionKey);
          setIsStreaming(false);
          setCurrentRunId(null);
          setActiveToolCalls((prev) => {
            const updated = { ...prev };
            for (const key of Object.keys(updated)) {
              if (updated[key].status === 'running') {
                updated[key] = { ...updated[key], status: 'completed', result: 'Completed.' };
              }
            }
            return updated;
          });
        }
      }

      // Handle agent tool events
      if (event === 'agent' && payload?.stream === 'tool') {
        const toolData = payload.data;
        const toolPhase =
          typeof toolData?.phase === 'string'
            ? toolData.phase
            : typeof toolData?.state === 'string'
              ? toolData.state
              : '';
        const toolCallId =
          typeof toolData?.toolCallId === 'string'
            ? toolData.toolCallId
            : typeof toolData?.callId === 'string'
              ? toolData.callId
              : typeof toolData?.name === 'string'
                ? toolData.name
                : 'tool';
        if (toolPhase === 'start') {
          setActiveToolCalls((prev) => ({
            ...prev,
            [toolCallId]: {
              id: toolCallId,
              name: toolData.name ?? 'tool',
              input:
                (toolData.args as Record<string, unknown>) ??
                (toolData.input as Record<string, unknown>) ??
                null,
              status: 'running',
            },
          }));
        } else if (toolPhase === 'end' || toolPhase === 'result') {
          setActiveToolCalls((prev) => ({
            ...prev,
            [toolCallId]: {
              ...prev[toolCallId],
              status: toolData.error ? 'error' : 'completed',
              result: toolData.result ?? toolData.error ?? 'Done',
            },
          }));
        }
      }
    },
    [],
  );

  // --- Data fetching ---

  const fetchAgentsAndModels = useCallback(async (preferred?: { agentId?: string; mainKey?: string }) => {
    const currentParsedSession = parseStandaloneSessionKey(sessionKeyRef.current);
    const preferredAgentId = preferred?.agentId;
    const preferredMainKey = preferred?.mainKey;
    let nextSessionKey = buildStandaloneSessionKey({
      agentId: preferredAgentId ?? currentParsedSession?.agentId ?? currentAgent,
      mainKey: preferredMainKey ?? currentParsedSession?.mainKey ?? sessionMainKey,
      scope: sessionScope,
    });
    try {
      const agentsRes: any = await sendRpc('agents.list', {});
      const normalized = normalizeAgentsList(
        agentsRes,
        preferredAgentId ?? currentParsedSession?.agentId ?? currentAgent,
      );
      const resolvedMainKey = preferredMainKey ?? currentParsedSession?.mainKey ?? normalized.mainKey;
      setAgents(normalized.agents);
      setCurrentAgent(normalized.currentAgentId);
      setSessionMainKey(resolvedMainKey);
      setSessionScope(normalized.scope);
      nextSessionKey = buildStandaloneSessionKey({
        agentId: normalized.currentAgentId,
        mainKey: resolvedMainKey,
        scope: normalized.scope,
      });
      setSessionKey(nextSessionKey);
    } catch {
      setSessionKey(nextSessionKey);
    }

    try {
      const modelsRes: any = await sendRpc('models.list');
      const normalized = normalizeModelsList(modelsRes, currentModel);
      setModels(normalized.models);
      setCurrentModel(normalized.currentModelId);
    } catch {
      // Model listing may not be available
    }

    return nextSessionKey;
  }, [currentAgent, currentModel, sendRpc, sessionMainKey, sessionScope]);

  useEffect(() => {
    fetchAgentsAndModelsRef.current = fetchAgentsAndModels;
  }, [fetchAgentsAndModels]);

  useEffect(() => {
    handleGatewayEventRef.current = handleGatewayEvent;
  }, [handleGatewayEvent]);

  const openSavedSession = async (savedSession: SavedSession) => {
    setCurrentAgent(savedSession.agentId);
    setSessionMainKey(savedSession.mainKey);
    setSessionKey(savedSession.key);
    setMessages([]);
    setActiveToolCalls({});
    setCurrentRunId(null);
    setErrorMsg(null);
    setShowAgentPicker(false);
    setShowModelPicker(false);
    await loadHistory(savedSession.key);
    void fetchAgentsAndModels({ agentId: savedSession.agentId, mainKey: savedSession.mainKey });
    void refreshSessions(savedSession.key);
  };

  const startNewChat = async () => {
    const nextMainKey = `chat-${Date.now().toString(36)}`;
    const nextSessionKey = buildStandaloneSessionKey({
      agentId: currentAgent,
      mainKey: nextMainKey,
    });
    setSessionMainKey(nextMainKey);
    setSessionKey(nextSessionKey);
    setMessages([]);
    setActiveToolCalls({});
    setCurrentRunId(null);
    setErrorMsg(null);
    setShowAgentPicker(false);
    setShowModelPicker(false);
    try {
      await sendRpc('sessions.patch', { key: nextSessionKey });
    } catch {
      // The gateway will create the session on first send if patching is unavailable.
    }
    void refreshSessions(nextSessionKey);
  };

  const deleteSavedSession = async (savedSession: SavedSession) => {
    try {
      await sendRpc('sessions.delete', { key: savedSession.key });
    } catch (err: any) {
      setErrorMsg(`Delete failed: ${err.message ?? String(err)}`);
      return;
    }

    const remainingSessions = savedSessions.filter((session) => session.key !== savedSession.key);
    setSavedSessions(remainingSessions);

    if (savedSession.key !== sessionKeyRef.current) {
      return;
    }

    const fallbackSession = remainingSessions.find((session) => session.agentId === currentAgent) ?? remainingSessions[0];
    if (fallbackSession) {
      await openSavedSession(fallbackSession);
      return;
    }

    await startNewChat();
  };

  // --- Auto-scroll ---

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeToolCalls]);

  // --- Handlers ---

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isConnecting || isStreaming) return;

    const userText = input.trim();
    setMessages((prev) => [...prev, { role: 'user', content: [{ type: 'text', text: userText }] }]);
    setInput('');
    setIsStreaming(true);
    setActiveToolCalls({});
    setErrorMsg(null);
    if (textareaRef.current) textareaRef.current.style.height = 'auto';

    try {
      await sendRpc('chat.send', {
        sessionKey,
        message: userText,
        idempotencyKey: `msg-${Date.now()}`,
      });
    } catch (err: any) {
      setErrorMsg(`Send failed: ${err.message}`);
      setIsStreaming(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 200)}px`;
  };

  const switchAgent = async (agentId: string) => {
    const existing = savedSessions.find((session) => session.agentId === agentId);
    const nextMainKey = existing?.mainKey ?? 'main';
    const nextSessionKey = existing?.key ?? buildStandaloneSessionKey({
      agentId,
      mainKey: nextMainKey,
      scope: sessionScope,
    });
    setCurrentAgent(agentId);
    setSessionMainKey(nextMainKey);
    setSessionKey(nextSessionKey);
    setShowAgentPicker(false);
    setMessages([]);
    setActiveToolCalls({});
    setCurrentRunId(null);
    setErrorMsg(null);
    await loadHistory(nextSessionKey);
    void fetchAgentsAndModels({ agentId, mainKey: nextMainKey });
    void refreshSessions(nextSessionKey);
  };

  const switchModel = async (modelId: string) => {
    setCurrentModel(modelId);
    setShowModelPicker(false);
    try {
      await sendRpc('sessions.patch', { key: sessionKey, model: modelId });
    } catch {
      // Patch may not be supported
    }
  };

  const resetChat = async () => {
    setMessages([]);
    setActiveToolCalls({});
    setCurrentRunId(null);
    setErrorMsg(null);
    try {
      await sendRpc('sessions.reset', { key: sessionKey, reason: 'new' });
    } catch {
      // Reset may fail
    }
    void refreshSessions(sessionKey);
  };

  // --- Render ---

  const currentAgentLabel = agents.find((a) => a.id === currentAgent)?.name ?? currentAgent ?? 'Default';
  const currentModelLabel = models.find((m) => m.id === currentModel)?.label ?? currentModel ?? 'Default';
  const currentSessionTitle =
    savedSessions.find((savedSession) => savedSession.key === sessionKey)?.title ??
    parseStandaloneSessionKey(sessionKey)?.mainKey ??
    'Current Chat';

  return (
    <div className="flex h-screen bg-[#f9f9f9] dark:bg-[#212121] text-gray-900 dark:text-gray-100 font-sans">
      {/* Sidebar */}
      <div className="hidden md:flex flex-col w-[260px] bg-gray-50 dark:bg-[#171717] border-r border-gray-200 dark:border-[#333] p-3">
        <button
          onClick={startNewChat}
          className="flex items-center gap-2 px-3 py-2 bg-white dark:bg-[#2a2a2a] border border-gray-200 dark:border-[#444] rounded-lg shadow-sm text-sm font-medium hover:bg-gray-50 dark:hover:bg-[#333] transition-colors"
        >
          <span className="text-xl leading-none">+</span> New Chat
        </button>

        {savedSessions.length > 0 && (
          <div className="mt-4 space-y-1 overflow-y-auto">
            {savedSessions.map((savedSession) => (
              <div
                key={savedSession.key}
                className={`group rounded-lg border transition-colors ${
                  savedSession.key === sessionKey
                    ? 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800'
                    : 'bg-white dark:bg-[#222] border-gray-200 dark:border-[#333]'
                }`}
              >
                <div className="flex items-start gap-2 p-1">
                  <button
                    onClick={() => openSavedSession(savedSession)}
                    className="flex-1 min-w-0 text-left px-2 py-1.5 rounded-md hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="text-sm font-medium truncate">{savedSession.title}</div>
                    {savedSession.preview && (
                      <div className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">
                        {savedSession.preview}
                      </div>
                    )}
                  </button>
                  {savedSession.mainKey !== 'main' && (
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        void deleteSavedSession(savedSession);
                      }}
                      className="flex-shrink-0 self-center opacity-90 hover:opacity-100 text-gray-400 hover:text-red-500 p-2 rounded-md transition-colors"
                      title="Delete chat"
                      aria-label={`Delete ${savedSession.title}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Agent Picker */}
        {agents.length > 0 && (
          <div className="mt-4 relative">
            <div className="text-xs font-semibold text-gray-500 mb-1.5 px-1">Agent</div>
            <button
              onClick={() => { setShowAgentPicker(!showAgentPicker); setShowModelPicker(false); }}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <Bot size={14} className="text-emerald-500 flex-shrink-0" />
                <span className="truncate">{currentAgentLabel}</span>
              </span>
              <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
            </button>
            {showAgentPicker && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {agents.map((agent) => (
                  <button
                    key={agent.id}
                    onClick={() => switchAgent(agent.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] transition-colors ${agent.id === currentAgent ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300' : ''}`}
                  >
                    {agent.name ?? agent.id}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Model Picker */}
        {models.length > 0 && (
          <div className="mt-3 relative">
            <div className="text-xs font-semibold text-gray-500 mb-1.5 px-1">Model</div>
            <button
              onClick={() => { setShowModelPicker(!showModelPicker); setShowAgentPicker(false); }}
              className="w-full flex items-center justify-between px-3 py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
            >
              <span className="flex items-center gap-2 truncate">
                <Cpu size={14} className="text-blue-500 flex-shrink-0" />
                <span className="truncate">{currentModelLabel}</span>
              </span>
              <ChevronDown size={14} className="text-gray-400 flex-shrink-0" />
            </button>
            {showModelPicker && (
              <div className="absolute z-20 mt-1 w-full bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {models.map((model) => (
                  <button
                    key={model.id}
                    onClick={() => switchModel(model.id)}
                    className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-[#333] transition-colors ${model.id === currentModel ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300' : ''}`}
                  >
                    <div className="truncate">{model.label ?? model.id}</div>
                    {model.provider && <div className="text-xs text-gray-400 truncate">{model.provider}</div>}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="mt-4 flex-1 overflow-y-auto" />

        {/* Connection Status */}
        <div className="p-3 border-t border-gray-200 dark:border-[#333] mt-auto">
          <button
            onClick={resetChat}
            className="w-full mb-3 px-3 py-2 bg-white dark:bg-[#222] border border-gray-200 dark:border-[#333] rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-[#2a2a2a] transition-colors"
          >
            Reset Current Chat
          </button>
          <div className="flex flex-col gap-2 text-xs">
            <div className="flex items-center gap-2 text-gray-500">
              <div className={`w-2 h-2 rounded-full ${errorMsg ? 'bg-red-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
              <span>{errorMsg ? 'Error' : isConnecting ? 'Connecting to Gateway...' : 'Gateway Connected'}</span>
            </div>
            {errorMsg && (
              <div className="text-red-500 font-mono text-[10px] break-words">{errorMsg}</div>
            )}
          </div>
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative max-w-full">
        {/* Header (mobile) */}
        <header className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-[#333] bg-white dark:bg-[#212121] md:hidden sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-semibold">TraversalAI Chat</h1>
            <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{currentSessionTitle}</div>
          </div>
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${errorMsg ? 'bg-red-500' : isConnecting ? 'bg-yellow-500 animate-pulse' : 'bg-emerald-500'}`} />
          </div>
        </header>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
          <div className="max-w-3xl mx-auto flex flex-col gap-6">
            {messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4 opacity-50">
                <div className="w-16 h-16 bg-gray-200 dark:bg-[#333] rounded-full flex items-center justify-center mb-2">
                  <Terminal className="w-8 h-8" />
                </div>
                <h2 className="text-xl font-medium">How can I help you today?</h2>
                <p className="text-sm">Connected to TraversalAI Gateway. Use agents, tools, and skills.</p>
              </div>
            ) : (
              messages.map((msg, idx) => (
                <div key={idx} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1 ${msg.role === 'user' ? 'bg-gray-200 dark:bg-[#333] text-gray-600' : 'bg-emerald-600 text-white'}`}>
                    {msg.role === 'user' ? <div className="w-4 h-4 bg-current rounded-full opacity-50" /> : <Cpu size={18} />}
                  </div>
                  <div className={`flex flex-col gap-2 max-w-[85%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`px-4 py-3 rounded-2xl text-[15px] leading-relaxed ${msg.role === 'user' ? 'bg-gray-100 dark:bg-[#2f2f2f] text-gray-900 dark:text-white rounded-tr-sm' : 'bg-transparent text-gray-900 dark:text-gray-100 px-0'}`}>
                      {msg.content.map((block, bIdx) =>
                        block.type === 'text' ? (
                          <ReactMarkdown key={bIdx} remarkPlugins={[remarkGfm]} className={`prose dark:prose-invert max-w-none ${msg.role === 'user' ? 'prose-p:m-0' : ''}`}>
                            {block.text}
                          </ReactMarkdown>
                        ) : null,
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Active Tool Calls */}
            {Object.values(activeToolCalls).map((tc) => (
              <div key={tc.id} className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Wrench size={16} />
                </div>
                <div className="max-w-[85%] w-full bg-white dark:bg-[#1a1a1a] border border-gray-200 dark:border-[#333] rounded-xl overflow-hidden shadow-sm my-1">
                  <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 dark:bg-[#222] border-b border-gray-200 dark:border-[#333]">
                    {tc.status === 'running' ? <CircleDashed className="w-4 h-4 text-amber-500 animate-spin" /> :
                     tc.status === 'error' ? <AlertCircle className="w-4 h-4 text-red-500" /> :
                     <CheckCircle className="w-4 h-4 text-emerald-500" />}
                    <span className="font-mono text-xs font-semibold text-gray-700 dark:text-gray-300">{tc.name}</span>
                  </div>
                  <div className="p-3">
                    {tc.input && (
                      <div className="mb-3">
                        <div className="text-[10px] uppercase font-bold text-gray-500 mb-1">Input</div>
                        <pre className="text-xs bg-gray-50 dark:bg-[#141414] p-2 rounded border border-gray-100 dark:border-[#333] overflow-x-auto text-amber-700 dark:text-amber-400 font-mono">
                          {typeof tc.input === 'string' ? tc.input : JSON.stringify(tc.input, null, 2)}
                        </pre>
                      </div>
                    )}
                    {tc.status !== 'running' && tc.result && (
                      <details className="text-sm">
                        <summary className="cursor-pointer text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 select-none text-[10px] uppercase font-bold mb-1 outline-none">Result</summary>
                        <pre className="mt-1 text-xs bg-gray-50 dark:bg-[#141414] p-2 rounded border border-gray-100 dark:border-[#333] overflow-x-auto text-gray-600 dark:text-gray-400 font-mono whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                          {tc.result.length > 2000 ? tc.result.substring(0, 2000) + '... (truncated)' : tc.result}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Streaming indicator */}
            {isStreaming && currentRunId && (
              <div className="flex gap-4 justify-start">
                <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center text-white flex-shrink-0 mt-1">
                  <Cpu size={18} />
                </div>
                <div className="px-4 py-3 rounded-2xl bg-transparent">
                  <div className="flex items-center gap-1">
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>

        {/* Input Area */}
        <div className="p-4 bg-gradient-to-t from-[#f9f9f9] via-[#f9f9f9] to-transparent dark:from-[#212121] dark:via-[#212121]">
          <div className="max-w-3xl mx-auto relative">
            <form
              onSubmit={handleSubmit}
              className="bg-white dark:bg-[#2f2f2f] border border-emerald-200 dark:border-[#444] rounded-2xl shadow-sm focus-within:ring-1 focus-within:ring-emerald-500 focus-within:border-emerald-500 overflow-hidden flex flex-col transition-all"
            >
              <textarea
                ref={textareaRef}
                value={input}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                placeholder="Message the agent..."
                className="w-full bg-transparent border-0 focus:ring-0 resize-none px-4 py-3.5 m-0 text-base max-h-[200px] outline-none text-gray-900 dark:text-gray-100 placeholder-gray-500"
                rows={1}
                disabled={isConnecting || isStreaming}
              />
              <div className="flex justify-between items-center px-3 pb-2 pt-1">
                <div className="text-xs text-gray-400 pl-1" />
                <button
                  type="submit"
                  disabled={!input.trim() || isConnecting || isStreaming}
                  className="rounded-lg w-8 h-8 flex items-center justify-center transition-colors text-white bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:hover:bg-emerald-600"
                >
                  <Send size={16} className="ml-0.5" />
                </button>
              </div>
            </form>
            <div className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400">
              Agent can make mistakes. Consider verifying important information.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Helpers ---

function normalizeContent(content: unknown): ContentBlock[] {
  if (Array.isArray(content)) {
    return content.filter((b: any) => b?.type === 'text').map((b: any) => ({ type: 'text', text: String(b.text ?? '') }));
  }
  if (typeof content === 'string') {
    return [{ type: 'text', text: content }];
  }
  return [{ type: 'text', text: '' }];
}
