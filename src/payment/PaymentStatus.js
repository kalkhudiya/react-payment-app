import { useEffect, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { getCurrencySymbol, getPaymentInfo } from '../utill/StripePayment'

const PaymentStatus = () => {
  const [searchParams] = useSearchParams()

  const [isLoading, setIsLoading] = useState(true)
  const [paymentObj, setPaymentObj] = useState(true)

  const _getPaymentInfo = async (paymentIntent) => {
    // Get the details of this payment
    const ppp = await getPaymentInfo(paymentIntent)
    setPaymentObj(ppp)
    setIsLoading(false)
  }
  useEffect(() => {
    if (searchParams.get('payment_intent')) {
      _getPaymentInfo(searchParams.get('payment_intent'))
    } else {
      const error = 'Invalid payment intent param'
      console.error(error)
      setPaymentObj({
        last_payment_error: {
          message: error
        }
      })
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className='px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center'>
        <h2>Please wait!</h2>
        <h3>Loading payment status</h3>
      </div>
    )
  }
  return (
    <div className='px-3 py-3 pt-md-5 pb-md-4 mx-auto text-center'>
      {paymentObj?.status === 'succeeded' ? (
        <>
          <h2 className='text-success'>Your payment was successful</h2>
          {typeof paymentObj?.amount_received === 'number' && (
            <p>
              Amount received{' '}
              <strong>
                {getCurrencySymbol(paymentObj.currency)}
                {paymentObj.amount_received / 100}
              </strong>
            </p>
          )}
          <p>
            Your transaction id is <strong>{paymentObj?.id}</strong>
          </p>
        </>
      ) : (
        <>
          <h2 className='text-danger'>Your payment was unsuccessful</h2>
          {paymentObj?.last_payment_error?.message && (
            <code>{paymentObj.last_payment_error.message}</code>
          )}
        </>
      )}
      <p>
        <Link to={'/'}>Click here to go to Home page</Link>
      </p>
    </div>
  )
}

export default PaymentStatus
