import Foundation

public enum TraversalAIRemindersCommand: String, Codable, Sendable {
    case list = "reminders.list"
    case add = "reminders.add"
}

public enum TraversalAIReminderStatusFilter: String, Codable, Sendable {
    case incomplete
    case completed
    case all
}

public struct TraversalAIRemindersListParams: Codable, Sendable, Equatable {
    public var status: TraversalAIReminderStatusFilter?
    public var limit: Int?

    public init(status: TraversalAIReminderStatusFilter? = nil, limit: Int? = nil) {
        self.status = status
        self.limit = limit
    }
}

public struct TraversalAIRemindersAddParams: Codable, Sendable, Equatable {
    public var title: String
    public var dueISO: String?
    public var notes: String?
    public var listId: String?
    public var listName: String?

    public init(
        title: String,
        dueISO: String? = nil,
        notes: String? = nil,
        listId: String? = nil,
        listName: String? = nil)
    {
        self.title = title
        self.dueISO = dueISO
        self.notes = notes
        self.listId = listId
        self.listName = listName
    }
}

public struct TraversalAIReminderPayload: Codable, Sendable, Equatable {
    public var identifier: String
    public var title: String
    public var dueISO: String?
    public var completed: Bool
    public var listName: String?

    public init(
        identifier: String,
        title: String,
        dueISO: String? = nil,
        completed: Bool,
        listName: String? = nil)
    {
        self.identifier = identifier
        self.title = title
        self.dueISO = dueISO
        self.completed = completed
        self.listName = listName
    }
}

public struct TraversalAIRemindersListPayload: Codable, Sendable, Equatable {
    public var reminders: [TraversalAIReminderPayload]

    public init(reminders: [TraversalAIReminderPayload]) {
        self.reminders = reminders
    }
}

public struct TraversalAIRemindersAddPayload: Codable, Sendable, Equatable {
    public var reminder: TraversalAIReminderPayload

    public init(reminder: TraversalAIReminderPayload) {
        self.reminder = reminder
    }
}
