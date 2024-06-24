const functions = require("firebase-functions");
const express = require("express");
const cors = require("cors");
const stripe = require("stripe")("sk_test_51LT2EZHe0hLT0YfLI81Nvdc7aQvNb3da1Hv1VqTtA6oPtyGMgqBUonEcZWWSluowSE0edH6CaSkDVRFbS3wUeqOD00kH08YXc8")

// API

// - App config

const app = express();

// - Middlewares

app.use (cors({origin: true}));
app.use (express.json())

// - API routes

app.get ('/', (request, response) => response.status(200).send('Hello World'))

app.post ('/payments/create', async (request, response) => {
  const total = request.query.total;

  console.log ("Payment Request Recived. For this amount >>> ", total);

  const paymentIntent = await stripe.paymentIntents.create ({
    amount: total,
    currency: "usd",
  })

  // OK

  response.status(201).send ({
    clientSecret: paymentIntent.client_secret
  });
})

// - Listen command

exports.api = functions.https.onRequest(app)

// http://localhost:5001/e-clone-44dec/us-central1/api