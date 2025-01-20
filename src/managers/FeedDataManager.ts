import { CountryAdapter, ImmigrationAdapter } from '@src/database'
import { Inject } from '@src/decorators'
import { CountryEntryV1, ImmigrationEntryV1 } from '@src/types'
import { transformException } from '@src/utils'

type Strings = Record<string, string>

class FeedDataManager {
  @Inject('CountryAdapter') private readonly countryAdapter: CountryAdapter<CountryEntryV1>
  @Inject('ImmigrationAdapter') private readonly immigrationAdapter: ImmigrationAdapter<ImmigrationEntryV1>

  public async insertCountryData(countryEntries: CountryEntryV1[]): Promise<void> {
    try {
      await this.countryAdapter.insertMany(countryEntries)
    } catch (error) {
      console.error('CountryManager:insertData: Failed to insert notification', transformException(error))
      throw new Error()
    }
  }

  public async insertImmigrationData(jsonArray: Strings[]): Promise<void> {
    try {
      for (let index1 = 0; index1 < jsonArray.length; ++index1) {
        const immigrationData = {} as ImmigrationEntryV1
        const passport = jsonArray[index1]['Passport'] as string
        immigrationData.sourceCountry = passport as string

        const sourceCountry = Object.keys(jsonArray[index1]) as string[]

        for (let index2 = 1; index2 < sourceCountry.length; ++index2) {
          const destinationCountry = sourceCountry[index2] as string
          const visaStatus = jsonArray[index1][sourceCountry[index2]] as string
          immigrationData.destinationCountry = destinationCountry as string
          immigrationData.visaStatus = visaStatus as string
          await this.immigrationAdapter.insertOne(immigrationData)
        }
      }
      return
    } catch (error) {
      console.error('FeedDataManager:insertImmigrationData: Failed to insert notification', transformException(error))
      throw new Error()
    }
  }
}

export const feedDataManager: FeedDataManager = new FeedDataManager()
