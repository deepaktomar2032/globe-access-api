import { JsonController, Get, OnUndefined } from 'routing-controllers'
import { STATUS_CODES } from '@src/constants'
import { API_V1_ROUTE } from '@src/routes'
import { Injectable } from '@src/decorators'
import { countryManager } from '@src/managers'
import { CountryEntryV1 } from '@src/types'
// import { csvtojson } from '@src/services'
// import newArray from '@src/data/new.json'
import finalArray from '@src/data/final.json'
// import fs from 'fs'

@Injectable('CronControllerV1')
@JsonController(`${API_V1_ROUTE}/cron`)
export class CronControllerV1 {
  @Get('/update-values')
  @OnUndefined(STATUS_CODES.OK)
  public async updateValues(): Promise<void> {
    // const jsonData = JSON.stringify(allNew, null, 4)
    // await fs.promises.writeFile('src/data/allNew.json', jsonData, 'utf-8')

    const dataInsert = finalArray as unknown as CountryEntryV1[]
    await countryManager.insertData(dataInsert)
  }
}
