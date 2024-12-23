import { DbEntry } from '@src/types'

interface VisaData extends DbEntry {
  sourceCountry: string
  destinationCountry: string
  visaStatus: string
}

export type VisaEntryV1 = VisaData

// export type statusType =
//   | 'visa free'
//   | 'e-visa'
//   | 'visa required'
//   | 'visa on arrival'
//   | '90'
//   | '30'
//   | '21'
//   | '-1'
