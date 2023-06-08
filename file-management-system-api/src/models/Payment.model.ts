import { Types, Schema, model } from "mongoose";

export const PAYMENT = "Payment";
export const PaymentMethods = ['creditCard', 'bankTransfer'];

const create = () => {
    const paymentSchema = new Schema({
        method: {
            type: String,
            enum: PaymentMethods,
            default: PaymentMethods[0]
        },
        amount: {
            type: Number,
            required: true
        },
        paidAt: {
            type: Number,
            immutable: true,
            default: Date.now()
        }
    });

    const Payment = model(PAYMENT, paymentSchema);

    return Payment;
}

const paymentModel = { create } 

export default paymentModel;