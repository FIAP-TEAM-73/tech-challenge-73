import Paginator from '../../../../src/core/application/utils/Paginator'

describe('Pagination', () => {
  it('Should return firstPage when page is 0', () => {
    const sut = new Paginator([], 10, 0, 100)
    expect(sut.isFirstPage()).toBe(true)
  })
  it('Should return totalPages 10 when size is 3 and content is 30', () => {
    const sut = new Paginator(['John', 'Mary', 'Anna'], 3, 0, 30)
    expect(sut.getTotalPages()).toBe(10)
  })
})
