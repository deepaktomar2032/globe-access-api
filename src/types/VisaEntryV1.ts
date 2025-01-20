import { DbEntry } from '@src/types'

interface ImmigrationData extends DbEntry {
  sourceCountry: string
  destinationCountry: string
  visaStatus: string
}

export type ImmigrationEntryV1 = ImmigrationData
