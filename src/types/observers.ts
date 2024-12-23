import { Db } from 'mongodb'

export interface DbConnectionObserver {
  update: (isConnected: boolean, db: Db) => Promise<void>
}
