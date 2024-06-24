import React from 'react'
import './Checkout.css'
import { useStateValue } from './StateProvider'
import Subtotal from './Subtotal'
import CheckoutProduct from './CheckoutProduct'
import { useTransition, animated } from "react-spring";
import { Routes, Route } from "react-router-dom";
import Header from './Header';

function Checkout() {
  const [{basket, user}, dispatch] = useStateValue();

  console.log (basket )

  const transition = useTransition(basket, {
    from: { opacity: 0, marginLeft: -100, marginRight: 100 },
    enter: { opacity: 1, marginLeft: 0, marginRight: 0 }
  });

  return (
    <>
      <Routes>
        <Route path="/" element={<Header />} />
      </Routes>
      <div className='checkout'>
        <div className='checkout__left'>
          <img className='checkout__ad' src='https://images-na.ssl-images-amazon.com/images/G/02/UK_CCMP/TM/OCC_Amazon1._CB423492668_.jpg' alt=''></img>

          <div>
            <h3>Hello, {user?.email}</h3>
            <h2 className='checkout__title'>
              Your shopping basket
            </h2>
            {transition((props, item) => {
              return (
                <animated.div style={props}>
                  <CheckoutProduct
                    id={item.id}
                    image={item.image}
                    price={item.price}
                    rating={item.rating}
                    title={item.title}
                  />
                </animated.div>
              );
            })}
          </div>
        </div>
        <div className='checkout__right'>
          <Subtotal />
        </div>
      </div>
    </>
  )
}

export default Checkout