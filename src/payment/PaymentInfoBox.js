import { useEffect, useState } from 'react'
import { Col, Row, Spinner } from 'react-bootstrap'
import PropTypes from 'prop-types'
import './PaymentInfoBox.css'

export const PaymentInfoKeys = {
  userInfo: 'userInfo',
  savingCard: 'savingCard',
  processingPayment: 'processingPayment'
}

const paymentInfoTitle = {
  [PaymentInfoKeys.userInfo]: 'Getting user info',
  [PaymentInfoKeys.savingCard]: 'Saving the card details',
  [PaymentInfoKeys.processingPayment]: 'Processing the payment amount'
}

export const PaymentInfoBox = ({ step }) => {
  const [paymentProcessInfo, setPaymentProcessInfo] = useState([])

  useEffect(() => {
    if (paymentInfoTitle[step]) {
      if (paymentProcessInfo.length && paymentProcessInfo[paymentProcessInfo.length - 1]?.loading) {
        // Set last step as done
        paymentProcessInfo[paymentProcessInfo.length - 1].loading = false
      }
      // Insert new step
      setPaymentProcessInfo([
        ...paymentProcessInfo,
        {
          loading: true,
          title: paymentInfoTitle[step]
        }
      ])
    }
  }, [step])

  return (
    <>
      {Boolean(paymentProcessInfo?.length) === true && (
        <>
          <div className='payment-info-loader overlay'></div>
          <div className='payment-info-loader'>
            <div className='d-flex align-items-center justify-content-center h-100'>
              <div className='d-flex flex-column mt-5'>
                <div className='payment-info-box'>
                  {paymentProcessInfo.map((paymentProcess) => {
                    return (
                      <Row key={paymentProcess.title}>
                        <Col xs={1}>
                          {paymentProcess.loading === true ? (
                            <Spinner animation='border' role='status' size='sm'>
                              <span className='visually-hidden'>Loading...</span>
                            </Spinner>
                          ) : (
                            <span>✅</span> // TODO This check mark should be replaced with font or SVG icons
                          )}
                        </Col>
                        <Col xs={11}>
                          <h5>{paymentProcess.title}</h5>
                        </Col>
                      </Row>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

PaymentInfoBox.propTypes = {
  step: PropTypes.string
}
