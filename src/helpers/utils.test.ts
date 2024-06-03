import { padNumber } from './utils'

describe('padNumber', () => {
  it('adds a 0 is n < 10', () => {
    expect(padNumber(1)).toBe('01')
  })

  it('does not add a 0 is n >= 10', () => {
    expect(padNumber(10)).toBe('10')
  })
})
