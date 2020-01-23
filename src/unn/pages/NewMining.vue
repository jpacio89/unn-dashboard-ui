<template>
  <div class="dashboard">
    <tabs :options="{ useUrlFragment: false }">
        <tab name="Dataset Descriptor" class="va-tab__content">
          <div style="display: block; width: 100%;">
            <div class="row row-equal">
              <div class="flex xs12 feature-list">
                <va-card title="Dataset Features">
                  <FeatureList
                    :bl="blacklist"
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
            :sync="miningCounter"
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
                  :miningUnits="miningUnits"
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
    <FeatureHistogramModal
        v-on:groupcountchange="handleGroupCountChange" />
    <MiningStatusModal
        v-on:miningdone="handleMiningDone" />
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
      randomSimulatorItem: null,
      miningCounter: 0,
      miningUnits: {},
      miningConfig: {},
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
    this.$api.getMiningUnits().then((result) => {
      this.miningUnits = result.data;
    });
    this.getMiningConfig();
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
    getMiningConfig() {
        this.$api.getMiningConfig().then((result) => {
          this.miningConfig = result.data;
        });
    },
    randomizeRawDataset() {
      const guess = Math.round(Math.random() * this.rawDataset.body.length);
      this.randomSimulatorItem = {
          body: this.rawDataset.body[guess],
          header: this.rawDataset.header,
      };
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
    handleMiningDone() {
      this.$api.getMiningUnits().then((result) => {
          this.miningUnits = result.data;
      });
      this.miningCounter++;
    },
    getChartData() {
      const labels = Object.keys(this.simulationData.predictions);
      labels.sort((a, b) => a - b);
      const rangeLabels = [];
      let values = [];
      labels.forEach((label) => {
        const range = this.getOuterRange(label);
        rangeLabels.push(range);
        const prediction = this.simulationData.predictions[label];
        values.push(prediction);
      });
      return {
        'labels': rangeLabels,
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
    getMiningTargetFeature() {
        return this.miningConfig.targetFeature;
    },
    getOuterRange(innerValue) {
        const targetFeature = this.getMiningTargetFeature();
        const outerPossibleValues = Object.keys(this.miningUnits);
        // TODO: fix hardcoded action & MIN/MAX
        const mapper = this.miningUnits[outerPossibleValues[0]].units[targetFeature];
        if (!mapper.mapperBounds) {
            return innerValue;
        }
        const range = 40 + 1;
        const step = Math.floor(Math.max(1, range / (mapper.groupCount + 2)));
		const index = Math.floor((parseInt(innerValue) + 20) / step);
        if (index == 0) {
            return `< ${mapper.mapperBounds[0].first_}`;
        } else if (index == mapper.mapperBounds.length) {
            return `>= ${mapper.mapperBounds[mapper.mapperBounds.length - 1].second_}`;
        }
        const bound = mapper.mapperBounds[index];
        return `[${bound.first_}, ${bound.second_}]`;
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
          this.setInitialBlacklist();
          this.defaultClass = this.features[this.features.length - 1];
          this.isLoaded = true;
          this.getRawDataset();
          this.hide();
        }), 1000);
      });
    },
    setInitialBlacklist() {
        this.features.forEach((feature) => {
            if (this.units[feature] && this.units[feature].allInnerValues.length <= 1) {
                this.blacklist[feature] = true;
            }
        });
    },
    mineDataset() {
      this.$api.mineDataset({
        targetFeature: this.defaultClass,
        featureBlacklist: Object.keys(this.blacklist),
        groupCount: this.groupCounts,
    }).finally(() => {
        this.$modal.show('mining-status-modal');
        this.getMiningConfig();
    })
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
