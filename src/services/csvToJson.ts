import fs from 'fs'
import csv from 'csvtojson'
import { jsonFilePath } from '@src/constants'

export async function csvtojson(csvFilePath: string): Promise<unknown> {
  try {
    console.log('Reading and converting CSV file...')
    const jsonArray = await csv().fromFile(csvFilePath)
    fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2))
    console.log('CSV successfully converted to JSON and saved!')
    return jsonArray
  } catch (error) {
    console.log(error)
  }
}
