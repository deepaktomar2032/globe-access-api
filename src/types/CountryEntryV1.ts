import { DbEntry } from '@src/types'

type Currency = {
  currencyCode: string
  currencyName: string
  currencySymbol: string
}

type Language = {
  languageCode: string
  languageName: string
}

export type CountryData = DbEntry & {
  countryName: string
  isoAlpha2Code: string
  isoAlpha3Code: string
  isoNumericCode: string
  capital: string
  continentCode: string
  continentName: string
  phoneCode: string
  currency: Currency
  language: Language
  flag: string
  emoji: string
}

export type CountryEntryV1 = CountryData
