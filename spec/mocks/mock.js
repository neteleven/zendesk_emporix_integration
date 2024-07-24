export const CLIENT = {
  _origin: 'zendesk.com',
  get: (prop) => {
    if (prop === 'currentUser.locale') {
      return Promise.resolve({
        'currentUser.locale': 'en-US'
      })
    }
    if (prop === 'ticket.requester.email') {
      return Promise.resolve({
        'ticket.requester.email': 'customer@example.com'
      })
    }
    return Promise.resolve({
    })
  },
  request: (options) => {
    if (options.url === 'https://api.emporix.io/oauth/token') {
      return Promise.resolve({ access_token: 'mockedToken' })
    }
    if (options.url.includes('https://api.emporix.io/order-v2/')) {
      return Promise.resolve(mockOrder) // Ensure this is an array of orders
    }
    return Promise.resolve(null)
  },
  invoke: (command) => {
    if (command === 'ticket.requester.email') {
      return Promise.resolve({
        'ticket.requester.email': 'customer@example.com'
      })
    }
    return Promise.resolve(null)
  },
  metadata: () => {
    return Promise.resolve({
      settings: {
        orderDisplayLimit: 3
      }
    })
  }
}

const mockOrder = [{
  id: '123456789',
  status: 'Delivered',
  entries: [
    {
      id: 'entry1',
      product: {
        name: 'Product 1',
        images: [{ url: 'https://via.placeholder.com/150' }]
      },
      amount: 2,
      totalPrice: 50,
      price: { currency: 'USD' }
    },
    {
      id: 'entry2',
      product: {
        name: 'Product 2',
        images: [{ url: 'https://via.placeholder.com/150' }]
      },
      amount: 1,
      totalPrice: 30,
      price: { currency: 'USD' }
    }
  ],
  billingAddress: {
    street: '123 Billing St',
    streetNumber: 'Apt 101',
    zipCode: '12345',
    city: 'Billing City',
    country: 'Billing Country'
  },
  shippingAddress: {
    street: '456 Shipping St',
    streetNumber: 'Suite 202',
    zipCode: '54321',
    city: 'Shipping City',
    country: 'Shipping Country'
  },
  customer: {
    title: 'Mr.',
    name: 'John Doe'
  },
  created: '2024-01-01T00:00:00Z' // Ensure there's a created date for sorting
}]
