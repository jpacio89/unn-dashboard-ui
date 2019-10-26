<template>
  <div class="dashboard">
    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card title="Load OpenML Dataset">
          <va-input
            v-model="datasetId"
            placeholder="Insert dataset ID" />
          <va-button color="success" @click="getDataset">
            Load
          </va-button>
        </va-card>

      </div>
      <div class="flex xs12 lg6">
        <table class="va-table va-table--striped va-table--hoverable">
          <thead>
            <tr>
              <th>Name</th>
              <th>Values</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            <tr v-for="feature in Object.keys(units)">
              <td>{{ feature.replace(/\"/g, "") }}</td>
              <td>
                <va-badge class="mb-2" color="dark" outline v-for="value in units[feature].values">{{ value }}</va-badge>
              </td>
              <td style="vertical-align: top;">
                <va-button flat small color="gray" icon="fa fa-trash" />
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
      datasetId: null,
      units: {},
    }
  },
  components: {

  },
  methods: {
    getDataset() {
      this.$api.loadDataset(this.datasetId).then(() => {
        debugger;
        setTimeout(() => this.$api.fetchUnitsReport().then((result) => {
          this.units = result.data.units;
        }), 1000);
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
