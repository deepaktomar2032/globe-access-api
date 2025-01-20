import { DbEntry } from '@src/types'

type ImmigrationData = DbEntry & {
  sourceCountry: string
  destinationCountry: string
  visaStatus: string
}

export type ImmigrationEntryV1 = ImmigrationData
