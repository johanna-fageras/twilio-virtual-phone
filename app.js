const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');
const path = require('path');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));

// Twilio credentials (set these as environment variables)
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = new twilio(accountSid, authToken);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.render('index');
});

app.post('/send_message', (req, res) => {
    const to = req.body.to;
    const body = req.body.body;
    client.messages.create({
        body: body,
        from: twilioPhoneNumber,
        to: to
    })
    .then(message => res.send(`Message sent to ${to}`))
    .catch(error => res.send(`Failed to send message: ${error.message}`));
});

app.post('/incoming', (req, res) => {
    const twiml = new twilio.twiml.MessagingResponse();
    twiml.message('Message received');
    res.writeHead(200, { 'Content-Type': 'text/xml' });
    res.end(twiml.toString());
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
