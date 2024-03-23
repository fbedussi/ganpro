import { power2 } from './helpers'

describe('power2', () => {
  it('returns 4 for 2', () => {
    expect(power2(2)).toEqual(4)
  })

  it('returns 16 for 4', () => {
    expect(power2(4)).toEqual(16)
  })
})
