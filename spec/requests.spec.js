import { CLIENT } from './mocks/mock'

const { authenticateEmporix, getOrdersForCurrentCustomer } = require('../src/javascripts/modules/app')
const token = 'access_token'
const EMPORIX_BASE_URL = 'https://api.emporix.io/'
describe('authenticateEmporix', () => {
  beforeAll(() => {
    CLIENT.request = jest.fn()
  })

  it('should return an access token on successful authentication', async () => {
    CLIENT.request.mockResolvedValue({ access_token: token })

    const result = await authenticateEmporix(CLIENT)

    expect(CLIENT.request).toHaveBeenCalledWith({
      url: `${EMPORIX_BASE_URL}oauth/token`,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: 'grant_type=client_credentials&client_id={{setting.clientId}}&client_secret={{setting.clientSecret}}&scope=order.order_read',
      secure: true
    })
    expect(result).toEqual(token)
  })

  it('should throw an error on authentication failure', async () => {
    const error = new Error('Authentication failed')
    CLIENT.request.mockRejectedValue(error)

    await expect(authenticateEmporix(CLIENT)).rejects.toThrow(error)
  })
})

// getOrdersForCurrentCustomer.test.js
describe('getOrdersForCurrentCustomer', () => {
  beforeAll(() => {
    CLIENT.get = jest.fn()
    CLIENT.request = jest.fn()
  })
  it('should return sorted orders for the current customer', async () => {
    const email = 'customer@example.com'
    const orders = [
      { date: '2023-07-02' },
      { date: '2023-07-01' },
      { date: '2023-06-30' }
    ]
    CLIENT.get.mockResolvedValue({ 'ticket.requester.email': email })
    CLIENT.request.mockResolvedValue(orders)

    const result = await getOrdersForCurrentCustomer(CLIENT, token)

    expect(CLIENT.get).toHaveBeenCalledWith('ticket.requester.email')
    expect(CLIENT.request).toHaveBeenCalledWith({
      url: `${EMPORIX_BASE_URL}order-v2/{{setting.tenant}}/salesorders?q=customer.email:${email}`,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Version': 'v2'
      },
      secure: true
    })
    expect(result).toEqual([
      { date: '2023-07-02' },
      { date: '2023-07-01' },
      { date: '2023-06-30' }
    ]);
  });

  it('should return null if no orders are found', async () => {
    const email = 'customer@example.com'
    CLIENT.get.mockResolvedValue({ 'ticket.requester.email': email })
    CLIENT.request.mockResolvedValue(null)
    const result = await getOrdersForCurrentCustomer(CLIENT, token)


    expect(result).toBeNull()
  })

  it('should throw an error on failure', async () => {
    const email = 'customer@example.com'
    const error = new Error('Request failed')
    CLIENT.get.mockResolvedValue({ 'ticket.requester.email': email })
    CLIENT.request.mockRejectedValue(error)

    await expect(getOrdersForCurrentCustomer(CLIENT, token)).rejects.toThrow(error)
  })
})
