import { omit } from 'lodash'
import {
  Document,
  FindCursor,
  FindOptions,
  Collection,
  Db,
  Filter,
  WithId,
  CreateIndexesOptions,
  IndexSpecification,
  Sort,
  MongoError,
  UpdateFilter,
  UpdateResult,
  InsertOneResult,
  InsertManyResult,
  OptionalUnlessRequiredId,
  MongoServerError,
  AggregateOptions,
  AggregationCursor,
  ObjectId,
} from 'mongodb'
import { Entry, EntryList } from '@src/types/mongo'
import { transformException } from '@src/utils'

export const DUPLICATE_KEY_ERROR_CODE: number = 11000

export interface FindEntryOptions {
  withProjection?: boolean
}

export interface FindOneOptions extends FindOptions {
  withProjection?: boolean
}

export interface UpdateResultWithId extends Omit<UpdateResult, 'upsertedId'> {
  upsertedId: string
}

export interface InsertOneResultWithId extends Omit<InsertOneResult, 'insertedId'> {
  insertedId: string
}

export interface InsertManyResultWithId extends Omit<InsertManyResult, 'insertedIds'> {
  insertedIds: string[]
}

export type ExtendedDoc<T> = OptionalUnlessRequiredId<T> & {
  createdAt: Date
  updatedAt: Date
}

export abstract class MongoAdapter<T extends Entry> {
  protected readonly defaultLimit: number = 1000
  protected readonly collectionName: string
  protected readonly entryProjection: object
  protected readonly dbConnectionRetriever: () => Db

  constructor(
    collectionName: string,
    dbConnectionRetriever: () => Db,
    projection: object = { _id: 1 },
  ) {
    this.collectionName = collectionName
    this.entryProjection = projection
    this.dbConnectionRetriever = dbConnectionRetriever
  }

  public async findEntries<L extends EntryList<T>>(
    query: Filter<T>,
    sort: Sort = { createdAt: -1 },
    limit: number = this.defaultLimit,
    page: number = 0,
    options: FindEntryOptions = { withProjection: true },
  ): Promise<L> {
    try {
      const findOptions: FindOptions<T> = {}
      if (options.withProjection) {
        findOptions.projection = this.entryProjection
      }

      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )

      const cursor: FindCursor = collection.find(query, findOptions).sort(sort)

      const totalCount: number = await collection.countDocuments(query)

      const entries: Entry[] = await cursor
        .skip(limit * page)
        .limit(limit)
        .toArray()

      const totalPages: number = Math.ceil(totalCount / limit)

      const result: L = {
        // eslint-disable-next-line no-underscore-dangle
        items: entries.map((entry: Entry) => omit({ id: entry._id.toString(), ...entry }, '_id')),
        page,
        pageSize: limit,
        totalItems: totalCount,
        totalPages,
      } as unknown as L

      return result
    } catch (error) {
      this.logAndBubble(error as Error, { query })
    }
  }

  public async findOne(
    query: Filter<T>,
    options: FindOneOptions = { withProjection: true },
  ): Promise<Omit<WithId<T>, '_id'>> {
    try {
      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )
      const entry: WithId<T> = await collection.findOne(query, options)

      // eslint-disable-next-line no-underscore-dangle
      return entry ? omit({ id: entry._id.toString(), ...entry }, '_id') : undefined
    } catch (error) {
      this.logAndBubble(error as Error, { query })
    }
  }

  public async insertOne(doc: OptionalUnlessRequiredId<T>): Promise<InsertOneResultWithId> {
    try {
      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )
      const now: Date = new Date()

      const result: InsertOneResult = await collection.insertOne({
        ...doc,
        createdAt: now,
        updatedAt: now,
      })

      return { ...result, insertedId: result.insertedId?.toString() }
    } catch (error) {
      this.logAndBubble(error as Error, { doc })
    }
  }

  public async upsertEntry(
    query: Filter<T>,
    update?: UpdateFilter<T>,
  ): Promise<{ entry?: T; updateResult: UpdateResultWithId }> {
    try {
      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )
      const now: Date = new Date()

      const setter: Partial<T> = {
        ...(update || query),
        updatedAt: now,
      } as unknown as Partial<T>

      const creationDate: Partial<T> = { createdAt: now } as unknown as T

      const updateFilter: UpdateFilter<T> = setter.created
        ? ({ $set: setter } as unknown as UpdateFilter<T>)
        : ({ $set: setter, $setOnInsert: creationDate } as unknown as UpdateFilter<T>)

      const updateResult: UpdateResult = await collection.updateOne(query, updateFilter, {
        upsert: true,
      })

      const updateResultWithId: UpdateResultWithId = {
        ...updateResult,
        upsertedId: updateResult.upsertedId?.toString(),
      }

      if (updateResult.modifiedCount > 0) {
        const entry: WithId<T> = await collection.findOne(query)

        // eslint-disable-next-line no-underscore-dangle
        return {
          entry: omit({ ...entry, id: entry._id?.toString() }, '_id') as T,
          updateResult: updateResultWithId,
        }
      } else {
        return { updateResult: updateResultWithId }
      }
    } catch (error) {
      this.logAndBubble(error as Error, { query, update })
    }
  }

  public async insertMany(
    documents: OptionalUnlessRequiredId<T>[] = [],
  ): Promise<InsertManyResultWithId> {
    try {
      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )
      const documentsToInsert: OptionalUnlessRequiredId<T>[] = documents.map(
        (document: OptionalUnlessRequiredId<T>) => {
          return {
            ...document,
            createdAt: new Date(),
          }
        },
      )

      const result: InsertManyResult = await collection.insertMany(documentsToInsert, {
        ordered: true,
      })

      return {
        ...result,
        insertedIds: Object.values(result.insertedIds).map((id: ObjectId) => id.toString()),
      }
    } catch (error) {
      this.logAndBubble(error as Error)
    }
  }

  public async aggregate<K extends Document>(
    pipeline: Document[],
    options?: AggregateOptions,
  ): Promise<{ items: K[] }> {
    try {
      const collection: Collection<T> = this.dbConnectionRetriever().collection<T>(
        this.collectionName,
      )

      const cursor: AggregationCursor<Document> = collection.aggregate(pipeline, options)

      const items: K[] = (await cursor.toArray()) as K[]

      return { items }
    } catch (error) {
      this.logAndBubble(error as Error)
    }
  }

  public async assertCollectionIndex(
    indexFields: IndexSpecification,
    options: CreateIndexesOptions,
  ): Promise<void> {
    try {
      const collection: Collection<T> = await this.assertCollection()

      const indexExists: boolean = await collection.indexExists(options.name)
      if (!indexExists) {
        try {
          const createdIndexName: string = await collection.createIndex(indexFields, options)
          console.info(
            `MongoDB: index ${createdIndexName} was asserted for collection ${this.collectionName}`,
          )
        } catch (err) {
          console.error('MongoDB: error creating index', err)
          throw new Error()
        }
      }
    } catch (dbErr) {
      const dbError: MongoError = dbErr as MongoError
      this.logAndBubble(dbError, { message: dbError.message })
    }
  }

  public async assertCollection(): Promise<Collection<T>> {
    const db: Db = this.dbConnectionRetriever()

    return (await this.collectionExists(this.collectionName))
      ? db.collection<T>(this.collectionName)
      : db.createCollection<T>(this.collectionName)
  }

  public async collectionExists(collectionName: string = this.collectionName): Promise<boolean> {
    return !!(await this.dbConnectionRetriever()
      .listCollections({ name: collectionName }, { nameOnly: true })
      .next())
  }

  private logAndBubble(error: Error, additionalInfo?: object) {
    console.error('Error in MongoDB adapter', transformException(error))
    if (error instanceof MongoServerError) {
      const err: MongoServerError = error
      if (err.name === 'MongoServerError' && err.code === DUPLICATE_KEY_ERROR_CODE) {
        throw new Error()
      }
    }
    console.info('MongoDB adapter info', { meta: { ...additionalInfo } })
    throw new Error()
  }
}
