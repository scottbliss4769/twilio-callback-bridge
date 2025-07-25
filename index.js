const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: false }));

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Endpoint triggered by the HTML form
app.post('/bridge-call', async (req, res) => {
  const customerNumber = req.body.To;
  const myNumber = process.env.MY_PHONE_NUMBER;

  console.log('📨 Form submitted with number:', customerNumber);

  if (!customerNumber) {
    return res.status(400).send('Missing "To" parameter');
  }

  try {
    const call = await client.calls.create({
      url: `${process.env.PUBLIC_URL}/twiml?customer=${encodeURIComponent(customerNumber)}`,
      to: myNumber,
      from: process.env.TWILIO_PHONE_NUMBER
    });

    console.log('✅ Call initiated:', call.sid);
    res.send('Call initiated!');
  } catch (error) {
    console.error('❌ Failed to initiate call:', error.message);
    res.status(500).send(`Failed to initiate call: ${error.message}`);
  }
});

// Twilio hits this after you pick up
app.post('/twiml', (req, res) => {
  const customer = req.query.customer;
  console.log('📞 Connecting to customer:', customer);

  const twiml = new twilio.twiml.VoiceResponse();
  const dial = twiml.dial();
  dial.number(customer);

  res.type('text/xml');
  res.send(twiml.toString());
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
