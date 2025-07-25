const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming Twilio POST data
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/bridge-call', (req, res) => {
  const { To } = req.body; // The customer's phone number (the person you want to call)

  if (!To) {
    return res.status(400).send('Missing "To" parameter');
  }

  const twiml = new twilio.twiml.VoiceResponse();

  // First, call your phone number
  const dial = twiml.dial();
  dial.number(
    {
      action: `/connect-customer?customer=${encodeURIComponent(To)}`,
      method: 'POST'
    },
    process.env.MY_PHONE_NUMBER // Your own phone number
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/connect-customer', (req, res) => {
  const customer = req.query.customer;

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  dial.number(customer); // Dial the customer after you've answered

  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/', (req, res) => {
  res.send('Twilio Call Bridge server is running.');
});


const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming Twilio POST data
app.use(bodyParser.urlencoded({ extended: false }));

app.post('/bridge-call', (req, res) => {
  const { To } = req.body; // The customer's phone number (the person you want to call)

  if (!To) {
    return res.status(400).send('Missing "To" parameter');
  }

  const twiml = new twilio.twiml.VoiceResponse();

  // First, call your phone number
  const dial = twiml.dial();
  dial.number(
    {
      action: `/connect-customer?customer=${encodeURIComponent(To)}`,
      method: 'POST'
    },
    process.env.MY_PHONE_NUMBER // Your own phone number
  );

  res.type('text/xml');
  res.send(twiml.toString());
});

app.post('/connect-customer', (req, res) => {
  const customer = req.query.customer;

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  dial.number(customer); // Dial the customer after you've answered

  res.type('text/xml');
  res.send(twiml.toString());
});

app.get('/', (req, res) => {
  res.send('Twilio Call Bridge server is running.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
