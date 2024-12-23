// eslint-disable-next-line @typescript-eslint/no-require-imports
require('dotenv').config()

import { ClientSession, Db, MongoClient } from 'mongodb'
import { OBSERVABLE_TOPICS } from '@src/constants/observers'
import { DbConnectionObserver } from '@src/types/observers'
import { getObservers } from '@src/utils/getObservers'
import { MONGODB_URI, MONGODB_DATABASE_NAME, MONGODB_CONNECT_TIMEOUTMS } from '@src/constants'

let db: Db
let session: ClientSession

export const connectToMongoDB: () => Promise<void> = async (): Promise<void> => {
  const defaultConnectionTimeout: number = 30000

  try {
    const mongoUri: string = MONGODB_URI
    const dbName: string = MONGODB_DATABASE_NAME

    const client: MongoClient = new MongoClient(mongoUri, {
      connectTimeoutMS: MONGODB_CONNECT_TIMEOUTMS || defaultConnectionTimeout
    })

    let serverHeartbeatFailed: number = 0
    let wasReconnected: boolean = false

    const loginfoAndContinue: () => void = (): void => {
      console.info('connectToMongoDB: MongoDB connection regained')
      wasReconnected = true
      serverHeartbeatFailed = 0
    }

    client.on('serverHeartbeatFailed', () => {
      console.warn('MongoDB connection lost')
      serverHeartbeatFailed = serverHeartbeatFailed + 1
      wasReconnected = false

      if (!wasReconnected) {
        console.error(`connectToMongoDB: MongoDB Connection Error - retry: ${serverHeartbeatFailed} -`)
      }

      client.once('serverHeartbeatSucceeded', loginfoAndContinue)
    })

    await client.connect()

    db = client.db(dbName)
    session = client.startSession()

    // Notify observers
    getObservers<DbConnectionObserver>(OBSERVABLE_TOPICS.DATABASE_CONNECTION_ESTABLISHED).forEach(
      (observer: DbConnectionObserver) => {
        try {
          observer.update(true, db).catch((err: Error) => {
            console.error('connectToMongoDB:observer update', err)
          })
        } catch (err) {
          console.error('connectToMongoDB:observer', err)
        }
      }
    )

    console.info('connectToMongoDB: MongoDB initialized connection')
  } catch (error) {
    console.error('connectToMongoDB: MongoDB Connection Error', error)

    throw new Error()
  }
}

export const getDB: () => Db = (): Db => db

export const getSession: () => ClientSession = (): ClientSession => session
