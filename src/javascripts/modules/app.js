import React from 'react'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'
import OrderDetails from './order'
import '../../css/app.css'
import { render } from 'react-dom'
import { resizeContainer } from '../lib/helpers'
import i18n from '../lib/i18n'

const MAX_HEIGHT = 1000
const EMPORIX_BASE_URL = 'https://api.emporix.io/'

export const App = async (client, _appData) => {
  try {
    const localeData = await client.get('currentUser.locale')
    const locale = localeData?.['currentUser.locale']
    i18n.loadTranslations(locale || 'en-US')

    const token = await authenticateEmporix(client)
    const response = await getOrdersForCurrentCustomer(client, token)
    // 2 sorting functions in line 21 and 90. I think, one can be removed.
    response.sort((a, b) => new Date(b.created) - new Date(a.created))

    const appContainer = document.querySelector('.main')
    // Not sure, if it is best to combine `await` with `then()`? I think `await` is not necessary when using `then()`.
    const settings = await client.metadata().then(metadata => metadata.settings)

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <div className='bg'>
          {response && response.length > 0
            ? (
              <>
                <h2 className='header'>
                  {i18n.t('default.latest_orders')} <span style={{ textDecoration: 'underline' }}>{response[0].customer.firstName} {response[0].customer.lastName}</span>
                </h2>
                {response.slice(0, settings.orderDisplayLimit).map(order => (
                  <OrderDetails client={client} key={order.id} order={order} />
                ))}
              </>
              )
            : (
              <p>{i18n.t('default.no_orders_available')}</p>
              )}
        </div>
      </ThemeProvider>,
      appContainer
    )

    return resizeContainer(client, MAX_HEIGHT)
  } catch (error) {
    console.error('Error in App component:', error)
  }
}

export async function authenticateEmporix (client) {
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
    console.error('Error authenticating Emporix:', error)
    throw error
  }
}

export async function getOrdersForCurrentCustomer (client, token) {
  try {
    const emailObject = await client.get('ticket.requester.email')
    const email = emailObject['ticket.requester.email']

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
      return []
    }

    response.sort((a, b) => new Date(b) - new Date(a))

    return response
  } catch (error) {
    console.error('Error getting orders:', error)
    throw error
  }
}
export default App
