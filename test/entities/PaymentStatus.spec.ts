import PaymentStatus from '../../src/entities/PaymentStatus'
describe('PaymentStatus', () => {
  it('Should create a PaymentStatus when every attribute is valid', () => {
    expect(() => new PaymentStatus('any_id', 'AWAITING_PAYMENT')).not.toThrow(new Error(''))
  })
})
