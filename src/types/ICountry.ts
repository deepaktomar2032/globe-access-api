import { CountryEntryV1 } from './CountryEntryV1'

export type Request = {
  countryName: string
  isoAlpha2Code: string
}

type VisaStatus = {
  visaStatus: CountryEntryV1[]
}

export type Response = CountryEntryV1 & VisaStatus
