import axios from 'axios'
// import qs from 'qs'

let ENDPOINTS

const host = 'http://localhost:7000'

ENDPOINTS = {
  'LOAD_DATASET': host + '/dataset/load',
  'FETCH_UNITS': host + '/dataset/units/1',
  'MINE_DATASET': host + '/dataset/mine/1',
  'FETCH_MINING_REPORT': host + '/mine/report/1',
  'SIMULATE': host + '/simulate/1',
  'RAW_DATASET': host + '/dataset/raw/1',
  'FEATURE_HISTOGRAM': host + '/feature/histogram/1',
  'MINING_STATUS': host + '/mine/status/1',
  'MINING_UNITS': host + '/mine/units/1',
  'MINING_CONFIG': host + '/mine/config/1',
  'MORPH': host + '/morph/1',
  'SAVE_SESSION': host + '/save/session/1',
  'LOAD_SESSION': host + '/load/session/1',
  'LIST_SAVED_SESSIONS': host + '/list/saved/sessions',
  // INFO: stocknet
  'STOCKNET_INSIGHTS': 'http://localhost:8099/digest/insights.php',
}

export default {
  loadDataset: (datasetName, datasetId) => axios.post(ENDPOINTS['LOAD_DATASET'] + '/' + datasetId + `?name=${datasetName}`),
  fetchUnitsReport: () => axios.get(ENDPOINTS['FETCH_UNITS']),
  mineDataset: (args) => axios.post(ENDPOINTS['MINE_DATASET'], args, { headers: { 'Content-Type': 'application/json' } }),
  fetchMiningReport: () => axios.get(ENDPOINTS['FETCH_MINING_REPORT']),
  simulate: (args) => axios.post(ENDPOINTS['SIMULATE'], args, { headers: { 'Content-Type': 'application/json' } }),
  getRawDataset: () => axios.get(ENDPOINTS['RAW_DATASET']),
  getFeatureHistogram: (groupCount, feature) => axios.get(`${ENDPOINTS['FEATURE_HISTOGRAM']}?groupCount=${groupCount}&feature=${feature}`),
  getMiningStatus: () => axios.get(ENDPOINTS['MINING_STATUS']),
  getMiningUnits: () => axios.get(ENDPOINTS['MINING_UNITS']),
  getMiningConfig: () => axios.get(ENDPOINTS['MINING_CONFIG']),
  morph: (args) => axios.post(ENDPOINTS['MORPH'], args, { headers: { 'Content-Type': 'application/json' } }),
  saveSession: () => axios.post(ENDPOINTS['SAVE_SESSION']),
  loadSession: (sessionName) => axios.post(ENDPOINTS['LOAD_SESSION'] + `?name=${sessionName}`),
  listSavedSessions: () => axios.get(ENDPOINTS['LIST_SAVED_SESSIONS']),
  getStocknetInsights: () => axios.get(ENDPOINTS['STOCKNET_INSIGHTS']),
}
