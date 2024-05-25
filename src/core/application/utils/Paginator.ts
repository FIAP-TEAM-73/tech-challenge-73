export default class Paginator<T> {
  constructor (
    readonly content: T[],
    readonly size: number,
    readonly page: number,
    readonly total: number
  ) {}

  isFirstPage (): boolean {
    return this.page === 0
  }

  getTotalPages (): number {
    return Math.ceil(this.total / this.size)
  }
}
