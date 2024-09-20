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
    let authError = false
    let token
    let response
    try {
      token = await authenticateEmporix(client)
      response = await getOrdersForCurrentCustomer(client, token)
    } catch (error) {
      authError = true
    }

    const appContainer = document.querySelector('.main')
    const settings = client.metadata().then(metadata => metadata.settings)

    render(
      <ThemeProvider theme={{ ...DEFAULT_THEME }}>
        <div className='bg'>
          {authError
            ? (
              <>
                <div className='error-card'>{i18n.t('default.auth_error')}</div>
              </>
              )
            : (
                response && response.length > 0
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
                    <div className='error-card'>{i18n.t('default.no_orders_available')}</div>
                    )
              )}
        </div>
      </ThemeProvider>,
      appContainer
    )

    return resizeContainer(client, MAX_HEIGHT)
  } catch (error) {
    console.error('Emporix for Zendesk > Error in App component:', error)
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
    console.error('Emporix for Zendesk > Error authenticating Emporix:', error)
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

    response.sort((a, b) => new Date(b.created) - new Date(a.created))

    return response
  } catch (error) {
    console.error('Emporix for Zendesk > Error getting orders:', error)
    throw error
  }
}
export default App
