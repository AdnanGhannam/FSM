import { Response } from "express";
import { Types, connection } from "mongoose";

export type HttpError = { message: string };

export const httpResponse = (success: boolean, data: any = null, errors: HttpError[] = []) => {
    return { success, data, errors };
};

export const httpErrors = (...messages: string[]) => {
    const errors = messages.map(message => { return { message }; });
    
    return httpResponse(false, null, errors);
};

export const requiredFields = (obj: {[key: string]: any}) => {
    const fields = Object.keys(obj).map(field => `'${field}'`);

    const fieldsAsString = fields.reduce((previous, current, index) => {
        return (index == fields.length - 1) 
            ? `${previous} and ${current}`
            : `${previous}, ${current}`;
    });

    return httpErrors(`All the following fields are required: ${fieldsAsString}`); 
};

export const isValidId = (id: string, res: Response) => {
    if (!Types.ObjectId.isValid(id)) {
        res.status(404)
            .json(httpErrors(`Id '${id}' is not valid`));

        return false;
    }

    return true;
};

export const isExisted = (id: string, value: any, res: Response) => {
    if (!value) {
        res.status(404)
            .json(httpErrors(`Item with Id '${id}' is not found`));

        return false;
    }

    return true;
};

export const tryHandle = async (func: () => Promise<void>, res: Response) => {
    try {
        await func();
    } catch(err: any) {
        if (err.errors) {
            const errorMessages = Object.values<any>(err.errors).map(value => value.message);
            res.status(400).json(httpErrors(...errorMessages));
            return;
        }

        res.status(400).json(httpErrors(err));
    }
}
