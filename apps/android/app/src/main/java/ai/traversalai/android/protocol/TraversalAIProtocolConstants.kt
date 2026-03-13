package ai.traversalai.android.protocol

enum class TraversalAICapability(val rawValue: String) {
  Canvas("canvas"),
  Camera("camera"),
  Screen("screen"),
  Sms("sms"),
  VoiceWake("voiceWake"),
  Location("location"),
  Device("device"),
}

enum class TraversalAICanvasCommand(val rawValue: String) {
  Present("canvas.present"),
  Hide("canvas.hide"),
  Navigate("canvas.navigate"),
  Eval("canvas.eval"),
  Snapshot("canvas.snapshot"),
  ;

  companion object {
    const val NamespacePrefix: String = "canvas."
  }
}

enum class TraversalAICanvasA2UICommand(val rawValue: String) {
  Push("canvas.a2ui.push"),
  PushJSONL("canvas.a2ui.pushJSONL"),
  Reset("canvas.a2ui.reset"),
  ;

  companion object {
    const val NamespacePrefix: String = "canvas.a2ui."
  }
}

enum class TraversalAICameraCommand(val rawValue: String) {
  Snap("camera.snap"),
  Clip("camera.clip"),
  ;

  companion object {
    const val NamespacePrefix: String = "camera."
  }
}

enum class TraversalAIScreenCommand(val rawValue: String) {
  Record("screen.record"),
  ;

  companion object {
    const val NamespacePrefix: String = "screen."
  }
}

enum class TraversalAISmsCommand(val rawValue: String) {
  Send("sms.send"),
  ;

  companion object {
    const val NamespacePrefix: String = "sms."
  }
}

enum class TraversalAILocationCommand(val rawValue: String) {
  Get("location.get"),
  ;

  companion object {
    const val NamespacePrefix: String = "location."
  }
}

enum class TraversalAIDeviceCommand(val rawValue: String) {
  Status("device.status"),
  Info("device.info"),
  ;

  companion object {
    const val NamespacePrefix: String = "device."
  }
}

enum class TraversalAINotificationsCommand(val rawValue: String) {
  List("notifications.list"),
  ;

  companion object {
    const val NamespacePrefix: String = "notifications."
  }
}
