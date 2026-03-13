import Foundation

public enum TraversalAIDeviceCommand: String, Codable, Sendable {
    case status = "device.status"
    case info = "device.info"
}

public enum TraversalAIBatteryState: String, Codable, Sendable {
    case unknown
    case unplugged
    case charging
    case full
}

public enum TraversalAIThermalState: String, Codable, Sendable {
    case nominal
    case fair
    case serious
    case critical
}

public enum TraversalAINetworkPathStatus: String, Codable, Sendable {
    case satisfied
    case unsatisfied
    case requiresConnection
}

public enum TraversalAINetworkInterfaceType: String, Codable, Sendable {
    case wifi
    case cellular
    case wired
    case other
}

public struct TraversalAIBatteryStatusPayload: Codable, Sendable, Equatable {
    public var level: Double?
    public var state: TraversalAIBatteryState
    public var lowPowerModeEnabled: Bool

    public init(level: Double?, state: TraversalAIBatteryState, lowPowerModeEnabled: Bool) {
        self.level = level
        self.state = state
        self.lowPowerModeEnabled = lowPowerModeEnabled
    }
}

public struct TraversalAIThermalStatusPayload: Codable, Sendable, Equatable {
    public var state: TraversalAIThermalState

    public init(state: TraversalAIThermalState) {
        self.state = state
    }
}

public struct TraversalAIStorageStatusPayload: Codable, Sendable, Equatable {
    public var totalBytes: Int64
    public var freeBytes: Int64
    public var usedBytes: Int64

    public init(totalBytes: Int64, freeBytes: Int64, usedBytes: Int64) {
        self.totalBytes = totalBytes
        self.freeBytes = freeBytes
        self.usedBytes = usedBytes
    }
}

public struct TraversalAINetworkStatusPayload: Codable, Sendable, Equatable {
    public var status: TraversalAINetworkPathStatus
    public var isExpensive: Bool
    public var isConstrained: Bool
    public var interfaces: [TraversalAINetworkInterfaceType]

    public init(
        status: TraversalAINetworkPathStatus,
        isExpensive: Bool,
        isConstrained: Bool,
        interfaces: [TraversalAINetworkInterfaceType])
    {
        self.status = status
        self.isExpensive = isExpensive
        self.isConstrained = isConstrained
        self.interfaces = interfaces
    }
}

public struct TraversalAIDeviceStatusPayload: Codable, Sendable, Equatable {
    public var battery: TraversalAIBatteryStatusPayload
    public var thermal: TraversalAIThermalStatusPayload
    public var storage: TraversalAIStorageStatusPayload
    public var network: TraversalAINetworkStatusPayload
    public var uptimeSeconds: Double

    public init(
        battery: TraversalAIBatteryStatusPayload,
        thermal: TraversalAIThermalStatusPayload,
        storage: TraversalAIStorageStatusPayload,
        network: TraversalAINetworkStatusPayload,
        uptimeSeconds: Double)
    {
        self.battery = battery
        self.thermal = thermal
        self.storage = storage
        self.network = network
        self.uptimeSeconds = uptimeSeconds
    }
}

public struct TraversalAIDeviceInfoPayload: Codable, Sendable, Equatable {
    public var deviceName: String
    public var modelIdentifier: String
    public var systemName: String
    public var systemVersion: String
    public var appVersion: String
    public var appBuild: String
    public var locale: String

    public init(
        deviceName: String,
        modelIdentifier: String,
        systemName: String,
        systemVersion: String,
        appVersion: String,
        appBuild: String,
        locale: String)
    {
        self.deviceName = deviceName
        self.modelIdentifier = modelIdentifier
        self.systemName = systemName
        self.systemVersion = systemVersion
        self.appVersion = appVersion
        self.appBuild = appBuild
        self.locale = locale
    }
}
