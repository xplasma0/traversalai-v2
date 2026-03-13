package ai.traversalai.android.node

import ai.traversalai.android.protocol.TraversalAICanvasA2UICommand
import ai.traversalai.android.protocol.TraversalAICanvasCommand
import ai.traversalai.android.protocol.TraversalAICameraCommand
import ai.traversalai.android.protocol.TraversalAIDeviceCommand
import ai.traversalai.android.protocol.TraversalAILocationCommand
import ai.traversalai.android.protocol.TraversalAINotificationsCommand
import ai.traversalai.android.protocol.TraversalAIScreenCommand
import ai.traversalai.android.protocol.TraversalAISmsCommand

enum class InvokeCommandAvailability {
  Always,
  CameraEnabled,
  LocationEnabled,
  SmsAvailable,
  DebugBuild,
}

data class InvokeCommandSpec(
  val name: String,
  val requiresForeground: Boolean = false,
  val availability: InvokeCommandAvailability = InvokeCommandAvailability.Always,
)

object InvokeCommandRegistry {
  val all: List<InvokeCommandSpec> =
    listOf(
      InvokeCommandSpec(
        name = TraversalAICanvasCommand.Present.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasCommand.Hide.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasCommand.Navigate.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasCommand.Eval.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasCommand.Snapshot.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasA2UICommand.Push.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasA2UICommand.PushJSONL.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICanvasA2UICommand.Reset.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAIScreenCommand.Record.rawValue,
        requiresForeground = true,
      ),
      InvokeCommandSpec(
        name = TraversalAICameraCommand.Snap.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = TraversalAICameraCommand.Clip.rawValue,
        requiresForeground = true,
        availability = InvokeCommandAvailability.CameraEnabled,
      ),
      InvokeCommandSpec(
        name = TraversalAILocationCommand.Get.rawValue,
        availability = InvokeCommandAvailability.LocationEnabled,
      ),
      InvokeCommandSpec(
        name = TraversalAIDeviceCommand.Status.rawValue,
      ),
      InvokeCommandSpec(
        name = TraversalAIDeviceCommand.Info.rawValue,
      ),
      InvokeCommandSpec(
        name = TraversalAINotificationsCommand.List.rawValue,
      ),
      InvokeCommandSpec(
        name = TraversalAISmsCommand.Send.rawValue,
        availability = InvokeCommandAvailability.SmsAvailable,
      ),
      InvokeCommandSpec(
        name = "debug.logs",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(
        name = "debug.ed25519",
        availability = InvokeCommandAvailability.DebugBuild,
      ),
      InvokeCommandSpec(name = "app.update"),
    )

  private val byNameInternal: Map<String, InvokeCommandSpec> = all.associateBy { it.name }

  fun find(command: String): InvokeCommandSpec? = byNameInternal[command]

  fun advertisedCommands(
    cameraEnabled: Boolean,
    locationEnabled: Boolean,
    smsAvailable: Boolean,
    debugBuild: Boolean,
  ): List<String> {
    return all
      .filter { spec ->
        when (spec.availability) {
          InvokeCommandAvailability.Always -> true
          InvokeCommandAvailability.CameraEnabled -> cameraEnabled
          InvokeCommandAvailability.LocationEnabled -> locationEnabled
          InvokeCommandAvailability.SmsAvailable -> smsAvailable
          InvokeCommandAvailability.DebugBuild -> debugBuild
        }
      }
      .map { it.name }
  }
}
