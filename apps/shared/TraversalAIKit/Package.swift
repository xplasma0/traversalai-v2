// swift-tools-version: 6.2

import PackageDescription

let package = Package(
    name: "TraversalAIKit",
    platforms: [
        .iOS(.v18),
        .macOS(.v15),
    ],
    products: [
        .library(name: "TraversalAIProtocol", targets: ["TraversalAIProtocol"]),
        .library(name: "TraversalAIKit", targets: ["TraversalAIKit"]),
        .library(name: "TraversalAIChatUI", targets: ["TraversalAIChatUI"]),
    ],
    dependencies: [
        .package(url: "https://github.com/steipete/ElevenLabsKit", exact: "0.1.0"),
        .package(url: "https://github.com/gonzalezreal/textual", exact: "0.3.1"),
    ],
    targets: [
        .target(
            name: "TraversalAIProtocol",
            path: "Sources/TraversalAIProtocol",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "TraversalAIKit",
            dependencies: [
                "TraversalAIProtocol",
                .product(name: "ElevenLabsKit", package: "ElevenLabsKit"),
            ],
            path: "Sources/TraversalAIKit",
            resources: [
                .process("Resources"),
            ],
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .target(
            name: "TraversalAIChatUI",
            dependencies: [
                "TraversalAIKit",
                .product(
                    name: "Textual",
                    package: "textual",
                    condition: .when(platforms: [.macOS, .iOS])),
            ],
            path: "Sources/TraversalAIChatUI",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
            ]),
        .testTarget(
            name: "TraversalAIKitTests",
            dependencies: ["TraversalAIKit", "TraversalAIChatUI"],
            path: "Tests/TraversalAIKitTests",
            swiftSettings: [
                .enableUpcomingFeature("StrictConcurrency"),
                .enableExperimentalFeature("SwiftTesting"),
            ]),
    ])
