export const setCustomerIdOnLocalStorage = (customerId) => {
  localStorage.setItem('customerId', customerId)
  return true
}

export const getCustomerIdFromLocalStorage = (customerId) => {
  return localStorage.getItem('customerId')
}
