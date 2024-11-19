import twilio from 'twilio';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioWhatsAppNumber = process.env.TWILIO_WHATSAPP_NUMBER;
const restaurantWhatsAppNumber = process.env.RESTAURANT_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

async function testWhatsAppSandbox() {
  try {
    const message = await client.messages.create({
      body: 'This is a test WhatsApp message from your Taupo Thai order notification system.',
      from: `whatsapp:${twilioWhatsAppNumber}`,
      to: `whatsapp:${restaurantWhatsAppNumber}`
    });
    console.log('WhatsApp message sent successfully. SID:', message.sid);
  } catch (error) {
    console.error('Error sending WhatsApp message:', error);
  }
}

testWhatsAppSandbox();