import { Db } from 'mongodb'
import { OBSERVABLE_TOPICS } from '@src/constants'
import { getDB, MongoAdapter } from '@src/database'
import { Injectable, Observer } from '@src/decorators'
import { ImmigrationEntryV1 } from '@src/types'
import { DbConnectionObserver } from '@src/types/observers'

@Observer('ImmigrationAdapter', OBSERVABLE_TOPICS.DATABASE_CONNECTION_ESTABLISHED)
@Injectable('ImmigrationAdapter', 'immigration', getDB)
export class ImmigrationAdapter<T extends ImmigrationEntryV1> extends MongoAdapter<T> implements DbConnectionObserver {
  public async update(isConnected: boolean, db: Db): Promise<void> {
    if (isConnected && db) {
      try {
        await this.assertCollectionIndex({ createdAt: -1 }, { name: 'i_immigration' })
      } catch (err) {
        console.error('ImmigrationAdapter:update:assertCollectionIndex', err)
      }
    }
  }
}
