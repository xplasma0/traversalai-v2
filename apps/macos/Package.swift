// swift-tools-version: 6.2
// Package manifest for the TraversalAI macOS companion (menu bar app + IPC library).

import PackageDescription

let package = Package(
    name: "TraversalAI",
    platforms: [
        .macOS(.v15),
    ],
    products: [
        .library(name: "TraversalAIIPC", targets: ["TraversalAIIPC"]),
        .library(name: "TraversalAIDiscovery", targets: ["TraversalAIDiscovery"]),
        .executable(name: "TraversalAI", targets: ["TraversalAI"]),
        .executable(name: "traversalai-mac", targets: ["TraversalAIMacCLI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/orchetect/MenuBarExtraAccess", exact: "1.2.2"),
        .package(url: "https://github.com/swiftlang/swift-subprocess.git", from: "0.1.0"),
        .package(url: "https://github.com/apple/swift-log.git", from: "1.8.0"),
        .package(url: "https://github.com/sparkle-project/Sparkle", from: "2.8.1"),
        .package(url: "https://github.com/steipete/Peekaboo.git", branch: "main"),
        .package(path: "../shared/TraversalAIKit"),
        .package(path: "../../Swabble"),
    ],
    targets: [
        .target(
            name: "TraversalAIIPC",
            dependencies: [],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "TraversalAIDiscovery",
            dependencies: [
                .product(name: "TraversalAIKit", package: "TraversalAIKit"),
            ],
            path: "Sources/TraversalAIDiscovery",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "TraversalAI",
            dependencies: [
                "TraversalAIIPC",
                "TraversalAIDiscovery",
                .product(name: "TraversalAIKit", package: "TraversalAIKit"),
                .product(name: "TraversalAIChatUI", package: "TraversalAIKit"),
                .product(name: "TraversalAIProtocol", package: "TraversalAIKit"),
                .product(name: "SwabbleKit", package: "swabble"),
                .product(name: "MenuBarExtraAccess", package: "MenuBarExtraAccess"),
                .product(name: "Subprocess", package: "swift-subprocess"),
                .product(name: "Logging", package: "swift-log"),
                .product(name: "Sparkle", package: "Sparkle"),
                .product(name: "PeekabooBridge", package: "Peekaboo"),
                .product(name: "PeekabooAutomationKit", package: "Peekaboo"),
            ],
            exclude: [
                "Resources/Info.plist",
            ],
            resources: [
                .copy("Resources/TraversalAI.icns"),
                .copy("Resources/DeviceModels"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .executableTarget(
            name: "TraversalAIMacCLI",
            dependencies: [
                "TraversalAIDiscovery",
                .product(name: "TraversalAIKit", package: "TraversalAIKit"),
                .product(name: "TraversalAIProtocol", package: "TraversalAIKit"),
            ],
            path: "Sources/TraversalAIMacCLI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "TraversalAIIPCTests",
            dependencies: [
                "TraversalAIIPC",
                "TraversalAI",
                "TraversalAIDiscovery",
                .product(name: "TraversalAIProtocol", package: "TraversalAIKit"),
                .product(name: "SwabbleKit", package: "swabble"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
