import React from 'react'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import OrderDetails from './order'
import '../../css/app.css'
import { render } from 'react-dom'
import { resizeContainer } from '../lib/helpers'

const MAX_HEIGHT = 1000
const EMPORIX_BASE_URL = 'https://api.emporix.io/'
export const App = async (client, _appData) => {
  const token = await authenticateOcctoo(client)
  const response = await getOrdersForCurrentCustomer(client, token)
  response.sort((a, b) => new Date(b.created) - new Date(a.created))

  const appContainer = document.querySelector('.main')

  render(
    <ThemeProvider theme={{ ...DEFAULT_THEME }}>
      <div className='bg'>

        {response && response.length > 0
          ? (
            <>
              <h2 className='header'>Last Orders from <span style={{ textDecoration: 'underline' }}>{response[0].customer.firstName} {response[0].customer.lastName}</span></h2>
              {response.slice(0, 3).map((order) => (
                <OrderDetails key={order.id} order={order} />
              ))}
            </>
            )
          : (
            <p>No orders available for this customer.</p>
            )}
      </div>
    </ThemeProvider>,
    appContainer
  )
  return resizeContainer(client, MAX_HEIGHT)
}

async function authenticateOcctoo (client) {
  try {
    const response = await client.request({
      url: `${EMPORIX_BASE_URL}oauth/token`,
      type: 'POST',
      contentType: 'application/x-www-form-urlencoded',
      data: 'grant_type=client_credentials&client_id={{setting.clientId}}&client_secret={{setting.clientSecret}}&scope=order.order_read',
      secure: true
    })

    return response.access_token
  } catch (error) {
    console.log(error)
    throw error
  }
}

async function getOrdersForCurrentCustomer (client, token) {
  const emailObject = await client.get('ticket.requester.email')
  const email = emailObject['ticket.requester.email']

  try {
    const response = await client.request({
      url: `${EMPORIX_BASE_URL}order-v2/{{setting.tenant}}/salesorders?q=customer.email:${email}`,
      type: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'X-Version': 'v2'
      },
      secure: true
    })

    if (!response) {
      return null
    }

    response.sort((a, b) => new Date(b) - new Date(a))

    return response
  } catch (error) {
    console.log(error)
    throw error
  }
}
export default App
