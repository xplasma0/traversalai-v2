package ai.traversalai.android.ui

import androidx.compose.runtime.Composable
import ai.traversalai.android.MainViewModel
import ai.traversalai.android.ui.chat.ChatSheetContent

@Composable
fun ChatSheet(viewModel: MainViewModel) {
  ChatSheetContent(viewModel = viewModel)
}
