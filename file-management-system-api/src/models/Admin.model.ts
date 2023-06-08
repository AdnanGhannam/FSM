import { Schema, model } from "mongoose";

export const ADMIN = "Admin";

const create = () => {
    const adminSchema = new Schema({
        name: {
            type: String,
            required: true,
            minlength: 2,
            maxlength: 20
        },
        email: {
            type: String,
            match: /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
            required: true
        },
        password: {
            type: String,
            required: true,
            minlength: 10 
        },
        joinedAt: {
            type: Number,
            immutable: true,
            default: Date.now()
        }
    });

    const Admin = model(ADMIN, adminSchema);

    return Admin;
};

const adminModel = { create };

export default adminModel;