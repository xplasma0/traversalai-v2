import Foundation

public enum TraversalAIChatTransportEvent: Sendable {
    case health(ok: Bool)
    case tick
    case chat(TraversalAIChatEventPayload)
    case agent(TraversalAIAgentEventPayload)
    case seqGap
}

public protocol TraversalAIChatTransport: Sendable {
    func requestHistory(sessionKey: String) async throws -> TraversalAIChatHistoryPayload
    func sendMessage(
        sessionKey: String,
        message: String,
        thinking: String,
        idempotencyKey: String,
        attachments: [TraversalAIChatAttachmentPayload]) async throws -> TraversalAIChatSendResponse

    func abortRun(sessionKey: String, runId: String) async throws
    func listSessions(limit: Int?) async throws -> TraversalAIChatSessionsListResponse

    func requestHealth(timeoutMs: Int) async throws -> Bool
    func events() -> AsyncStream<TraversalAIChatTransportEvent>

    func setActiveSessionKey(_ sessionKey: String) async throws
}

extension TraversalAIChatTransport {
    public func setActiveSessionKey(_: String) async throws {}

    public func abortRun(sessionKey _: String, runId _: String) async throws {
        throw NSError(
            domain: "TraversalAIChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "chat.abort not supported by this transport"])
    }

    public func listSessions(limit _: Int?) async throws -> TraversalAIChatSessionsListResponse {
        throw NSError(
            domain: "TraversalAIChatTransport",
            code: 0,
            userInfo: [NSLocalizedDescriptionKey: "sessions.list not supported by this transport"])
    }
}
