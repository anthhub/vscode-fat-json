import * as child_process from "child_process";
import {
  ExtensionContext,
  StatusBarAlignment,
  StatusBarItem,
  ThemeColor,
  window,
} from "vscode";
import {
  EXT_NAME,
  SUCCESS,
  SPINNER,
  WARNING,
  OPEN_AND_FORMAT_FILE,
} from "./const";
const { resolve } = require("path");

let statusBar: StatusBarItem;

export function registerStatusBar(context: ExtensionContext): void {
  if (statusBar) {
    return;
  }

  statusBar = window.createStatusBarItem(StatusBarAlignment.Left, -1);
  statusBar.command = OPEN_AND_FORMAT_FILE;
  statusBar.tooltip = `${EXT_NAME} (Open file to format)`;
  setSuccessStatus(`Faster formatter`);
  statusBar.show();

  context.subscriptions.push(statusBar);
}

export function setDefaultStatus(): void {
  setSuccessStatus(`Faster formatter`);
}

export function setSuccessStatus(issue?: string | undefined | null): void {
  setStatusBar(SUCCESS, issue);
}

export function setLoadingStatus(issue?: string | undefined | null): void {
  setStatusBar(SPINNER, issue);
}

export function setErrorStatus(issue?: string | undefined | null): void {
  setStatusBar(WARNING, issue);
  statusBar.color = new ThemeColor("errorForeground");
}

function setStatusBar(
  icon?: string | undefined | null,
  issue?: string | undefined | null
) {
  const iconText = icon ? ` ${icon}` : "";
  const issueText = issue ? `: ${issue}` : "";

  statusBar.text = `${iconText} ${EXT_NAME}${issueText}`;
  statusBar.color = new ThemeColor("foreground");
}

export function childProcessExcuteCmd(
  cmds: string | string[],
  path?: string
): Promise<string> {
  let cmd = Array.isArray(cmds) ? cmds.join(` && `) : cmds;
  return new Promise((resolve, reject) => {
    child_process.exec(
      cmd,
      { cwd: path },
      (
        error: child_process.ExecException | null,
        stdout: string | Buffer,
        stderr: string | Buffer
      ) => {
        if (error) {
          reject(error);
        }
        resolve(stdout.toString());
      }
    );
  });
}
