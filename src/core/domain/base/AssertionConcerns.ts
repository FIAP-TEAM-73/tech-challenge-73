import { DomainError } from './DomainError'

export const assertArgumentLength = (value: string, min: number, max: number, message: string = 'Must not be empty!'): void => {
  const length = value.trim().length
  if (length < min || length > max) throw new DomainError(message)
}

export const assertArgumentMin = (value: number, min: number, message?: string): void => {
  if (value < min) throw new DomainError(message ?? `Should be greater than ${min}`)
}

export const assertArgumentMinArrayLength = (value: unknown[], min: number, message?: string): void => {
  if (value.length < min) throw new DomainError(message ?? `Array must have at least ${min} item(s)`)
}
