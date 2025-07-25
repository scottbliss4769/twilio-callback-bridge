const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse incoming form data
app.use(bodyParser.urlencoded({ extended: false }));

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioClient = twilio(accountSid, authToken);

// Endpoint that starts the call
app.post('/bridge-call', async (req, res) => {
  const { To } = req.body;

  if (!To) {
    return res.status(400).send('Missing "To" parameter');
  }

  try {
    await twilioClient.calls.create({
      url: `${process.env.BASE_URL}/twiml?customer=${encodeURIComponent(To)}`,
      to: process.env.MY_PHONE_NUMBER,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    res.send('Call initiated!');
  } catch (err) {
    console.error('Failed to initiate call:', err.message);
    res.status(500).send('Failed to initiate call');
  }
});

// Twilio calls this to get the instructions for bridging
app.post('/twiml', (req, res) => {
  const customer = req.query.customer;

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  dial.number({
    action: `/connect-customer?customer=${encodeURIComponent(customer)}`,
    method: 'POST'
  }, process.env.MY_PHONE_NUMBER);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Once you answer, Twilio calls this to dial the customer
app.post('/connect-customer', (req, res) => {
  const customer = req.query.customer;

  const twiml = new twilio.twiml.VoiceResponse();
  twiml.dial().number(customer);

  res.type('text/xml');
  res.send(twiml.toString());
});

// Health check
app.get('/', (req, res) => {
  res.send('Twilio Call Bridge server is running.');
});

// Start server
app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
