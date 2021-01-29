import * as vscode from "vscode"
import { EXT_NAME } from "./const"
import {
  setDefaultStatus,
  setLoadingStatus,
  setSuccessStatus,
  setErrorStatus,
} from "./statusBar"
import { debounce, childProcessExcuteCmd } from "./utils"

const { resolve } = require("path")

const outputChannel = vscode.window.createOutputChannel(EXT_NAME)

const setDefaultStatusDebounced = debounce(setDefaultStatus, 1000 * 60)

export async function format(path: string) {
  setLoadingStatus("Formatting...")

  const hrStart = process.hrtime()
  try {
    await childProcessExcuteCmd(
      [`./jsonxf -i ${path} -o ${path}`],
      resolve(__dirname, "./cmd/")
    )
    const hrEnd = process.hrtime(hrStart)
    const msg = `Formatted in ${Math.floor(hrEnd[1] / 1000000)}ms`
    setSuccessStatus(msg)

    outputChannel.appendLine("\n" + msg + "\n")
  } catch (error) {
    setErrorStatus()

    const msg = `parse error: ${error}`
    outputChannel.appendLine("\n" + msg + "\n")
    outputChannel.show()
  } finally {
    setDefaultStatusDebounced()
  }
}
