/* eslint-env jest, browser */
import React from 'react'
import { render, unmountComponentAtNode } from 'react-dom'
import { act } from 'react-dom/test-utils'
import { screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { CLIENT } from './mocks/mock'
import OrderDetails from '../src/javascripts/modules/order'
import { ThemeProvider, DEFAULT_THEME } from '@zendeskgarden/react-theming'

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
    },
    payments: [
      {
        status: 'PENDING',
        method: 'cash-on-delivery',
        paidAmount: 0,
        currency: 'EUR'
      }
    ]
  }
]
jest.mock('../src/translations/en', () => ({
  'app.name': 'Example App',
  'app.title': 'Example App',
  'default.organizations': 'organizations',
  'default.latest_orders': 'Latest orders from',
  'default.order_info': 'Order Information',
  'default.order_id': 'Order Number',
  'default.order_date': 'Order Date',
  'default.order_status': 'Order Status',
  'default.total_price': 'Total Price',
  'default.billing_address': 'Billing Address',
  'default.shipping_address': 'Shipping Address',
  'default.product_id': 'Product ID',
  'default.product_quantity': 'Quantity',
  'default.product_unit_price': 'Unit Price',
  'default.product_total_price': 'Total Price',
  'default.no_orders_available': 'There are no orders available for this customer.',
  'default.no_order_data': 'No order data available.'
}))
describe('Example App', () => {
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
      `Order Number: ${mockOrder[0].id}`,
      `Order Status: ${mockOrder[0].status}`,
      `${mockOrder[0].entries[0].product.name}`,
      `Quantity: ${mockOrder[0].entries[0].amount}`,
      `Total Price: ${mockOrder[0].entries[0].totalPrice} €`,
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
        render(
          <ThemeProvider theme={{ ...DEFAULT_THEME }}>
            <OrderDetails client={CLIENT} order={mockOrder[0]} />
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
