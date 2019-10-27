import axios from 'axios'
import qs from 'qs';

let ENDPOINTS;

const host = 'http://localhost:7000';

ENDPOINTS = {
  'LOAD_DATASET': host + '/dataset/load',
  'FETCH_UNITS': host + '/dataset/units/1',
  'MINE_DATASET': host + '/dataset/mine/1'
};

export default {
    loadDataset: (datasetId) => axios.post(ENDPOINTS['LOAD_DATASET'] + '/' + datasetId),
    fetchUnitsReport: () => axios.get(ENDPOINTS['FETCH_UNITS']),
    mineDataset: (args) => axios.post(ENDPOINTS['MINE_DATASET'], args, {headers: {'Content-Type':'application/json' } })
}
