const fs = require('fs').promises;
const path = require('path');

const { citySearch } = require('./requests');
const { txtFileListToArray, delay, progress, log } = require('./utils');

async function getDataForCity(cityName, countryCode) {
    const resp = await citySearch({city: cityName, countrycodes: countryCode});
    return resp.data.find((v) => v.type === 'city');
}

async function getDataForCounty(county, countryCode) {
    const resp = await citySearch({county, countrycodes: countryCode});
    return resp.data.find((v) => v.type === 'administrative' && v.place_rank === 12);
}

async function writeGeoJsons(listFilePath, country, outPath) {
    await fs.rmdir(path.resolve(outPath), { recursive: true });
    await fs.mkdir(path.resolve(outPath));

    const list = await txtFileListToArray(path.resolve(listFilePath));
    const debug = {};

    log(`Found ${list.length} objects in list file`);

    let filesCreatedCount = 0;
    let errorsCount = 0;
    let citiesCount = 0;
    let countiesCount = 0;

    for (const name of list) {
        let data = await getDataForCity(name, country);

        if (!data) {
            data = await getDataForCounty(name, country);
        }

        if (data) {
            if (data.type === 'city') {
                citiesCount++;
            } else if (data.type === 'administrative') {
                countiesCount++;
            }

            debug[name] = {
                display_name: data.display_name,
            }

            await fs.writeFile(
                path.resolve(outPath, name + '.json'),
                JSON.stringify(data.geojson, null, 2)
            );
        } else {
            debug[name] = {
                error: `Data for ${name} not found`,
            }

            errorsCount++;
        }

        filesCreatedCount++;
        log(progress(filesCreatedCount, list.length));
        await delay(100);
    }

    const stats = [
        `Total: ${list.length}`,
        `cities: ${citiesCount}`,
        `counties: ${countiesCount}`,
        `files created: ${filesCreatedCount}`,
        `errors: ${errorsCount}`
    ].join(', ');

    log(stats);

    await fs.writeFile(
        path.resolve(outPath, 'debug.json'),
        JSON.stringify(debug, null, 2)
    );
}

module.exports = {
    writeGeoJsons,
}