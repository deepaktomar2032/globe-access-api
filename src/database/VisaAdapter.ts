import { Db } from 'mongodb'
import { OBSERVABLE_TOPICS } from '@src/constants'
import { getDB, MongoAdapter } from '@src/database'
import { Injectable, Observer } from '@src/decorators'
import { VisaEntryV1 } from '@src/types'
import { DbConnectionObserver } from '@src/types/observers'

@Observer('VisaAdapter', OBSERVABLE_TOPICS.DATABASE_CONNECTION_ESTABLISHED)
@Injectable('VisaAdapter', 'visa', getDB)
export class VisaAdapter<T extends VisaEntryV1>
  extends MongoAdapter<T>
  implements DbConnectionObserver
{
  public async update(isConnected: boolean, db: Db): Promise<void> {
    if (isConnected && db) {
      try {
        await this.assertCollectionIndex({ createdAt: -1 }, { name: 'i_visa' })
      } catch (err) {
        console.error('VisaAdapter:update:assertCollectionIndex', err)
      }
    }
  }
}
