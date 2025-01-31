/* eslint-disable no-console */
import { getAccessToken } from './utils/getAccessToken'
import { getCodes } from './utils/getCodes'

async function main() {

  const accessToken = await getAccessToken({
    clientId: '54482dbd-f57c-4405-83f5-f746a1e426b8',
    clientSecret: 'a898397d-fc99-4de7-b189-492e7b2a86fe',
  })

  const codes = await getCodes({ accessToken, query: process.argv[2] })
  console.table(codes)
}

void main()
