import EmailService from '../services/email.services.js';


export default class EmailController {

    static async sendTicketEmail(data) {
        try {
            const result = await EmailService.sendEmail(
                data.purchaser,
                `Ticket ${data.code}`,
                `
                <div>
                    <h1>Ticket ${data.code}</h1>
                    <p>Buyer: ${data.purchaser}</p>
                    <p>Time : ${data.purchase_datetime}</p>
                    <p>Amount : ${data.amount}</p>
                `
            )
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}