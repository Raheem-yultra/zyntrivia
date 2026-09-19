import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'

export function getPayloadClient(): Promise<Payload> {
  return getPayload({ config: configPromise })
}

/** Narrows a relationship value (id or populated doc) to the populated doc. */
export function isPopulated<T extends { id: number | string }>(
  value: number | string | T | null | undefined,
): value is T {
  return typeof value === 'object' && value !== null
}

export function populated<T extends { id: number | string }>(
  values: Array<number | string | T> | null | undefined,
): T[] {
  return (values ?? []).filter(isPopulated)
}
