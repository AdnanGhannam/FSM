import { Types, Schema, model } from "mongoose";
import { PLAN } from "./Plan.model";
import { PAYMENT } from "./Payment.model";
import { USER } from "./User.model";

export const PLAN_PAYMENT = "PlanPayment";

const create = () => {
    const planPaymentSchema = new Schema({
        plan: {
            type: Types.ObjectId,
            ref: PLAN
        },
        payment: {
            type: Types.ObjectId,
            ref: PAYMENT
        },
        paidBy: {
            type: Types.ObjectId,
            ref: USER
        }
    });

    const PlanPayment = model(PLAN_PAYMENT, planPaymentSchema);

    return PlanPayment;
};

const planPaymentModel = { create };

export default planPaymentModel;