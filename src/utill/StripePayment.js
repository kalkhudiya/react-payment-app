import Stripe from 'stripe'

const stripe = new Stripe(
  'sk_test_51N2AXoSCavYZPAvEeex3jAIQF3JPBdDHSY9X599N3jthatRGfNw9fiE5osNT0oxCGcoFJwPtrjKNWCTtukxutLea00BOslFaTx'
)

const currency = 'inr'

export const paymentFailure = 'failed_pay'

export const getCustomerId = async (email, name) => {
  // Check if email exists in out storage
  const userId = `customer:${email}`
  if (localStorage.getItem(userId)) {
    // TODO: need to validate this, For now assuming this as a valid stripe id
    return localStorage.getItem(userId)
  }
  // Otherwise crete a new user
  const customer = await stripe.customers.create({
    name,
    email
  })
  localStorage.setItem(userId, customer.id)
  return customer.id
}

export const saveCard = async (customerId, card) => {
  const paymentMethod = await stripe.paymentMethods.create({
    type: 'card',
    card
  })
  // Attach payment method to customer id
  await stripe.paymentMethods.attach(paymentMethod.id, {
    customer: customerId
  })
  return paymentMethod.id
}

export const chargePayment = async (customerId, paymentMethodId, amount) => {
  const paymentIntent = await stripe.paymentIntents.create({
    confirm: true,
    amount: amount * 100,
    currency,
    customer: customerId,
    payment_method: paymentMethodId,
    automatic_payment_methods: {
      enabled: true
    },
    description: 'Custom payment', // TODO: This can be configured based on payment type
    return_url: 'http://localhost:3000/payment-status'
  })

  if (
    paymentIntent.status === 'requires_action' &&
    paymentIntent.next_action?.redirect_to_url?.url
  ) {
    window.location.assign(paymentIntent.next_action.redirect_to_url.url)
    return paymentIntent.status
  } else {
    return paymentFailure
  }
}

export const getPaymentInfo = async (paymentIntentId) => {
  const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId)
  return paymentIntent
}

export const listPaymentIntents = async (customerId) => {
  const paymentIntents = await stripe.paymentIntents.list({
    customer: customerId,
    limit: 15
  })
  return paymentIntents
}

export const getCurrencySymbol = (currency) => {
  const map = {
    usd: '$'
  }
  return map[currency] ?? '₹'
}
