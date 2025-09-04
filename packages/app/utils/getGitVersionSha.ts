/* eslint-disable unicorn/no-useless-undefined */
import { spawn } from 'node:child_process'

/**
 * Get the current git commit SHA for the nano repository.
 *
 * @returns The current git commit SHA or undefined if it cannot be determined.
 * @example await getGitVersionSha() // "abc123"
 */
export function getGitVersionSha(): Promise<string | undefined> {
  const process = spawn('/usr/bin/env', ['git', 'rev-parse', 'HEAD'], { stdio: 'pipe' })
  return new Promise<string | undefined>((resolve) => {
    process.stdout.on('data', (data: Buffer) => resolve(data.toString().trim()))
    process.stderr.on('data', () => resolve(undefined))
  })
}
