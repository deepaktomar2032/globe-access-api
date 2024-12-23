import { JsonController, Get, OnUndefined } from 'routing-controllers'
import { STATUS_CODES } from '@src/constants'
import { API_V1_ROUTE } from '@src/routes'
import { Injectable } from '@src/decorators'
import { countryManager } from '@src/managers'
import { CountryEntryV1 } from '@src/types'

@Injectable('InitialControllerV1')
@JsonController(`${API_V1_ROUTE}/initial-call`)
export class InitialControllerV1 {
  @Get('/')
  @OnUndefined(STATUS_CODES.OK)
  public async calculateResult(): Promise<CountryEntryV1> {
    const response = await countryManager.getAllCountryList()
    return response
  }
}
