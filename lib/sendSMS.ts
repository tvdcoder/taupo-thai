import twilio from 'twilio'

const accountSid = process.env.TWILIO_ACCOUNT_SID
const authToken = process.env.TWILIO_AUTH_TOKEN
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER

const client = twilio(accountSid, authToken)

function formatPhoneNumberForTwilio(phone: string): string {
  // Remove any non-digit characters
  const digits = phone.replace(/\D/g, '')
  
  // Ensure the number starts with the country code
  if (digits.startsWith('64')) {
    return `+${digits}`
  } else if (digits.startsWith('0')) {
    return `+64${digits.slice(1)}`
  } else {
    return `+64${digits}`
  }
}

export async function sendSMS(to: string, message: string): Promise<void> {
  const formattedPhone = formatPhoneNumberForTwilio(to)
  
  if (!formattedPhone || !message || !twilioPhoneNumber) {
    throw new Error('Missing required parameters for SMS sending')
  }

  try {
    const result = await client.messages.create({
      body: message,
      from: twilioPhoneNumber,
      to: formattedPhone
    })

    console.log('SMS sent successfully:', result.sid)
  } catch (error: any) {
    console.error('Error sending SMS:', error)
    throw new Error(`Failed to send SMS: ${error.message}`)
  }
}