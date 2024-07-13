import { assertAtLeastOneNotEmptyArgument } from '../base/AssertionConcerns'

export default class ItemImage {
  constructor (
    readonly id: string,
    readonly itemId: string,
    readonly base64: string | undefined,
    readonly storagePath: string | undefined
  ) {
    assertAtLeastOneNotEmptyArgument([base64, storagePath], 'One of the following values must be valid. [\'base64\', \'storagePath\']')
  }
}
