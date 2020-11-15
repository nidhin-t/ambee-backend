import { pollutantChart } from './../../config/strategies/pollutantChart';

const aqiColor = (value: number) => {
    let color: string;
    if (value >= 0 && value <= 50) {
        color = 'Green';
    } else if (value >= 51 && value <= 100) {
        color = 'Yellow';
    } else if (value >= 101 && value <= 150) {
        color = 'Orange';
    } else if (value >= 151 && value <= 200) {
        color = 'Red';
    } else if (value >= 201 && value <= 300) {
        color = 'Purple';
    } else if (value >= 301 && value <= 500) {
        color = 'Maroon';
    }
    return color;
};

export const aqiCalculator = (name: string, value: number) => {
    let pChart = pollutantChart[name];
    let upperBuffer, lowerBuffer;
    let closestMatch = pChart.reduce(function (prev, curr) {
        if (
            Math.abs(curr.concentration - value) <
            Math.abs(prev.concentration - value)
        ) {
            return curr;
        }
        return prev;
    });
    if (value <= closestMatch) {
        upperBuffer = closestMatch;
        lowerBuffer = pChart[pChart.indexOf(closestMatch) - 1];
    } else {
        lowerBuffer = closestMatch;
        upperBuffer = pChart[pChart.indexOf(closestMatch) + 1];
    }
    console.log(
        'result from upperbuffer & lowerbuffer>',
        upperBuffer,
        lowerBuffer
    );
    let pmObs = value,
        pmMax = upperBuffer.concentration,
        pmMin = lowerBuffer.concentration,
        aqiMax = upperBuffer.aqi,
        aqiMin = lowerBuffer.aqi;
    //* Equation = (((pmObs-pmMin)*(aqiMax-aqiMin))/(pmMax-pmMin))+aqiMin
    let upperequation = (pmObs - pmMin) * (aqiMax - aqiMin);
    let lowerequation = pmMax - pmMin;
    let division = upperequation / lowerequation;
    let aqi = Math.round(division + aqiMin);
    let color = aqiColor(aqi);
    console.log('final aqi result>>', aqi, color);
    return {
        value: aqi,
        color: color
    };
};

// var counts = [4, 9, 15, 6, 2],
//     goal = 35.6;

// var closest = array.reduce(function (prev, curr) {
//     return Math.abs(curr.concentration - goal) <
//         Math.abs(prev.concentration - goal)
//         ? curr
//         : prev;
// });

// console.log(closest);
