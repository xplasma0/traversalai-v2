import TraversalAIKit
import Network
import Testing
@testable import TraversalAI

@Suite struct GatewayEndpointIDTests {
    @Test func stableIDForServiceDecodesAndNormalizesName() {
        let endpoint = NWEndpoint.service(
            name: "TraversalAI\\032Gateway   \\032  Node\n",
            type: "_traversalai-gw._tcp",
            domain: "local.",
            interface: nil)

        #expect(GatewayEndpointID.stableID(endpoint) == "_traversalai-gw._tcp|local.|TraversalAI Gateway Node")
    }

    @Test func stableIDForNonServiceUsesEndpointDescription() {
        let endpoint = NWEndpoint.hostPort(host: NWEndpoint.Host("127.0.0.1"), port: 4242)
        #expect(GatewayEndpointID.stableID(endpoint) == String(describing: endpoint))
    }

    @Test func prettyDescriptionDecodesBonjourEscapes() {
        let endpoint = NWEndpoint.service(
            name: "TraversalAI\\032Gateway",
            type: "_traversalai-gw._tcp",
            domain: "local.",
            interface: nil)

        let pretty = GatewayEndpointID.prettyDescription(endpoint)
        #expect(pretty == BonjourEscapes.decode(String(describing: endpoint)))
        #expect(!pretty.localizedCaseInsensitiveContains("\\032"))
    }
}
