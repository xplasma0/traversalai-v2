import TraversalAIKit
import Testing

@Suite struct BonjourEscapesTests {
    @Test func decodePassThrough() {
        #expect(BonjourEscapes.decode("hello") == "hello")
        #expect(BonjourEscapes.decode("") == "")
    }

    @Test func decodeSpaces() {
        #expect(BonjourEscapes.decode("TraversalAI\\032Gateway") == "TraversalAI Gateway")
    }

    @Test func decodeMultipleEscapes() {
        #expect(BonjourEscapes.decode("A\\038B\\047C\\032D") == "A&B/C D")
    }

    @Test func decodeIgnoresInvalidEscapeSequences() {
        #expect(BonjourEscapes.decode("Hello\\03World") == "Hello\\03World")
        #expect(BonjourEscapes.decode("Hello\\XYZWorld") == "Hello\\XYZWorld")
    }

    @Test func decodeUsesDecimalUnicodeScalarValue() {
        #expect(BonjourEscapes.decode("Hello\\065World") == "HelloAWorld")
    }
}
