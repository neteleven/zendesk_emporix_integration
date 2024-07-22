import React from 'react'
import '../../css/order.css'

const OrderDetails = ({ order }) => {
  if (!order) {
    return <div>No order data available</div>
  }
  const date = new Date(order.created).toLocaleDateString('de-DE')
  return (
    <div className='order-details-container'>
      <p className='title'>Order Info</p>
      <div className='order-info'>
        <p>ID: {order.id}</p>
        <p>Date: {date}</p>
        <p>Status: {order.status}</p>
        <p>Total Price: € {order.totalPrice}</p>
      </div>
      <hr className='separator' />
      <div className='address-container'>
        <Address title='Billing Address' address={order.billingAddress} />
        <Address title='Shipping Address' address={order.shippingAddress} />
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
                <p className='product'>{entry.productName}</p>
                <p className='product'>ID: {entry.id}</p>
                <p className='productsku'>Sku: {entry.sku}</p>
                <p className='amount'>Quantity: {entry.amount}</p>
                <p className='unitprice'>Unitprice: € {entry.unitPrice}</p>
                <p className='price'>Price: € {entry.totalPrice}</p>
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

export default OrderDetails
