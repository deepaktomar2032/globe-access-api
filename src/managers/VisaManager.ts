import { VisaAdapter } from '@src/database'
import { Inject } from '@src/decorators'
import { VisaEntryV1 } from '@src/types'
import { transformException } from '@src/utils'

export type Strings = Record<string, string>

export class VisaManager {
  @Inject('VisaAdapter')
  private readonly visaAdapter: VisaAdapter<VisaEntryV1>

  public async insertData(jsonArray: Strings[]): Promise<void> {
    try {
      for (let index1 = 0; index1 < jsonArray.length; ++index1) {
        const visaData = {} as VisaEntryV1
        const passport = jsonArray[index1]['Passport'] as string
        visaData.sourceCountry = passport as string

        const sourceCountry = Object.keys(jsonArray[index1]) as string[]

        for (let index2 = 1; index2 < sourceCountry.length; ++index2) {
          const destinationCountry = sourceCountry[index2] as string
          const visaStatus = jsonArray[index1][sourceCountry[index2]] as string
          visaData.destinationCountry = destinationCountry as string
          visaData.visaStatus = visaStatus as string
          await this.visaAdapter.insertOne(visaData)
        }
      }
      return
    } catch (error) {
      console.error(
        'VisaManager:insertData: Failed to insert notification',
        transformException(error),
      )
      throw new Error()
    }
  }
}

export const visaManager: VisaManager = new VisaManager()
