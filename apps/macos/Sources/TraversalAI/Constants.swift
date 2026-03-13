import Foundation

// Stable identifier used for both the macOS LaunchAgent label and Nix-managed defaults suite.
// nix-traversalai writes app defaults into this suite to survive app bundle identifier churn.
let launchdLabel = "ai.traversalai.mac"
let gatewayLaunchdLabel = "ai.traversalai.gateway"
let onboardingVersionKey = "traversalai.onboardingVersion"
let onboardingSeenKey = "traversalai.onboardingSeen"
let currentOnboardingVersion = 7
let pauseDefaultsKey = "traversalai.pauseEnabled"
let iconAnimationsEnabledKey = "traversalai.iconAnimationsEnabled"
let swabbleEnabledKey = "traversalai.swabbleEnabled"
let swabbleTriggersKey = "traversalai.swabbleTriggers"
let voiceWakeTriggerChimeKey = "traversalai.voiceWakeTriggerChime"
let voiceWakeSendChimeKey = "traversalai.voiceWakeSendChime"
let showDockIconKey = "traversalai.showDockIcon"
let defaultVoiceWakeTriggers = ["traversalai"]
let voiceWakeMaxWords = 32
let voiceWakeMaxWordLength = 64
let voiceWakeMicKey = "traversalai.voiceWakeMicID"
let voiceWakeMicNameKey = "traversalai.voiceWakeMicName"
let voiceWakeLocaleKey = "traversalai.voiceWakeLocaleID"
let voiceWakeAdditionalLocalesKey = "traversalai.voiceWakeAdditionalLocaleIDs"
let voicePushToTalkEnabledKey = "traversalai.voicePushToTalkEnabled"
let talkEnabledKey = "traversalai.talkEnabled"
let iconOverrideKey = "traversalai.iconOverride"
let connectionModeKey = "traversalai.connectionMode"
let remoteTargetKey = "traversalai.remoteTarget"
let remoteIdentityKey = "traversalai.remoteIdentity"
let remoteProjectRootKey = "traversalai.remoteProjectRoot"
let remoteCliPathKey = "traversalai.remoteCliPath"
let canvasEnabledKey = "traversalai.canvasEnabled"
let cameraEnabledKey = "traversalai.cameraEnabled"
let systemRunPolicyKey = "traversalai.systemRunPolicy"
let systemRunAllowlistKey = "traversalai.systemRunAllowlist"
let systemRunEnabledKey = "traversalai.systemRunEnabled"
let locationModeKey = "traversalai.locationMode"
let locationPreciseKey = "traversalai.locationPreciseEnabled"
let peekabooBridgeEnabledKey = "traversalai.peekabooBridgeEnabled"
let deepLinkKeyKey = "traversalai.deepLinkKey"
let modelCatalogPathKey = "traversalai.modelCatalogPath"
let modelCatalogReloadKey = "traversalai.modelCatalogReload"
let cliInstallPromptedVersionKey = "traversalai.cliInstallPromptedVersion"
let heartbeatsEnabledKey = "traversalai.heartbeatsEnabled"
let debugPaneEnabledKey = "traversalai.debugPaneEnabled"
let debugFileLogEnabledKey = "traversalai.debug.fileLogEnabled"
let appLogLevelKey = "traversalai.debug.appLogLevel"
let voiceWakeSupported: Bool = ProcessInfo.processInfo.operatingSystemVersion.majorVersion >= 26
