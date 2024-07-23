/* eslint-env jest, browser */
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { screen, configure } from '@testing-library/react'
import '@testing-library/jest-dom'
import App from '../src/javascripts/modules/app'
import i18n from '../src/javascripts/lib/i18n'
import { CLIENT } from './mocks/mock'
import OrderDetails from '../src/javascripts/modules/order'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'

const mockEN = {
  'app.name': 'Example App',
  'app.title': 'Example App',
  'default.organizations': 'organizations'
}
const mockOrder = [
  {
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
    }
  }
]

describe('Example App', () => {
  beforeAll(() => {
    configure({ testIdAttribute: 'data-test-id' })

    i18n.loadTranslations('en')

    jest.mock('../src/translations/en', () => {
      return mockEN
    })
  })

  describe('render tests', () => {
    let appContainer = null

    beforeEach(() => {
      appContainer = document.createElement('section')
      appContainer.classList.add('main')
      document.body.appendChild(appContainer)
    })

    afterEach(() => {
      unmountComponentAtNode(appContainer)
      appContainer.remove()
      appContainer = null
    })

    const expectedTexts = [
      `ID: ${mockOrder[0].id}`,
      `Status: ${mockOrder[0].status}`,
      `${mockOrder[0].entries[0].product.name}`,
      `Quantity: ${mockOrder[0].entries[0].amount}`,
      `Price: € ${mockOrder[0].entries[0].totalPrice}`,
      'Billing Address',
      '123 Billing St Apt 101',
      '12345 Billing City',
      'Billing Country',
      'Shipping Address',
      '456 Shipping St Suite 202',
      '54321 Shipping City',
      'Shipping Country'
    ]

    it.each(expectedTexts)('renders OrderDetails component with expected text: %s', async (text) => {
      await act(async () => {
        await App(CLIENT, {})

        render(
          <ThemeProvider theme={{ ...DEFAULT_THEME }}>
            <OrderDetails order={mockOrder[0]} />
          </ThemeProvider>,
          appContainer
        )
      })

      const element = screen.getByText(text)
      expect(element).toBeInTheDocument()
      expect(element).toHaveTextContent(text)
    })
  })
})
