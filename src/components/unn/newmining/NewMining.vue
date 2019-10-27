<template>
  <div class="dashboard">
    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card title="Load OpenML Dataset">
          <va-input
            v-model="datasetId"
            placeholder="Insert dataset ID" />
          <va-button color="success" @click="getDataset">Load</va-button>
          <va-button color="success" @click="mineDataset" v-if="isLoaded">Mine</va-button>
        </va-card>

      </div>
      <div class="flex xs12 lg6">
        <table class="va-table va-table--striped va-table--hoverable">
          <thead>
            <tr>
              <th>Feature</th>
              <th>Possible Values</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="feature in features" v-bind:key="feature + '::' + componentKey" v-if="!isBlacklisted(feature)">
              <td>{{ feature.replace(/\"/g, "") }}</td>
              <td>
                <va-badge class="mb-2" color="dark" outline v-for="value in units[feature].values" v-bind:key="feature + '::' + value">
                  {{ value }}
                </va-badge>
              </td>
              <td style="vertical-align: top; width: 100px;">
                <va-button flat small :color="getStarColor(feature)" icon="fa fa-star" @click="star(feature)" />
                <va-button flat small color="gray" icon="fa fa-trash" @click="remove(feature)" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newmining',
  data() {
    return {
      componentKey: 0,
      datasetId: null,
      units: {},
      blacklist: {},
      isblack: false,
      features: [],
      defaultClass: null,
      isLoaded: false,
    }
  },
  components: {

  },
  methods: {
    getStarColor (feature) {
      return feature === this.defaultClass ? 'primary' : 'gray';
    },
    star (feature) {
      this.defaultClass = feature;
    },
    isBlacklisted(feature) {
      return this.blacklist && this.blacklist[feature] === true;
    },
    remove(feature) {
      this.isblack = true;
      this.blacklist[feature] = true;
      this.componentKey++;
    },
    getDataset() {
      this.$api.loadDataset(this.datasetId).then(() => {
        setTimeout(() => this.$api.fetchUnitsReport().then((result) => {
          this.units = result.data.units;
          this.features = result.data.features;
          this.defaultClass = this.features[this.features.length - 1];
          this.isLoaded = true;
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

<style lang="scss">
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
