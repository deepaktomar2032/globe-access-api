/* eslint-disable @typescript-eslint/no-explicit-any */
// eslint-disable-next-line @typescript-eslint/no-require-imports
require('module-alias/register')
import { connectToMongoDB } from '@src/database'
import { initializeServer } from '@src/server/server'

let tryReconnect: NodeJS.Timeout
let reTryInterval: number = 1000
const EXP_RATE: number = 2
const MAX_RETRY_INTERVAL: number = 30000 // 30s = 30 * 1000

const initializeDependencies = async () => {
  try {
    clearTimeout(tryReconnect)
    await connectToMongoDB()
    console.info('dependencies has been initialized')
  } catch (error) {
    console.error('Failed to initialize API dependencies:', error)
    tryReconnect = setTimeout(initializeDependencies, reTryInterval)
    reTryInterval = Math.max(reTryInterval * EXP_RATE, MAX_RETRY_INTERVAL)
  }
}

Promise.resolve()
  .then(initializeServer)
  .then(initializeDependencies)
  .then(() => {
    console.info('Server started')
  })
  .catch((error: Error): void => {
    console.error('Failed to initialize API', error)
    process.exit(1)
  })

const terminator: (sig: any) => void = (sig: any): void => {
  if (typeof sig === 'string') {
    console.debug(`Received ${sig} - terminating app ...`, 'index')
    process.exit(1)
  }
  console.debug('Node server stopped.', 'index')
}
;[
  'SIGHUP',
  'SIGINT',
  'SIGQUIT',
  'SIGILL',
  'SIGTRAP',
  'SIGABRT',
  'SIGBUS',
  'SIGFPE',
  'SIGUSR1',
  'SIGSEGV',
  'SIGUSR2',
  'SIGTERM',
].forEach((signal: any): void => {
  process.on(signal, (): void => {
    terminator(signal)
  })
})

process.on('uncaughtException', (err: any): void => {
  console.error('UncaughtError', err)
  terminator('uncaughtException')
})
