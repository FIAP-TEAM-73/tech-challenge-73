export default class Paginator<T> {
  constructor (
    readonly content: T[],
    readonly page: number,
    readonly total: number
  ) {}

  isFirstPage (): boolean {
    return this.page === 0
  }
}
