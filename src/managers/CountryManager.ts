import { Request, Response, ImmigrationEntryV1, EntryList } from '@src/types'
import { CountryAdapter, ImmigrationAdapter } from '@src/database'
import { Inject } from '@src/decorators'
import { CountryEntryV1 } from '@src/types'
import { transformException } from '@src/utils'

class CountryManager {
  @Inject('CountryAdapter') private readonly countryAdapter: CountryAdapter<CountryEntryV1>
  @Inject('ImmigrationAdapter') private readonly immigrationAdapter: ImmigrationAdapter<ImmigrationEntryV1>

  public async getCountryList(countryRequestData: Request): Promise<Response> {
    try {
      const { isoAlpha2Code } = countryRequestData

      const result = (await this.countryAdapter.findOne({ isoAlpha2Code })) as CountryEntryV1

      const visaStatus = ['visa free', 'e-visa', 'visa on arrival', '90', '30', '21', '-1']
      const { items }: EntryList<ImmigrationEntryV1> = (await this.immigrationAdapter.aggregate(
        [
          { $match: { sourceCountry: isoAlpha2Code, visaStatus: { $in: visaStatus } } },
          { $project: { _id: 0, createdAt: 0, updatedAt: 0 } }
        ],
        { allowDiskUse: true }
      )) as unknown as EntryList<ImmigrationEntryV1>

      const countryList = items.map((item) => item.destinationCountry)

      const items1: EntryList<CountryEntryV1> = (await this.countryAdapter.aggregate([
        { $match: { isoAlpha2Code: { $in: countryList } } },
        { $project: { _id: 0, createdAt: 0, updatedAt: 0 } }
      ])) as unknown as EntryList<CountryEntryV1>

      const finalResponse: Response = { ...result, visaStatus: items1.items }

      return finalResponse
    } catch (error) {
      console.error('CountryManager:getCountryList: Failed to fetch country list', transformException(error))
      throw new Error()
    }
  }

  public async getAllCountryList(): Promise<CountryEntryV1> {
    try {
      const result = (await this.countryAdapter.findEntries({}, undefined, undefined, undefined, {
        withProjection: false
      })) as unknown as CountryEntryV1
      return result
    } catch (error) {
      console.error('CountryManager:getAllCountryList: Failed to fetch country list', transformException(error))
      throw new Error()
    }
  }
}

export const countryManager: CountryManager = new CountryManager()
