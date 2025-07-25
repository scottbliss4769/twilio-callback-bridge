const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: false }));

// Route: First leg — call YOU, then connect to customer
app.post('/bridge-call', (req, res) => {
  const { To } = req.body;
  console.log('🚀 STEP 1 - Received To =', To);

  if (!To) {
    return res.status(400).send('Missing "To" parameter');
  }

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial({
    action: `/connect-customer?customer=${encodeURIComponent(To)}`,
    method: 'POST'
  });

  console.log('☎️ Calling MY_PHONE_NUMBER =', process.env.MY_PHONE_NUMBER);
  dial.number(process.env.MY_PHONE_NUMBER);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Route: Second leg — call customer
app.post('/connect-customer', (req, res) => {
  const customer = req.query.customer;
  console.log('📞 STEP 2 - Connecting to customer =', customer);

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial({
    callerId: process.env.MY_PHONE_NUMBER // This is required
  });

  dial.number(customer);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Root route
app.get('/', (req, res) => {
  res.send('Twilio Call Bridge server is running.');
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
