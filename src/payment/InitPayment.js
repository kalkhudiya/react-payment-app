import { useEffect, useState } from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BackButton from '../shared/BackButton'
import {
  validateCard,
  validateCVV,
  validateEmail,
  validateExpiryDate,
  validateText
} from '../utill/CardValidator'
import { setCustomerIdOnLocalStorage } from '../utill/Customer'
import {
  chargePayment,
  getCurrencySymbol,
  getCustomerId,
  paymentFailure,
  saveCard
} from '../utill/StripePayment'
import { PaymentInfoKeys, PaymentInfoBox } from './PaymentInfoBox'

function InitPayment() {
  const [amount, setAmount] = useState(0)
  const [cardNumber, setCardNumber] = useState(null)
  const [cardType, setCardType] = useState(null)
  const [cvv, setCvv] = useState(null)
  const [email, setEmail] = useState(null)
  const [errorObj, setErrorObj] = useState({})
  const [expiry, setExpiry] = useState(null)
  const [name, setName] = useState(null)
  const [paymentInfoStep, setPaymentInfoStep] = useState('')

  const onInputChange = (setterMethod) => {
    return (e) => {
      if (typeof setterMethod === 'function') {
        setterMethod(e?.target?.value ?? null)
      }
    }
  }

  useEffect(() => {
    // On the fly error display for name
    if (name !== null) {
      const isInvalid = validateText(name)
      updateErrorObj({
        name: isInvalid
      })
    }
  }, [name])

  useEffect(() => {
    // On the fly error display for email
    if (email !== null) {
      const isInvalid = validateEmail(email)
      updateErrorObj({
        email: isInvalid
      })
    }
  }, [email])

  useEffect(() => {
    // On the fly error for credit card number
    if (cardNumber !== null) {
      // To avoid init hook call
      const validate = validateCard(cardNumber)
      setCardType(validate.cardType)
      updateErrorObj({
        cardNumber: !validate?.isValid
      })
    }
  }, [cardNumber])

  useEffect(() => {
    // On the fly error display for expiry date
    if (expiry !== null) {
      const validate = validateExpiryDate(expiry)
      updateErrorObj({
        expiry: !validate?.isValid
      })
    }
  }, [expiry])

  useEffect(() => {
    // On the fly error display for CVV number
    if (cvv !== null) {
      const validate = validateCVV(cvv)
      updateErrorObj({
        cvv: !validate?.isValid
      })
    }
  }, [cvv])

  const updateErrorObj = (objToUpdate) => {
    setErrorObj({
      ...errorObj,
      ...objToUpdate
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate the form data first
    const nextErrObj = {}
    if (validateText(name)) {
      nextErrObj.name = true
    }
    if (validateEmail(email)) {
      nextErrObj.email = true
    }
    let validationObj = validateCard(cardNumber)
    if (!validationObj?.isValid || !name?.trim()?.length) {
      nextErrObj.cardNumber = true
    }
    validationObj = validateCVV(cvv)
    if (!validationObj?.isValid) {
      nextErrObj.cvv = true
    }
    validationObj = validateExpiryDate(expiry)
    // Making this as last check so that this var can be used further
    if (!validationObj?.isValid) {
      nextErrObj.expiry = true
    }
    if (amount < 1) {
      nextErrObj.amount = true
    }

    setErrorObj({
      ...nextErrObj
    })

    if (Object.keys(nextErrObj)?.length === 0) {
      try {
        // There is no validation error, Time to move ahead
        // Get customer id
        setPaymentInfoStep(PaymentInfoKeys.userInfo)
        const customerId = await getCustomerId(email, name)
        // Set this customer id in local storage for future use
        setCustomerIdOnLocalStorage(customerId)

        // Now save the card
        setPaymentInfoStep(PaymentInfoKeys.savingCard)
        const savedCardId = await saveCard(customerId, {
          number: cardNumber,
          exp_month: validationObj.month,
          exp_year: validationObj.year,
          cvc: cvv
        })

        // Do the payment
        setPaymentInfoStep(PaymentInfoKeys.processingPayment)
        const paymentStatus = await chargePayment(customerId, savedCardId, amount)

        if (paymentStatus === paymentFailure) {
          // Nav to failure page
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  return (
    <div className='container'>
      <h1 className='h3 mb-5 mt-5'>
        <Link to={'/'}>
          <BackButton />
        </Link>
        &nbsp;Payment
      </h1>

      <Form noValidate onSubmit={handleSubmit}>
        <Row>
          <Col xs={9}>
            <div className='accordion' id='accordionPayment'>
              <div className='accordion-item mb-3'>
                <h5 className='px-4 py-3'>Enter user details</h5>
                <div className='accordion-body'>
                  <div className='mb-3'>
                    <Form.Group controlId='name'>
                      <Form.Label> Name </Form.Label>
                      <Form.Control
                        type='text'
                        value={name === null ? '' : name}
                        onChange={onInputChange(setName)}
                        placeholder='Enter your name'
                        isInvalid={!!errorObj.name}
                      />
                      <Form.Control.Feedback type='invalid'>
                        Please provide a valid name.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                  <div className='mb-3'>
                    <Form.Group controlId='emailId'>
                      <Form.Label> Email id </Form.Label>
                      <Form.Control
                        type='text'
                        value={email === null ? '' : email}
                        onChange={onInputChange(setEmail)}
                        placeholder='Enter your email id'
                        isInvalid={!!errorObj.email}
                      />
                      <Form.Control.Feedback type='invalid'>
                        Please provide a valid email id.
                      </Form.Control.Feedback>
                    </Form.Group>
                  </div>
                </div>
                <h5 className='px-4 py-3'>Enter payment details</h5>
                <div className='accordion-body'>
                  <div className='mb-3'>
                    <Form.Group controlId='creditCardNumber'>
                      <Form.Label>Card number</Form.Label>
                      <Row>
                        <Col xs={9}>
                          <Form.Control
                            type='text'
                            value={cardNumber === null ? '' : cardNumber}
                            onChange={onInputChange(setCardNumber)}
                            placeholder='Enter card number'
                            isInvalid={!!errorObj.cardNumber}
                          />
                          <Form.Control.Feedback type='invalid'>
                            Please provide a valid card number.
                          </Form.Control.Feedback>
                        </Col>
                        <Col xs={1} className='py-1'>
                          <span className='text-capitalize'>{cardType}</span>
                        </Col>
                      </Row>
                    </Form.Group>
                  </div>
                  <Row>
                    <Col xs={4}>
                      <div className='mb-3'>
                        <Form.Group controlId='expiryDate'>
                          <Form.Label>Expiry date</Form.Label>
                          <Form.Control
                            type='text'
                            value={expiry === null ? '' : expiry}
                            onChange={onInputChange(setExpiry)}
                            placeholder='MM/YY'
                            isInvalid={!!errorObj.expiry}
                          />
                          <Form.Control.Feedback type='invalid'>
                            Please provide a valid expiry date.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </Col>
                    <Col xs={4}>
                      <div className='mb-3'>
                        <Form.Group controlId='cvvCode'>
                          <Form.Label>CVV code</Form.Label>
                          <Form.Control
                            type='password'
                            maxLength={3}
                            value={cvv === null ? '' : cvv}
                            onChange={onInputChange(setCvv)}
                            placeholder='CVV'
                            isInvalid={!!errorObj.cvv}
                          />
                          <Form.Control.Feedback type='invalid'>
                            Please provide a valid CVV code.
                          </Form.Control.Feedback>
                        </Form.Group>
                      </div>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={4}>
                      <Form.Group controlId='payableAmount'>
                        <Form.Label>Payable amount</Form.Label>
                        <Form.Control
                          type='number'
                          value={amount === null ? 0 : amount}
                          onChange={onInputChange(setAmount)}
                          className='form-control'
                          placeholder='Amount'
                          isInvalid={!!errorObj.amount}
                        />

                        <Form.Control.Feedback type='invalid'>
                          Payable amount should be greater than 0.
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                </div>
              </div>
            </div>
          </Col>
          <Col xs={3}>
            <div className='card position-sticky top-0'>
              <div className='p-3 bg-light bg-opacity-10'>
                <h6 className='card-title mb-3'>Order summary</h6>
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Name</span> <strong className='text-dark'>{name}</strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Email</span> <strong className='text-dark'>{email}</strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Card</span> <strong className='text-dark'>{cardNumber}</strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Amount Payable</span>{' '}
                  <strong className='text-dark'>
                    {getCurrencySymbol()}
                    {amount}
                  </strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Service charge</span>{' '}
                  <strong className='text-dark'>
                    {getCurrencySymbol()}
                    {0}
                  </strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>Tax</span>{' '}
                  <strong className='text-dark'>
                    {getCurrencySymbol()}
                    {0}
                  </strong>
                </div>
                <hr />
                <div className='d-flex justify-content-between mb-4 small'>
                  <span>TOTAL</span>{' '}
                  <strong className='text-dark'>
                    {getCurrencySymbol()}
                    {amount}
                  </strong>
                </div>
                <Form.Group className='mb-3'>
                  <Form.Check
                    type='checkbox'
                    label={
                      <>
                        <b>I agree to the</b>&nbsp; <a href='#'>terms and conditions</a>
                      </>
                    }
                  />
                </Form.Group>
                <button className='btn btn-primary w-100 mt-2'>Place order</button>
              </div>
            </div>
          </Col>
        </Row>
      </Form>
      <PaymentInfoBox step={paymentInfoStep} />
    </div>
  )
}

export default InitPayment
