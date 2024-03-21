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
                </div>
                `
            )
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async sendInactivityEmail(data) {
        try {
            const result = await EmailService.sendEmail(
                data.email,
                `Deleted account ${data.email} for inactivity`,
                `
                <div>
                    <p>Your account was deleted for inactivity from the system</p>
                </div>
                `
            )
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    static async sendProductDeletedEmail(data, productId) {
        try {
            const result = await EmailService.sendEmail(
                data.email,
                `The product id ${productId} was deleted`,
                `
                <div>
                    <p>Please contact to the Admin</p>
                </div>
                `
            )
            return result;
        } catch (error) {
            throw new Error(error.message)
        }
    }
}