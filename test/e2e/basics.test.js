import { join } from 'path'
import { platform } from 'os'

import execa from 'execa'

let cmd = null
switch (platform()) {
  case 'win32':
    cmd = 'contentful-cli-win.exe'
    break
  case 'linux':
    cmd = 'contentful-cli-linux'
    break
  case 'darwin':
    cmd = 'contentful-cli-macos'
    break
}
if (!cmd) {
  throw new Error(`Platform ${platform()} is not supported`)
}

const packageVersion = require('../../package.json').version
const cwd = join(__dirname, '../../', 'build')
cmd = join(cwd, cmd)

test('should return code 1 when errors exist no args', async () => {
  await expect(execa.shell(cmd)).rejects.toThrowErrorMatchingSnapshot()
})

test('should print help message', async () => {
  const {stdout} = await execa.shell(`${cmd} --help`)
  expect(stdout).toMatchSnapshot()
})

test('should print help message on shortcut', async () => {
  const {stdout} = await execa.shell(`${cmd} -h`)
  expect(stdout).toMatchSnapshot()
})

test('should print help message on wrong subcommand', async () => {
  await expect(execa.shell(`${cmd} lolbar`)).rejects.toThrowErrorMatchingSnapshot()
})

test('should print version number', async () => {
  const {stdout} = await execa.shell(`${cmd} --version`)
  await expect(stdout).toContain(packageVersion)
})
