import React from 'react'
import CurrencyFormat from 'react-currency-format'
import { useNavigate } from 'react-router-dom';
import { getBasketTotal } from './reducer';
import { useStateValue } from './StateProvider';
import './Subtotal.css'

function Subtotal() {
  const [{basket}, dispatch] = useStateValue();
  const navigate = useNavigate();

  return (
    <div className="subtotal">

      <CurrencyFormat
        renderText={(value) =>(
          <>
            <p>
              Subtotal({basket.length} items):
              <strong>{value}</strong>
            </p>
            <small className="subtotal-gift">
              <input type="checkbox" /> this order contains a gift
            </small>
          </>
        )}
        decimalScale={2}
        value={getBasketTotal (basket)}
        displayType={"text"}
        thousandSeparator={true}
        prefix={"$"}
      />
      <button onClick={e => navigate('/payment')}>Proceed to checkout</button>
    </div>
  )
}

export default Subtotal