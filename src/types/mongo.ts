import { ObjectId } from 'mongodb'

export interface Entry {
  _id?: ObjectId
  created?: Date
  updated?: Date
}

export interface EntryList<T extends Omit<Entry, '_id'>> {
  items: T[]
}

export interface Pagination {
  pageSize: number
  page: number
  totalPages: number
  totalItems: number
}

export interface DbEntry extends Entry {
  createdAt?: Date
  updatedAt?: Date
}
