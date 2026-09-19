import { describe, expect, it } from 'vitest'

import { databasePoolConfig } from './database'

const url = 'postgresql://postgres.ref:p%40ss@aws-0-eu-central-1.pooler.supabase.com:5432/postgres'
const pem = '-----BEGIN CERTIFICATE-----\nMIIB\n-----END CERTIFICATE-----'

describe('databasePoolConfig', () => {
  it('passes the URL through untouched when no CA is set', () => {
    expect(databasePoolConfig({ DATABASE_URL: `${url}?sslmode=require` })).toEqual({
      connectionString: `${url}?sslmode=require`,
    })
  })

  it('verifies against the CA and strips URL ssl params that would override it', () => {
    const config = databasePoolConfig({
      DATABASE_URL: `${url}?sslmode=require&application_name=zyntrivia`,
      DATABASE_CA_CERT: pem,
    })
    expect(config).toEqual({
      connectionString: `${url}?application_name=zyntrivia`,
      ssl: { ca: pem, rejectUnauthorized: true },
    })
  })

  it('accepts a CA with escaped newlines', () => {
    const config = databasePoolConfig({
      DATABASE_URL: url,
      DATABASE_CA_CERT: pem.replace(/\n/g, '\\n'),
    })
    expect(config.ssl).toEqual({ ca: pem, rejectUnauthorized: true })
  })

  it('keeps a percent-encoded password intact', () => {
    const config = databasePoolConfig({ DATABASE_URL: url, DATABASE_CA_CERT: pem })
    expect(config.connectionString).toBe(url)
  })
})
