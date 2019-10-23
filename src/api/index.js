import axios from 'axios'
// import qs from 'qs';

let ENDPOINTS;

const host = 'http://localhost:7000';

ENDPOINTS = {
  'LOADDATASET': host + '/dataset/load',
};

export default {
    loadDataset: (datasetId) => axios.post(ENDPOINTS['LOADDATASET'] + '/' + datasetId)
}
