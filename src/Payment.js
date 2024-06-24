import React, {useState, useEffect} from 'react'
import CheckoutProduct from './CheckoutProduct';
import Header from './Header'
import './Payment.css'
import { useStateValue } from './StateProvider'
import { useTransition, animated } from "react-spring";
import { Link, useNavigate } from 'react-router-dom';
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import CurrencyFormat from 'react-currency-format';
import { getBasketTotal } from './reducer';
import axios from './axios';
import { db } from './firebase';

function Payment() {
  const [{basket, user}, dispatch] = useStateValue();
  const navigate = useNavigate();

  const transition = useTransition(basket, {
    from: { opacity: 0, marginLeft: -100, marginRight: 100 },
    enter: { opacity: 1, marginLeft: 0, marginRight: 0 }
  });

  const stripe = useStripe();
  const elements = useElements(); 
  
  const [succeeded, setSucceeded] = useState(false);
  const [processing, setProcessing] = useState ("");
  const [error, setError] = useState(null);
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState(true);

  useEffect(() => {
  
    const getClientSecret = async () => {
      const response = await axios({
        method: 'post',
        url: `/payments/create?total=${getBasketTotal(basket) * 100}`
      }); 

      setClientSecret(response.data.clientSecret)
    }

    getClientSecret();

  }, [basket]);

  console.log (`THE SECRET IS >>>`, clientSecret);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setProcessing(true)

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement (CardElement)
      }
    }).then(({paymentIntent}) => {

      db
        .collection('users')
        .doc(user?.uid )
        .collection('orders')
        .doc (paymentIntent.id)
        .set ({
          basket: basket,
          amount: paymentIntent.amount,
          created: paymentIntent.created
        })

      setSucceeded(true);
      setError(null);
      setProcessing(false);

      dispatch ({
        type: 'EMPTY_BASKET'
      })

      navigate('/orders')
    })
  }

  const handleChange = event => {
    setDisabled (event.empty);
    setError (event.error ? event.error.message : ''); 
  }

  return (
    <>
    <Header />

    <div className='payment'>
      <div className='payment__container'>

        <h1>
          Checkout (
            <Link to="/checkout">{basket?.length} items</Link>
            )
        </h1>

        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Delivery adress</h3>
          </div>

          <div className='payment__adress'>
            <p>{user?.email}</p>
            <p>777 React Lane</p>
            <p>Los Angeles, CA</p>
          </div>
        </div>

        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Review items and Delivery</h3>
          </div>

          <div className='payment__items'>
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
        
        <div className='payment__section'>
          <div className='payment__title'>
            <h3>Payment method</h3>
          </div>

          <div className='payment__details'>
            <form onSubmit={handleSubmit}>
              <CardElement onChange={handleChange}/>

              <div className='payment__priceContainer'>
              <CurrencyFormat
                renderText={(value) =>(
                  <h3>Order Total: {value}</h3>
                )}
                decimalScale={2}
                value={getBasketTotal (basket)}
                displayType={"text"}
                thousandSeparator={true}
                prefix={"$"}
              />
              </div>

              <button disabled={processing || disabled || succeeded}>
                {processing ? <p>processing</p> : "Buy Now"}
              </button>

              {error && <div>{error}</div>}
            </form>
          </div>
        </div>
        
      </div>
    </div>
    
    </>
  )
}

export default Payment