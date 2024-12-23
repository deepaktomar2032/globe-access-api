import { Db } from 'mongodb'
import { OBSERVABLE_TOPICS } from '@src/constants'
import { getDB, MongoAdapter } from '@src/database'
import { Injectable, Observer } from '@src/decorators'
import { CountryEntryV1 } from '@src/types'
import { DbConnectionObserver } from '@src/types/observers'

@Observer('CountryAdapter', OBSERVABLE_TOPICS.DATABASE_CONNECTION_ESTABLISHED)
@Injectable('CountryAdapter', 'country', getDB)
export class CountryAdapter<T extends CountryEntryV1> extends MongoAdapter<T> implements DbConnectionObserver {
  public async update(isConnected: boolean, db: Db): Promise<void> {
    if (isConnected && db) {
      try {
        await this.assertCollectionIndex({ createdAt: -1 }, { name: 'i_country' })
      } catch (err) {
        console.error('CountryAdapter:update:assertCollectionIndex', err)
      }
    }
  }
}
