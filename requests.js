const axios = require('axios');
const url = require('url');

function citySearch(queryParams) {
    const params = new url.URLSearchParams({
        ...queryParams,
        polygon_geojson: 1,
        dedupe: 0,
        format: 'jsonv2'
    });

    return axios.get('http://nominatim.openstreetmap.org/search', {
        params,
    });
}

module.exports = {
    citySearch,
};