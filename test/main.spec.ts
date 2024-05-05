import { sum } from '../src/main'

describe('Sum two numbers', () => {
  it('Should add two positive numbers', () => {
    const result = sum(1, 2)
    expect(result).toBe(3)
  })
})
