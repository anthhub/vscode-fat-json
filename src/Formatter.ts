import * as vscode from "vscode"
import { FORMAT_CURR_FILE, OPEN_AND_FORMAT_FILE } from "./const"
import { format } from "./format"

export default class Formatter {
  private opening: boolean = false

  public activate(subscriptions: vscode.Disposable[]) {
    subscriptions.push(
      vscode.commands.registerCommand(
        FORMAT_CURR_FILE,
        this.formatCurrFile,
        this
      ),
      vscode.commands.registerCommand(
        OPEN_AND_FORMAT_FILE,
        this.openAndFormat,
        this
      )
    )
  }

  private async formatCurrFile(uri: vscode.Uri) {
    const path: string = uri?.path
    await format(path)
  }

  private async openAndFormat() {
    if (this.opening) {
      return
    }
    this.opening = true

    let options = {
      canSelectFiles: true, //是否可选择文件
      canSelectFolders: false, //是否可选择目录
      canSelectMany: false, //是否可多选
      openLabel: "选择 JSON 文件",
      filters: { json: ["json"] },
    }

    try {
      const result = await vscode.window.showOpenDialog(options)
      const fsPath = result?.[0]?.path
      if (fsPath !== undefined) {
        await format(fsPath)
        const setting: vscode.Uri = vscode.Uri.parse(fsPath)
        const textDocument = await vscode.workspace.openTextDocument(setting)
        await vscode.window.showTextDocument(textDocument, -1, false)
      }
    } catch (error) {
      console.error(error)
    }
    this.opening = false
  }
}
