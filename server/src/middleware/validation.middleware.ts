import { NextFunction, Request, Response } from "express";
import { AnyZodObject } from "zod";

export const validate = (schema: AnyZodObject) => async (req: Request, res: Response, next: NextFunction) => {
    const result = await schema.safeParse({
        body: req.body,
        query: req.query,
        params: req.params,
    });

    if (!result.success) {
        return res.status(400).json({
            message: "Validation failed",
            details: result.error.errors.map((issue) => ({
                path: issue.path.join(": "),
                message: issue.message
            }))

        });
    } else {
        return next();
    }

}