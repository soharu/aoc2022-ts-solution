'use strict';

const fs = require('fs');

function printHeightmapPPM(heightmap, scale) {
    const format = 'P3';
    const width = heightmap[0].length * scale;
    const height = heightmap.length * scale;
    const maxValue = 255;

    const LOWERCASE = 'abcdefghijklmnopqrstuvwxyz';

    const getColor = (c) => {
        if (c === 'S') {
            return [0, 0, maxValue];
        } else if (c === 'E') {
            return [maxValue, 0, 0];
        } else {
            const index = LOWERCASE.indexOf(c);
            const value = maxValue - (5 + 8 * index);
            return [value, value, value];
        }
    }

    console.log(`${format}`);
    console.log(`${width} ${height}`);
    console.log(`${maxValue}`);

    const pixels = [];
    for (let row = 0; row < height; ++row) {
        for (let col = 0; col < width; ++col ) {
            const r = Math.floor(row / scale);
            const c = Math.floor(col / scale);
            const values = getColor(heightmap[r][c]).map((v) => `${v}`.padStart(3, ' '))
            console.log(values.join(' '))
        }
    }
}

function main(params) {
    const filename = params[2]
    const scale = parseInt(params[3] ?? '', 10)

    if (filename === undefined || scale === NaN) {
        console.error([
            'Error: invalid arguments',
            `  Usage: node ${params[1]} [filename] [scale]`
        ].join('\n'));
        return;
    }

    const buffer = fs.readFileSync(filename);
    const fileContent = buffer.toString();
    const heightmap = fileContent.split('\n').map((line) => line.split(''))

    printHeightmapPPM(heightmap, scale);
}

main(process.argv);
