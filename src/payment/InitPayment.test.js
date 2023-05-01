import { fireEvent, render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import InitPayment from './InitPayment'

describe('Init payment component', () => {
  beforeEach(() => {
    render(
      <MemoryRouter>
        <InitPayment />
      </MemoryRouter>
    )
  })

  it('Should render init payment correctly', () => {
    let element = screen.getByText('Enter user details')
    expect(element).toBeInTheDocument()

    element = screen.getByText('Enter payment details')
    expect(element).toBeInTheDocument()

    element = screen.getByText('Order summary')
    expect(element).toBeInTheDocument()
  })

  it('Should validate email id on text change and display error', () => {
    const inputElement = screen.getByLabelText('Email id')
    fireEvent.change(inputElement, {
      target: {
        value: 'viren'
      }
    })
    expect(inputElement).toHaveClass('is-invalid')
    expect(screen.getByText('Please provide a valid name.')).toBeVisible()
  })

  it('Should validate email id on text change with no error', () => {
    const inputElement = screen.getByLabelText('Email id')
    fireEvent.change(inputElement, {
      target: {
        value: 'viren@gmail.com'
      }
    })
    expect(inputElement).not.toHaveClass('is-invalid')
  })

  it('Should validate credit card number on text change and display error', () => {
    const cardNumInput = screen.getByLabelText('Card number')
    fireEvent.change(cardNumInput, {
      target: {
        value: '808085'
      }
    })
    expect(cardNumInput).toHaveClass('is-invalid')
    expect(screen.getByText('Please provide a valid card number.')).toBeVisible()
  })

  it('Should validate credit card number on text change with no error', () => {
    const cardNumInput = screen.getByLabelText('Card number')
    fireEvent.change(cardNumInput, {
      target: {
        value: '4000000000003246'
      }
    })
    expect(cardNumInput).not.toHaveClass('is-invalid')
  })

  it('Should validate expiry date on text change and display error', () => {
    const expDateInput = screen.getByLabelText('Expiry date')
    fireEvent.change(expDateInput, {
      target: {
        value: 1220
      }
    })
    expect(expDateInput).toHaveClass('is-invalid')
    expect(screen.getByText('Please provide a valid expiry date.')).toBeVisible()
  })

  it('Should validate expiry date on text change with no error', () => {
    const expDateInput = screen.getByLabelText('Expiry date')
    fireEvent.change(expDateInput, {
      target: {
        value: 1224
      }
    })
    expect(expDateInput).not.toHaveClass('is-invalid')
  })

  it('On submit of form error should be displayed for all elements', () => {
    const submitButton = screen.queryByText('Place order')
    expect(submitButton).not.toBeNull()
    fireEvent.click(submitButton)

    // For name field
    let inputElement = screen.getByLabelText('Name')
    expect(inputElement).toHaveClass('is-invalid')

    // For email id
    inputElement = screen.getByLabelText('Email id')
    expect(inputElement).toHaveClass('is-invalid')

    // For card number
    inputElement = screen.getByLabelText('Card number')
    expect(inputElement).toHaveClass('is-invalid')

    // For expiry date
    inputElement = screen.getByLabelText('Expiry date')
    expect(inputElement).toHaveClass('is-invalid')

    // for CVV code
    inputElement = screen.getByLabelText('CVV code')
    expect(inputElement).toHaveClass('is-invalid')

    // For amount field
    inputElement = screen.getByLabelText('Payable amount')
    expect(inputElement).toHaveClass('is-invalid')
  })
})
