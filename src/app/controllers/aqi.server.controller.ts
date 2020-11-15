import { Request, Response } from 'express';

import AirQuality from '../models/airQuality';
import { aqiCalculator } from '../utils/aqiCalculator.util';
/**
 * SAMPLE FUNCTION
 * @param req Request
 * @param res Response
 */
export const insertAQI = async (req: Request, res: Response) => {
    try {
        let updatedData;
        const details = JSON.parse(JSON.stringify(req.body.details));
        let aqi = await aqiCalculator(
            details.data.pollutantName,
            details.data.pollutantValue
        );
        console.log('received params', aqi);
        let userExist = await AirQuality.findOne({ email: details.email });
        if (userExist) {
            userExist.data.push({
                pollutantName: details.data.pollutantName,
                pollutantValue: details.data.pollutantValue,
                aqi: aqi.value,
                color: aqi.color
            });
            updatedData = await userExist.save();
            if (!updatedData) {
                throw updatedData;
            }
        } else {
            details.data.aqi = aqi.value;
            details.data.color = aqi.color;
            let airQuality = new AirQuality(details);
            let updatedData = await airQuality.save();
            console.log('saved', updatedData);
        }
        let message = updatedData.data[updatedData.data.length - 1];
        console.log('message>>', message);
        res.status(201).send({
            data: message
        });
    } catch (err) {
        console.log('caught error', err);
        res.status(500).send({ message: 'Failed to insert.' });
    }
};
