import { DomainError } from './DomainError'

export const assertArgumentLength = (value: string, min: number, max: number, message: string = 'Must not be empty!'): void => {
  const length = value.trim().length
  if (length < min || length > max) throw new DomainError(message)
}
