import CoreLocation
import Foundation
import TraversalAIKit
import UIKit

protocol CameraServicing: Sendable {
    func listDevices() async -> [CameraController.CameraDeviceInfo]
    func snap(params: TraversalAICameraSnapParams) async throws -> (format: String, base64: String, width: Int, height: Int)
    func clip(params: TraversalAICameraClipParams) async throws -> (format: String, base64: String, durationMs: Int, hasAudio: Bool)
}

protocol ScreenRecordingServicing: Sendable {
    func record(
        screenIndex: Int?,
        durationMs: Int?,
        fps: Double?,
        includeAudio: Bool?,
        outPath: String?) async throws -> String
}

@MainActor
protocol LocationServicing: Sendable {
    func authorizationStatus() -> CLAuthorizationStatus
    func accuracyAuthorization() -> CLAccuracyAuthorization
    func ensureAuthorization(mode: TraversalAILocationMode) async -> CLAuthorizationStatus
    func currentLocation(
        params: TraversalAILocationGetParams,
        desiredAccuracy: TraversalAILocationAccuracy,
        maxAgeMs: Int?,
        timeoutMs: Int?) async throws -> CLLocation
    func startLocationUpdates(
        desiredAccuracy: TraversalAILocationAccuracy,
        significantChangesOnly: Bool) -> AsyncStream<CLLocation>
    func stopLocationUpdates()
    func startMonitoringSignificantLocationChanges(onUpdate: @escaping @Sendable (CLLocation) -> Void)
    func stopMonitoringSignificantLocationChanges()
}

protocol DeviceStatusServicing: Sendable {
    func status() async throws -> TraversalAIDeviceStatusPayload
    func info() -> TraversalAIDeviceInfoPayload
}

protocol PhotosServicing: Sendable {
    func latest(params: TraversalAIPhotosLatestParams) async throws -> TraversalAIPhotosLatestPayload
}

protocol ContactsServicing: Sendable {
    func search(params: TraversalAIContactsSearchParams) async throws -> TraversalAIContactsSearchPayload
    func add(params: TraversalAIContactsAddParams) async throws -> TraversalAIContactsAddPayload
}

protocol CalendarServicing: Sendable {
    func events(params: TraversalAICalendarEventsParams) async throws -> TraversalAICalendarEventsPayload
    func add(params: TraversalAICalendarAddParams) async throws -> TraversalAICalendarAddPayload
}

protocol RemindersServicing: Sendable {
    func list(params: TraversalAIRemindersListParams) async throws -> TraversalAIRemindersListPayload
    func add(params: TraversalAIRemindersAddParams) async throws -> TraversalAIRemindersAddPayload
}

protocol MotionServicing: Sendable {
    func activities(params: TraversalAIMotionActivityParams) async throws -> TraversalAIMotionActivityPayload
    func pedometer(params: TraversalAIPedometerParams) async throws -> TraversalAIPedometerPayload
}

struct WatchMessagingStatus: Sendable, Equatable {
    var supported: Bool
    var paired: Bool
    var appInstalled: Bool
    var reachable: Bool
    var activationState: String
}

struct WatchQuickReplyEvent: Sendable, Equatable {
    var replyId: String
    var promptId: String
    var actionId: String
    var actionLabel: String?
    var sessionKey: String?
    var note: String?
    var sentAtMs: Int?
    var transport: String
}

struct WatchNotificationSendResult: Sendable, Equatable {
    var deliveredImmediately: Bool
    var queuedForDelivery: Bool
    var transport: String
}

protocol WatchMessagingServicing: AnyObject, Sendable {
    func status() async -> WatchMessagingStatus
    func setReplyHandler(_ handler: (@Sendable (WatchQuickReplyEvent) -> Void)?)
    func sendNotification(
        id: String,
        params: TraversalAIWatchNotifyParams) async throws -> WatchNotificationSendResult
}

extension CameraController: CameraServicing {}
extension ScreenRecordService: ScreenRecordingServicing {}
extension LocationService: LocationServicing {}
