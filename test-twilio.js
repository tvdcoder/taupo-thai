import twilio from 'twilio';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config({ path: '.env.local' });

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER;
const restaurantWhatsAppNumber = process.env.RESTAURANT_WHATSAPP_NUMBER;

const client = twilio(accountSid, authToken);

async function testTwilioNotifications() {
  try {
    // Test SMS
    const smsResult = await client.messages.create({
      body: 'This is a test SMS from your Taupo Thai order notification system.',
      from: twilioPhoneNumber,
      to: '+919704162878' // Replace with your test phone number
    });
    console.log('Test SMS sent successfully. SID:', smsResult.sid);

    // Test WhatsApp
    const whatsappResult = await client.messages.create({
      body: 'This is a test WhatsApp message from your Taupo Thai order notification system.',
      from: `whatsapp:${twilioPhoneNumber}`,
      to: `whatsapp:${restaurantWhatsAppNumber}`
    });
    console.log('Test WhatsApp message sent successfully. SID:', whatsappResult.sid);

  } catch (error) {
    console.error('Error sending test messages:', error);
  }
}

testTwilioNotifications();