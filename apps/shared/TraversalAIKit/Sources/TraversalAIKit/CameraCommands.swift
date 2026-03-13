import Foundation

public enum TraversalAICameraCommand: String, Codable, Sendable {
    case list = "camera.list"
    case snap = "camera.snap"
    case clip = "camera.clip"
}

public enum TraversalAICameraFacing: String, Codable, Sendable {
    case back
    case front
}

public enum TraversalAICameraImageFormat: String, Codable, Sendable {
    case jpg
    case jpeg
}

public enum TraversalAICameraVideoFormat: String, Codable, Sendable {
    case mp4
}

public struct TraversalAICameraSnapParams: Codable, Sendable, Equatable {
    public var facing: TraversalAICameraFacing?
    public var maxWidth: Int?
    public var quality: Double?
    public var format: TraversalAICameraImageFormat?
    public var deviceId: String?
    public var delayMs: Int?

    public init(
        facing: TraversalAICameraFacing? = nil,
        maxWidth: Int? = nil,
        quality: Double? = nil,
        format: TraversalAICameraImageFormat? = nil,
        deviceId: String? = nil,
        delayMs: Int? = nil)
    {
        self.facing = facing
        self.maxWidth = maxWidth
        self.quality = quality
        self.format = format
        self.deviceId = deviceId
        self.delayMs = delayMs
    }
}

public struct TraversalAICameraClipParams: Codable, Sendable, Equatable {
    public var facing: TraversalAICameraFacing?
    public var durationMs: Int?
    public var includeAudio: Bool?
    public var format: TraversalAICameraVideoFormat?
    public var deviceId: String?

    public init(
        facing: TraversalAICameraFacing? = nil,
        durationMs: Int? = nil,
        includeAudio: Bool? = nil,
        format: TraversalAICameraVideoFormat? = nil,
        deviceId: String? = nil)
    {
        self.facing = facing
        self.durationMs = durationMs
        self.includeAudio = includeAudio
        self.format = format
        self.deviceId = deviceId
    }
}
