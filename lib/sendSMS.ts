import axios from 'axios'

const CLICKSEND_USERNAME = process.env.CLICKSEND_USERNAME
const CLICKSEND_API_KEY = process.env.CLICKSEND_API_KEY

function formatPhoneNumberForClickSend(phone: string): string {
  const digits = phone.replace(/\D/g, '')
  
  if (digits.startsWith('64')) {
    return `+${digits}`
  } else if (digits.startsWith('0')) {
    return `+64${digits.slice(1)}`
  } else {
    return `+64${digits}`
  }
}

export async function sendSMS(to: string, message: string): Promise<void> {
  const formattedPhone = formatPhoneNumberForClickSend(to)
  
  if (!formattedPhone || !message || !CLICKSEND_USERNAME || !CLICKSEND_API_KEY) {
    console.error('Missing required parameters for SMS sending:', { 
      hasPhone: !!formattedPhone, 
      hasMessage: !!message, 
      hasUsername: !!CLICKSEND_USERNAME, 
      hasApiKey: !!CLICKSEND_API_KEY 
    })
    throw new Error('Missing required parameters for SMS sending')
  }

  const data = {
    messages: [
      {
        source: "sdk",
        body: message,
        to: formattedPhone
      }
    ]
  }

  try {
    console.log('Sending SMS to:', formattedPhone)
    const response = await axios.post('https://rest.clicksend.com/v3/sms/send', data, {
      auth: {
        username: CLICKSEND_USERNAME,
        password: CLICKSEND_API_KEY
      },
      headers: {
        'Content-Type': 'application/json'
      }
    })

    console.log('ClickSend API Response:', JSON.stringify(response.data, null, 2))

    if (response.data.data && response.data.data.messages && response.data.data.messages[0]) {
      const messageStatus = response.data.data.messages[0].status
      if (messageStatus !== 'SUCCESS') {
        throw new Error(`SMS sending failed: ${response.data.data.messages[0].status_text || messageStatus}`)
      }
    } else {
      throw new Error('Unexpected response format from ClickSend API')
    }

    console.log('SMS sent successfully')
  } catch (error: any) {
    console.error('Error sending SMS:', error)
    if (axios.isAxiosError(error)) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.error('ClickSend API Error Response:', error.response.data)
        console.error('ClickSend API Error Status:', error.response.status)
        console.error('ClickSend API Error Headers:', error.response.headers)
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received from ClickSend API:', error.request)
      } else {
        // Something happened in setting up the request that triggered an Error
        console.error('Error setting up ClickSend API request:', error.message)
      }
    }
    throw new Error(`Failed to send SMS: ${error.message}`)
  }
}