import { JsonController, Get, OnUndefined, QueryParam } from 'routing-controllers'
import { STATUS_CODES } from '@src/constants'
import { API_V1_ROUTE } from '@src/routes'
import { Injectable } from '@src/decorators'
import { countryManager } from '@src/managers'
import { Response } from '@src/types'

@Injectable('CountryControllerV1')
@JsonController(`${API_V1_ROUTE}/country`)
export class CountryControllerV1 {
  @Get('/')
  @OnUndefined(STATUS_CODES.OK)
  public async calculateResult(
    @QueryParam('countryName', { required: true }) countryName: string,
    @QueryParam('isoAlpha2Code', { required: true }) isoAlpha2Code: string,
  ): Promise<Response> {
    const countryResponse = await countryManager.getCountryList({ countryName, isoAlpha2Code })
    return countryResponse
  }
}
