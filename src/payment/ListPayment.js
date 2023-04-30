import { useEffect, useState } from 'react'
import { Badge, Col, Row, Spinner } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BackButton from '../shared/BackButton'
import DateString from '../shared/DateString'
import { getCustomerIdFromLocalStorage } from '../utill/Customer'
import { getCurrencySymbol, listPaymentIntents } from '../utill/StripePayment'

const ListPayment = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [paymentList, setPaymentList] = useState([])

  const loadPaymentList = async (customerId) => {
    const listPayment = await listPaymentIntents(customerId)
    console.log(listPayment)
    if (listPayment?.data?.length) {
      setPaymentList(listPayment.data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    const customerId = getCustomerIdFromLocalStorage()
    if (customerId) {
      loadPaymentList()
    } else {
      setIsLoading(false)
    }
  }, [])

  if (isLoading) {
    return (
      <div className='text-center mt-5'>
        <Spinner animation='border' role='status'>
          <span className='visually-hidden'>Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <div className='px-3 py-3 pt-md-5 pb-md-4 mx-auto container'>
      <h1 className='h3 mb-5'>
        <Link to={'/'}>
          <BackButton />
        </Link>
        &nbsp;Payment List
      </h1>
      {paymentList.length ? (
        paymentList.map((payment) => {
          return (
            <Row key={payment.id} className='bg-gray mb-5 px-3 py-3'>
              <Col>
                <DateString timestamp={payment.created} />
              </Col>
              <Col>
                <h5 className='px-3 py-3'>{payment.description}</h5>
              </Col>
              <Col>
                {typeof payment?.amount_received === 'number' && (
                  <h3 className='px-3 py-3'>
                    {getCurrencySymbol(payment.currency)}
                    {payment.amount_received / 100}
                  </h3>
                )}
              </Col>
              <Col className='py-4'>
                {payment.status === 'succeeded' ? (
                  <Badge bg='primary'>Success</Badge>
                ) : (
                  <Badge bg='danger'>Failed</Badge>
                )}
              </Col>
              <Col>
                <span className='d-block px-3 py-3'>
                  <Link to={`/payment-status?payment_intent=${payment.id}`} search={'?oi=oo'}>
                    Payment details
                  </Link>
                </span>
              </Col>
            </Row>
          )
        })
      ) : (
        <div className='text-center'>
          <img
            src='https://static.vecteezy.com/system/resources/thumbnails/007/872/974/small/file-not-found-illustration-with-confused-people-holding-big-magnifier-search-no-result-data-not-found-concept-can-be-used-for-website-landing-page-animation-etc-vector.jpg'
            alt='no-data-found'
          />
          <p>
            No payment is available&nbsp;
            <Link to={'/payment'}>Click here</Link>
            &nbsp;to create a new payment
          </p>
        </div>
      )}
    </div>
  )
}

export default ListPayment
