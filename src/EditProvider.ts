import * as vscode from "vscode"
import { FORMAT_CURR_FILE } from "./const"
import { debounce } from "./utils"

export default class EditProvider
  implements vscode.DocumentFormattingEditProvider {
  public async provideDocumentFormattingEdits(
    document: vscode.TextDocument,
    options: vscode.FormattingOptions,
    token: vscode.CancellationToken
  ): Promise<vscode.TextEdit[]> {
    return this.provideEdits(document)
  }

  private provideEdits = async (
    document: vscode.TextDocument
  ): Promise<vscode.TextEdit[]> => {
    debounce(() => {
      vscode.commands.executeCommand(FORMAT_CURR_FILE, document.uri)
    }, 1000)()

    return []
  }
}
