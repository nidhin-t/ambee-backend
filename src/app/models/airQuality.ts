'use strict';

import { Schema, Document, Model, model } from 'mongoose';

export interface IAirQuality extends Document {
    customerName: string;
    email: string;
    data: [
        {
            pollutantName: string;
            pollutantValue: string;
            aqi?: number;
            recordedDate?: string;
            color?: string;
        }
    ];
}
export interface AirQualityModel extends IAirQuality {
    appendAQIData(IAirQuality): boolean;
}

export const AirQualitySchema = new Schema({
    customerName: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    data: [
        {
            pollutantName: {
                type: String,
                enum: [
                    'pm2.5',
                    'pm10',
                    'o3-1h',
                    'o3-8h',
                    'so2-1h',
                    'so2-2h',
                    'no2',
                    'co'
                ],
                required: true
            },
            pollutantValue: {
                type: Number,
                required: true
            },
            aqi: {
                type: Number,
                default: 0
            },
            color: {
                type: String,
                enum: ['Green', 'Yellow', 'Orange', 'Red', 'Purple', 'Maroon']
            },
            recordedDate: {
                type: Date,
                default: Date.now()
            }
        }
    ]
});

AirQualitySchema.methods.appendAQIData = async () => {
    /*
	try {
        // console.log('details caught in model> OLD DETAILS', newDetails);
        console.log('details caught in model> NEW DETAILS', this);
        console.log('preview data>');

        this.data.push({
            pollutantName: newDetails.data.pollutantName,
            pollutantValue: newDetails.data.pollutantValue
        });
        let result = await this.save();
        console.log('saved data>', result);
        if (!result) {
            throw new Error('failed to append data');
        }

        return true;
    } catch (err) {
        console.log(err);
        return false;
	}
	*/
};

const AirQuality: Model<AirQualityModel> = model<AirQualityModel>(
    'AirQuality',
    AirQualitySchema
);
export default AirQuality;
