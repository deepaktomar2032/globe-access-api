import { JsonController, Get, OnUndefined } from 'routing-controllers'
import { STATUS_CODES } from '@src/constants'
import { API_V1_ROUTE } from '@src/routes'
import { Injectable } from '@src/decorators'
import { feedDataManager } from '@src/managers'
import countryDataArray from '@src/data/country.json'
import immigrationDataArray from '@src/data/passport-index-matrix.json'

@Injectable('CronControllerV1')
@JsonController(`${API_V1_ROUTE}/cron`)
export class CronControllerV1 {
  @Get('/feed-values')
  @OnUndefined(STATUS_CODES.OK)
  public async updateValues(): Promise<void> {
    await feedDataManager.insertCountryData(countryDataArray)
    await feedDataManager.insertImmigrationData(immigrationDataArray)
  }
}
