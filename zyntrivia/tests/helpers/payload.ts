import { getPayload, type Payload } from 'payload'

import config from '../../src/payload.config.js'

let instance: Promise<Payload> | null = null

/** Local API against the same database as the dev server under test. */
export function testPayload(): Promise<Payload> {
  instance ??= getPayload({ config })
  return instance
}
