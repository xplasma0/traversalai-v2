package ai.traversalai.android.protocol

import org.junit.Assert.assertEquals
import org.junit.Test

class TraversalAIProtocolConstantsTest {
  @Test
  fun canvasCommandsUseStableStrings() {
    assertEquals("canvas.present", TraversalAICanvasCommand.Present.rawValue)
    assertEquals("canvas.hide", TraversalAICanvasCommand.Hide.rawValue)
    assertEquals("canvas.navigate", TraversalAICanvasCommand.Navigate.rawValue)
    assertEquals("canvas.eval", TraversalAICanvasCommand.Eval.rawValue)
    assertEquals("canvas.snapshot", TraversalAICanvasCommand.Snapshot.rawValue)
  }

  @Test
  fun a2uiCommandsUseStableStrings() {
    assertEquals("canvas.a2ui.push", TraversalAICanvasA2UICommand.Push.rawValue)
    assertEquals("canvas.a2ui.pushJSONL", TraversalAICanvasA2UICommand.PushJSONL.rawValue)
    assertEquals("canvas.a2ui.reset", TraversalAICanvasA2UICommand.Reset.rawValue)
  }

  @Test
  fun capabilitiesUseStableStrings() {
    assertEquals("canvas", TraversalAICapability.Canvas.rawValue)
    assertEquals("camera", TraversalAICapability.Camera.rawValue)
    assertEquals("screen", TraversalAICapability.Screen.rawValue)
    assertEquals("voiceWake", TraversalAICapability.VoiceWake.rawValue)
    assertEquals("location", TraversalAICapability.Location.rawValue)
    assertEquals("sms", TraversalAICapability.Sms.rawValue)
    assertEquals("device", TraversalAICapability.Device.rawValue)
  }

  @Test
  fun screenCommandsUseStableStrings() {
    assertEquals("screen.record", TraversalAIScreenCommand.Record.rawValue)
  }

  @Test
  fun notificationsCommandsUseStableStrings() {
    assertEquals("notifications.list", TraversalAINotificationsCommand.List.rawValue)
  }

  @Test
  fun deviceCommandsUseStableStrings() {
    assertEquals("device.status", TraversalAIDeviceCommand.Status.rawValue)
    assertEquals("device.info", TraversalAIDeviceCommand.Info.rawValue)
  }
}
