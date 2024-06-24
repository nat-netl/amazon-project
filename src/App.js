import React, { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css';
import Checkout from "./Checkout";
import { auth } from "./firebase";
import Home from "./Home";
import Login from "./Login";
import Payment from "./Payment";
import { useStateValue } from "./StateProvider";
import { loadStripe } from "@stripe/stripe-js"
import { Elements } from "@stripe/react-stripe-js"
import Orders from "./Orders";

const promise = loadStripe ('pk_test_51LT2EZHe0hLT0YfLbAi9dWHkSN4serhb5nVtd6H3wzmKRfXTrFe5Jd9SQhljOd5ZuNXNW1ia3FnZxujKpQhhPa2e00zHgwcsau')

function App() {

  const [{}, dispatch] = useStateValue()

  useEffect (() => {
    auth.onAuthStateChanged(authUser => {
      if (authUser) {
        dispatch({
          type: 'SET_USER',
          user: authUser,
        })
      } else {
        dispatch({
          type: 'SET_USER',
          user: null
        })
      }
    });
  }, [])

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route exact path="/login" element={<Login />} />
          <Route exact path="/payment" element={<Elements stripe={promise}><Payment /></Elements>} />
          <Route path="/orders" element={<Orders />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
