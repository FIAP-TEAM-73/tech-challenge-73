import Paginator from '../../../../src/core/application/utils/Paginator'

describe('Pagination', () => {
  it('Should return firstPage when page is 0', () => {
    const sut = new Paginator([], 0, 100)
    expect(sut.isFirstPage()).toBe(true)
  })
})
