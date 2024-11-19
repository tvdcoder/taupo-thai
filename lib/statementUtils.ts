import { prisma } from './db'

export interface StatementData {
  totalOrders: number
  totalRevenue: number
  ordersByType: Record<string, number>
  ordersByPaymentMethod: Record<string, number>
}

export async function generateStatement(startDate: Date, endDate: Date): Promise<StatementData> {
  const orders = await prisma.order.findMany({
    where: {
      createdAt: {
        gte: startDate,
        lt: endDate
      }
    },
    include: {
      items: true
    }
  })

  const statementData: StatementData = {
    totalOrders: orders.length,
    totalRevenue: orders.reduce((sum, order) => sum + order.subtotal, 0),
    ordersByType: {},
    ordersByPaymentMethod: {}
  }

  orders.forEach(order => {
    statementData.ordersByType[order.orderType] = (statementData.ordersByType[order.orderType] || 0) + 1
    statementData.ordersByPaymentMethod[order.paymentMethod] = (statementData.ordersByPaymentMethod[order.paymentMethod] || 0) + 1
  })

  return statementData
}

export async function sendStatement(data: StatementData, subject: string) {
  const FORMSPREE_ENDPOINT = 'https://formspree.io/f/your-form-id'

  const content = `
    Total Orders: ${data.totalOrders}
    Total Revenue: $${data.totalRevenue.toFixed(2)}

    Orders by Type:
    ${Object.entries(data.ordersByType).map(([type, count]) => `${type}: ${count}`).join('\n')}

    Orders by Payment Method:
    ${Object.entries(data.ordersByPaymentMethod).map(([method, count]) => `${method}: ${count}`).join('\n')}
  `

  const formData = new FormData()
  formData.append('subject', subject)
  formData.append('message', content)

  const response = await fetch(FORMSPREE_ENDPOINT, {
    method: 'POST',
    body: formData,
    headers: {
      'Accept': 'application/json'
    }
  })

  if (!response.ok) {
    throw new Error('Failed to send statement')
  }
}