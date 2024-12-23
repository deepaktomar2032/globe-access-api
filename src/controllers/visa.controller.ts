import { JsonController, Get, OnUndefined } from 'routing-controllers'
import { STATUS_CODES } from '@src/constants'
import { API_V1_ROUTE } from '@src/routes'
import { Injectable } from '@src/decorators'
// import { visaManager } from '@src/managers'
// import { csvtojson } from '@src/services'
// import newArray from '@src/data/new.json'
// import finalArray from '@src/data/final.json'
// import fs from 'fs'

@Injectable('VisaControllerV1')
@JsonController(`${API_V1_ROUTE}/visa`)
export class VisaControllerV1 {
  @Get('/')
  @OnUndefined(STATUS_CODES.OK)
  public async calculateResult(): Promise<string> {
    // const jsonData = JSON.stringify(allNew, null, 4)
    // await fs.promises.writeFile('src/data/allNew.json', jsonData, 'utf-8')

    return 'saved'
  }
}
