import { Db } from 'mongodb'

/**
 * Db Connection observer
 */
export interface DbConnectionObserver {
  update: (isConnected: boolean, db: Db) => Promise<void>
}
