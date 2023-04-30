import cardValidator from 'card-validator'

export const validateCard = (_cardNumber) => {
  let isValid = true
  let cardType = null
  if (_cardNumber?.length > 4) {
    const validateCard = cardValidator.number(_cardNumber)
    if (validateCard?.isPotentiallyValid) {
      cardType = validateCard.card.type
    } else {
      // Show error
      isValid = false
    }
  }
  return {
    isValid,
    cardType
  }
}

export const validateExpiryDate = (date) => {
  const validateExpDate = cardValidator.expirationDate(date)
  return validateExpDate
}

export const validateCVV = (cvv) => {
  const validateCVV = cardValidator.cvv(cvv)
  return validateCVV
}

export const validateText = (text) => {
  return !text?.trim()?.length
}

export const validateEmail = (email) => {
  return !email?.trim()?.length || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(email)
}
