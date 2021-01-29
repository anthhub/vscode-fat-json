import * as vscode from "vscode"

import EditProvider from "./EditProvider"
import Formatter from "./Formatter"
import { registerStatusBar } from "./statusBar"

export function activate(context: vscode.ExtensionContext) {
  registerStatusBar(context)

  new Formatter().activate(context.subscriptions)

  vscode.languages.registerDocumentFormattingEditProvider(
    ["json", "JSON"],
    new EditProvider()
  )
}
