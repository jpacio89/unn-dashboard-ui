<template>
  <div class="dashboard">
    <tabs :options="{ useUrlFragment: false }">
        <tab name="Dataset Descriptor" class="va-tab__content">
          <div style="display: block; width: 100%;">
            <div class="row row-equal">
              <div class="flex xs12 feature-list">
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
            <div>
              <va-button color="success" @click="mineDataset" v-if="isLoaded">Mine</va-button>
            </div>
          </div>
        </tab>
        <tab name="Mining Report">
          <api-request
            :resource="load()"
            :sync="$route.params.page"
            v-model="miningReport"
            effect="fadeIn"
            spinner="PulseLoader"
            spinner-color="white"
            :spinner-scale="2">
            <div class="row row-equal">
              <ConfusionMatrix
                v-for="matrixKey in Object.keys(miningReport.data.confusionMatrixes)"
                v-if="miningReport.data.confusionMatrixes[matrixKey]"
                v-bind:key="matrixKey"
                :feature="matrixKey"
                :matrix="miningReport.data.confusionMatrixes[matrixKey].hitMatrix"
                :unknowns="miningReport.data.confusionMatrixes[matrixKey].unknownCount" />
            </div>
          </api-request>
        </tab>
        <tab name="Simulation">
          <div class="row row-equal">
            <div class="flex xs6 simulator-picker">
              <va-card title="">
                <SimulatorPicker
                  :features="features"
                  :units="units"
                  :defaultClass="defaultClass"
                  :randomSimulatorItem="randomSimulatorItem"
                  v-on:classchange="handleClassChange"
                  v-on:blacklistchange="handleBlacklistChange"
                  v-on:simulationdatachange="handleSimulationDataChange" />
              </va-card>
              <va-button color="success" @click="randomizeRawDataset">Raw Dataset</va-button>
            </div>

            <div class="flex xs6">
              <va-card title="">
                <va-chart :data="getChartData()" type="vertical-bar" v-bind:key="componentKeyChart" />
              </va-card>
            </div>
          </div>
        </tab>
    </tabs>
    <modal name="load-dataset-modal" :scrollable="false" :clickToClose="false">
      <va-card title="Load OpenML Dataset">
        <va-input
          v-model="datasetId"
          placeholder="Insert dataset ID" />
        <va-button color="success" @click="getDataset">Load</va-button>
      </va-card>
    </modal>
    <FeatureHistogramModal v-on:groupcountchange="handleGroupCountChange" />
    <MiningStatusModal />
  </div>
</template>

<script>
import ConfusionMatrix from '@/unn/components/ConfusionMatrix.vue';
import FeatureList from '@/unn/components/FeatureList.vue';
import SimulatorPicker from '@/unn/components/SimulatorPicker.vue';
import FeatureHistogramModal from '@/unn/components/FeatureHistogramModal.vue';
import MiningStatusModal from '@/unn/components/MiningStatusModal.vue';

export default {
  name: 'newmining',
  data() {
    return {
      componentKeyChart: 0,
      datasetId: null,
      units: {},
      features: [],
      defaultClass: null,
      groupCounts: {},
      blacklist: {},
      isLoaded: false,
      miningReport: {
        data: {
          confusionMatrixes: {}
        }
      },
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
    SimulatorPicker,
    FeatureHistogramModal,
    MiningStatusModal
  },
  mounted() {
    this.show();
  },
  methods: {
    load() {
      return () => this.$api.fetchMiningReport();
    },
    show () {
      this.$modal.show('load-dataset-modal');
    },
    hide () {
      this.$modal.hide('load-dataset-modal');
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
    handleGroupCountChange(feature, groupCount) {
      this.groupCounts[feature] = groupCount;
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
      this.$modal.show('mining-status-modal');
      this.$api.mineDataset({
        targetFeature: this.defaultClass,
        featureBlacklist: Object.keys(this.blacklist),
        groupCount: this.groupCounts,
      });
    },
  },
}
</script>

<style lang="scss">
.v--modal {
  box-shadow: none;
  background-color: transparent;
}

.tabs-component-tabs {
  display: flex;
}

.tabs-component-tab {
  margin: 20px 10px;
  a {
      color: rgb(44, 130, 224);
  }
}

.tabs-component-tab:first-child {
  margin-left: 0;
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
