import { Request, Response } from 'express';
/**
 * SAMPLE FUNCTION - CAN BE REMOVED
 * @param req Request
 * @param res Response
 */
export const helloWorld = function (req: Request, res: Response) {
    return res.status(200).json({
        message: 'Hello World!'
    });
};

export const helloWorld2 = (req: Request, res: Response) => {
    return res.status(200).json({
        message: 'Hello World'
    });
};
