package ai.traversalai.android.node

import ai.traversalai.android.protocol.TraversalAICameraCommand
import ai.traversalai.android.protocol.TraversalAIDeviceCommand
import ai.traversalai.android.protocol.TraversalAILocationCommand
import ai.traversalai.android.protocol.TraversalAINotificationsCommand
import ai.traversalai.android.protocol.TraversalAISmsCommand
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test

class InvokeCommandRegistryTest {
  @Test
  fun advertisedCommands_respectsFeatureAvailability() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        cameraEnabled = false,
        locationEnabled = false,
        smsAvailable = false,
        debugBuild = false,
      )

    assertFalse(commands.contains(TraversalAICameraCommand.Snap.rawValue))
    assertFalse(commands.contains(TraversalAICameraCommand.Clip.rawValue))
    assertFalse(commands.contains(TraversalAILocationCommand.Get.rawValue))
    assertTrue(commands.contains(TraversalAIDeviceCommand.Status.rawValue))
    assertTrue(commands.contains(TraversalAIDeviceCommand.Info.rawValue))
    assertTrue(commands.contains(TraversalAINotificationsCommand.List.rawValue))
    assertFalse(commands.contains(TraversalAISmsCommand.Send.rawValue))
    assertFalse(commands.contains("debug.logs"))
    assertFalse(commands.contains("debug.ed25519"))
    assertTrue(commands.contains("app.update"))
  }

  @Test
  fun advertisedCommands_includesFeatureCommandsWhenEnabled() {
    val commands =
      InvokeCommandRegistry.advertisedCommands(
        cameraEnabled = true,
        locationEnabled = true,
        smsAvailable = true,
        debugBuild = true,
      )

    assertTrue(commands.contains(TraversalAICameraCommand.Snap.rawValue))
    assertTrue(commands.contains(TraversalAICameraCommand.Clip.rawValue))
    assertTrue(commands.contains(TraversalAILocationCommand.Get.rawValue))
    assertTrue(commands.contains(TraversalAIDeviceCommand.Status.rawValue))
    assertTrue(commands.contains(TraversalAIDeviceCommand.Info.rawValue))
    assertTrue(commands.contains(TraversalAINotificationsCommand.List.rawValue))
    assertTrue(commands.contains(TraversalAISmsCommand.Send.rawValue))
    assertTrue(commands.contains("debug.logs"))
    assertTrue(commands.contains("debug.ed25519"))
    assertTrue(commands.contains("app.update"))
  }
}
