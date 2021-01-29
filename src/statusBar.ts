import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
} from "vscode"
import {
  EXT_NAME,
  SUCCESS,
  SPINNER,
  OPEN_AND_FORMAT_FILE,
  ERROR,
} from "./const"

let statusBar: StatusBarItem

export function registerStatusBar(context: ExtensionContext): void {
  if (statusBar) {
    return
  }

  statusBar = window.createStatusBarItem(StatusBarAlignment.Left, -1)
  statusBar.command = OPEN_AND_FORMAT_FILE
  statusBar.tooltip = `${EXT_NAME} (Open file to format)`
  setSuccessStatus(`Faster formatter`)
  statusBar.show()

  context.subscriptions.push(statusBar)
}

export function setDefaultStatus(): void {
  setSuccessStatus(`Faster formatter`)
}

export function setSuccessStatus(issue?: string | undefined | null): void {
  setStatusBar(SUCCESS, issue)
}

export function setLoadingStatus(issue?: string | undefined | null): void {
  setStatusBar(SPINNER, issue)
}

export function setErrorStatus(issue?: string | undefined | null): void {
  setStatusBar(ERROR, issue)
  statusBar.color = new ThemeColor("errorForeground")
}

function setStatusBar(
  icon?: string | undefined | null,
  issue?: string | undefined | null
) {
  const iconText = icon ? ` ${icon}` : ""
  const issueText = issue ? `: ${issue}` : ""

  statusBar.text = `${iconText} ${EXT_NAME}${issueText}`
  statusBar.color = new ThemeColor("panelTitle.activeForeground")
}
