import * as child_process from "child_process"

export function childProcessExcuteCmd(
  cmds: string | string[],
  path?: string
): Promise<string> {
  let cmd = Array.isArray(cmds) ? cmds.join(` && `) : cmds
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
          reject(error)
        }
        resolve(stdout.toString())
      }
    )
  })
}

export function debounce<T extends (...args: T[]) => any>(
  func: Function,
  time: number
) {
  let timer: NodeJS.Timeout | null
  const fn = (...args: T[]) => {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
    timer = setTimeout(() => {
      func(...args)
    }, time)
  }

  return fn
}

export function throttle(func: Function, time: number) {
  let timer: NodeJS.Timeout | null
  return () => {
    if (timer) {
      return
    }
    timer = setTimeout(() => {
      func()
      timer = null
    }, time)
  }
}
