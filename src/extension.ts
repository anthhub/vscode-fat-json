import * as vscode from "vscode";
import { EXT_NAME, FORMAT_CURR_FILE, OPEN_AND_FORMAT_FILE } from "./const";
import {
  registerStatusBar,
  setLoadingStatus,
  setSuccessStatus,
  setErrorStatus,
  childProcessExcuteCmd,
  setDefaultStatus,
} from "./utils";
const { resolve } = require("path");

let isFormating = false;
let isLoading = false;

const getIsFormating = () => isFormating;
const setIsFormating = (flag: boolean) => {
  setTimeout(() => {
    isFormating = flag;
  }, 1);
};

const getIsLoading = () => isLoading;
const setIsLoading = (flag: boolean) => {
  setTimeout(() => {
    isLoading = flag;
  }, 1);
};

export function activate(context: vscode.ExtensionContext) {
  registerStatusBar(context);

  context.subscriptions.push(
    vscode.commands.registerCommand(FORMAT_CURR_FILE, (uri) => {
      const path: string = uri?.path;
      toFormat(path);
    })
  );

  context.subscriptions.push(
    vscode.commands.registerCommand(OPEN_AND_FORMAT_FILE, async () => {
      console.log(getIsLoading());
      if (getIsFormating() || getIsLoading()) {
        return;
      }
      isLoading = true;

      let options = {
        canSelectFiles: true, //是否可选择文件
        canSelectFolders: false, //是否可选择目录
        canSelectMany: false, //是否可多选
        // defaultUri: vscode.Uri.file(""), //默认打开的文件夹
        openLabel: "选择 JSON 文件",
        filters: { json: ["json"] },
      };

      await vscode.window
        .showOpenDialog(options)
        .then(
          async (result) => {
            const path = result?.[0]?.path;
            if (path !== undefined) {
              await toFormat(path);
              var setting: vscode.Uri = vscode.Uri.parse(path);

              vscode.workspace.openTextDocument(setting).then(
                (a: vscode.TextDocument) => {
                  return vscode.window.showTextDocument(a, -1, false).then(
                    (editor) => {
                      const msg = `Loaded`;
                      outputChannel.appendLine("\n" + msg + "\n");
                      setIsLoading(false);
                    },
                    (err) => {
                      setIsLoading(false);
                      console.error(err);
                    }
                  );
                },
                (err) => {
                  setIsLoading(false);
                  console.error(err);
                }
              );
            } else {
              setIsLoading(false);
            }
          },
          (err) => {
            setIsLoading(false);
            console.error(err);
          }
        )
        .then(
          () => {},
          (err) => {
            setIsLoading(false);
            console.error(err);
          }
        );
    })
  );
}

const outputChannel = vscode.window.createOutputChannel(EXT_NAME);
let timer: NodeJS.Timeout;

async function toFormat(path: string) {
  clearTimeout(timer);
  isFormating = true;

  console.log("start to parse path: " + path);
  setLoadingStatus("Formatting...");

  const start = Date.now();
  try {
    await childProcessExcuteCmd(
      [`./jsonxf -i ${path} -o ${path}`],
      resolve(__dirname, "./cmd/")
    );
    const end = Date.now();
    const msg = `Formated ${end - start}ms`;
    setSuccessStatus(msg);

    outputChannel.appendLine("\n" + msg + "\n");
  } catch (error) {
    setErrorStatus();
    const msg = `parse error: ${error}`;
    outputChannel.appendLine("\n" + msg + "\n");
    outputChannel.show();
  }
  setIsFormating(false);

  timer = setTimeout(() => {
    setDefaultStatus();
  }, 1000 * 60);
}
