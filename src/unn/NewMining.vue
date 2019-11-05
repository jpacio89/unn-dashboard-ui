<template>
  <div class="dashboard">
    <tabs>
        <tab name="Dataset Report">
          <va-button color="success" @click="mineDataset" v-if="isLoaded">Mine</va-button>
          <va-button color="success" @click="getReport">Report</va-button>
          <div class="row row-equal">
            <div class="flex xs12">
              <va-card title="Dataset Features">
                <FeatureList
                  :features="features"
                  :units="units"
                  :defaultClass="defaultClass"
                  v-on:classchange="handleClassChange"
                  v-on:blacklistchange="handleBlacklistChange" />
              </va-card>
            </div>
          </div>
        </tab>
        <tab name="Mining Report">
          <div class="row row-equal">
            <ConfusionMatrix
              v-for="matrixKey in Object.keys(miningReport.confusionMatrixes)"
              v-bind:key="matrixKey"
              :feature="matrixKey"
              :matrix="miningReport.confusionMatrixes[matrixKey].hitMatrix"
              :unknowns="miningReport.confusionMatrixes[matrixKey].outlier" />
          </div>
        </tab>
        <tab name="Simulation Report">
          <div class="row row-equal">
            <div class="flex xs4 lg3">
              <va-button color="success" @click="randomizeRawDataset">Raw Dataset</va-button>
              <SimulatorPicker
                :features="features"
                :units="units"
                :defaultClass="defaultClass"
                :randomSimulatorItem="randomSimulatorItem"
                v-on:classchange="handleClassChange"
                v-on:blacklistchange="handleBlacklistChange"
                v-on:simulationdatachange="handleSimulationDataChange" />
            </div>

            <div class="flex xs8 lg6">
              <va-chart :data="getChartData()" type="vertical-bar" v-bind:key="componentKeyChart" />
            </div>
          </div>
        </tab>
    </tabs>
    <modal name="hello-world" :scrollable="false" :clickToClose="false">
      <va-card title="Load OpenML Dataset">
        <va-input
          v-model="datasetId"
          placeholder="Insert dataset ID" />
        <va-button color="success" @click="getDataset">Load</va-button>
      </va-card>
    </modal>
  </div>
</template>

<script>
import ConfusionMatrix from '@/unn/ConfusionMatrix.vue'
import FeatureList from '@/unn/FeatureList.vue'
import SimulatorPicker from '@/unn/SimulatorPicker.vue'
import { getVerticalBarChartData } from '../data/charts/VerticalBarChartData'

export default {
  name: 'newmining',
  data() {
    return {
      componentKeyChart: 0,
      datasetId: null,
      units: {},
      features: [],
      defaultClass: null,
      blacklist: {},
      isLoaded: false,
      miningReport: {
        confusionMatrixes: {}
      },
      verticalBarChartData: getVerticalBarChartData(this.$themes),
      simulationData: {
        predictions: {}
      },
      rawDataset:[],
      randomSimulatorItem: null
    }
  },
  components: {
    ConfusionMatrix,
    FeatureList,
    SimulatorPicker
  },
  mounted() {
    this.show();
  },
  methods: {
    show () {
      this.$modal.show('hello-world');
    },
    hide () {
      this.$modal.hide('hello-world');
    },
    randomizeRawDataset() {
      const guess = Math.round(Math.random() * this.rawDataset.length);
      this.randomSimulatorItem = this.rawDataset[guess];
    },
    handleSimulationDataChange(simulationData) {
      this.simulationData = simulationData;
      this.componentKeyChart++;
    },
    handleClassChange(newClass) {
      this.defaultClass = newClass;
    },
    handleBlacklistChange(blacklist) {
      this.blacklist = blacklist;
    },
    getChartData() {
      const labels = Object.keys(this.simulationData.predictions);
      let values = [];
      labels.forEach((label) => {
        values.push(this.simulationData.predictions[label]);
      });
      return {
        'labels': labels,
        'datasets': [
          {
            label: 'Prediction',
            backgroundColor: this.$themes['primary'],
            borderColor: 'transparent',
            data: values
          }
        ],
      };
    },
    getRawDataset() {
      this.$api.getRawDataset().then((result) => {
        this.rawDataset = result.data;
      });
    },
    getReport() {
      this.$api.fetchMiningReport().then((result) => {
        this.miningReport = result.data;
      });
    },
    getDataset() {
      this.$api.loadDataset(this.datasetId).then(() => {
        setTimeout(() => this.$api.fetchUnitsReport().then((result) => {
          this.units = result.data.units;
          this.features = result.data.features;
          this.defaultClass = this.features[this.features.length - 1];
          this.isLoaded = true;
          this.getRawDataset();
          this.hide();
        }), 1000);
      });
    },
    mineDataset() {
      this.$api.mineDataset({
        targetFeature: this.defaultClass,
        featureBlacklist: Object.keys(this.blacklist)
      });
    },
    launchEpicmaxToast () {
      this.showToast(`Let's work together!`, {
        icon: 'fa-star-o',
        position: 'top-right',
        duration: Infinity,
        action: {
          text: 'Hire us',
          href: 'http://epicmax.co/#/contact',
          class: 'vuestic-toasted-link',
        },
      })
    },
  },
}
</script>

<style>
.v--modal {
  box-shadow: none;
  background-color: transparent;
}
</style>
<style lang="scss" scoped>
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
