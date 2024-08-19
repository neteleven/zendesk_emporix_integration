import '../../css/order.css'
import i18n from '../lib/i18n'
import React, { useEffect, useState } from 'react'

const currencySymbols = {
  EUR: '€',
  GBP: '£',
  USD: '$',
  CAD: 'C$',
  AUD: 'A$'
}
const OrderDetails = ({ client, order }) => {
  const [date, setDate] = useState(null)
  useEffect(() => {
    client.get('currentUser.locale').then((data) => {
      const locale = data['currentUser.locale']
      try {
        const formattedDate = new Date(order.created).toLocaleDateString(locale)
        setDate(formattedDate)
      } catch (error) {
        console.error('error while converting order date to user locale', error)
      }
      i18n.loadTranslations(locale)
    })
  }, [])
  if (!order) {
    return <div>{i18n.t('default.no_order_data')}</div>
  }
  return (
    <div className='order-details-container'>
      <p className='title'>{i18n.t('default.order_info')}</p>
      <div className='order-info'>
        <p>{i18n.t('default.order_id')}: {order.id}</p>
        {date && (
          <p>{i18n.t('default.order_date')}: {date}</p>
        )}
        <p>{i18n.t('default.order_status')}: {order.status}</p>
        <p>{i18n.t('default.total_price')}: {order.totalPrice} {getCurrencySymbol(order.payments[0].currency)}</p>
      </div>
      <hr className='separator' />
      <div className='address-container'>
        <Address title={i18n.t('default.billing_address')} address={order.billingAddress} />
        <Address title={i18n.t('default.shipping_address')} address={order.shippingAddress} />
      </div>

      <Entries order={order} />
    </div>
  )
}

const Entries = ({ order }) => {
  return (

    order.entries && order.entries.length > 0 && (
      <div className='entries-container'>
        <ul className='entries-list'>
          {order.entries.map((entry) => (
            <li key={entry.id} className='product-card'>
              {entry.product.images && entry.product.images.length > 0 && (
                <div className='image-container'>
                  <img className='product-image' src={entry.product.images[0].url} alt='product-image' />
                </div>
              )}
              <div className='product-details'>
                <p className='product'>{entry.product.name}</p>
                <p className='id'>{i18n.t('default.product_id')}: {entry.id}</p>
                <p className='amount'>{i18n.t('default.product_quantity')}: {entry.amount}</p>
                <p className='unitprice'>{i18n.t('default.product_unit_price')}: {entry.unitPrice} {getCurrencySymbol(order.payments[0].currency)}</p>
                <p className='price'>{i18n.t('default.product_total_price')}: {entry.totalPrice} {getCurrencySymbol(order.payments[0].currency)}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    )
  )
}

const Address = ({ title, address }) => {
  return (
    <div className='address'>
      <p className='title'>{title}</p>
      <p className='street'>{address.street} {address.streetNumber}</p>
      <p className='zipCode'>{address.zipCode} {address.city}</p>
      <p className='country'>{address.country}</p>
    </div>
  )
}
function getCurrencySymbol (code) {
  return currencySymbols[code] || code
}

export default OrderDetails
