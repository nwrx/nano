import { execFile } from 'node:child_process'
import { defineComponent } from '../../utils/defineComponent'

export const execute = defineComponent(
  {
    isTrusted: true,
    title: 'Execute',
    icon: 'https://api.iconify.design/mdi:console.svg',
    description: 'The **Execute** node is designed to execute a process at the given path. Effectively allowing you to run shell commands and file operations.',
    inputs: {
      executable: {
        type: 'string',
        title: 'Executable',
        description: 'The path to the executable.',
        examples: [
          '/bin/bash',
          '/usr/bin/ls',
          '/usr/bin/curl',
        ],
      },
      parameters: {
        'type': 'array',
        'title': 'Parameters',
        'description': 'The parameters to pass to the executable.',
        'items': { type: 'string' },
        'x-optional': true,
        'examples': [
          ['-l'],
          ['-a', '/path/to/file'],
          ['-X', 'POST', '--data', 'Hello, world!'],
        ],
      },
    },
    outputs: {
      stdout: {
        'title': 'Output',
        'type': 'string',
        'description': 'The result of the shell command or file operation.',
        'x-optional': true,
      },
      stderr: {
        'title': 'Error',
        'type': 'string',
        'description': 'The error message if the shell command or file operation failed.',
        'x-optional': true,
      },
    },
  },
  async({ data, thread }) => {
    const { executable, parameters = [] } = data
    return new Promise((resolve, reject) => {
      let stdout = ''
      let stderr = ''
      const child = execFile(executable, parameters, { signal: thread.abortController.signal })
      child.stdout!.on('data', (data: string) => { stdout += data })
      child.stderr!.on('data', (data: string) => { stderr += data })
      child.on('error', reject)
      child.on('close', code => resolve(code === 0
        ? { stdout, stderr: undefined }
        : { stdout: undefined, stderr },
      ))
    })
  },
)
