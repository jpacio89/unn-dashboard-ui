<template>
    <div class="stocknet">
        <div style="display: block; width: 100%;">
            <div class="row row-equal">
                <div class="flex xs12 session-list">
                    <va-card title="Stocknet">
                        <table class="va-table va-table--striped va-table--hoverable">
                          <thead>
                            <tr>
                              <th>Instrument</th>
                              <th
                                v-for="timeline in timelines"
                                v-bind:key="timeline">
                                {{ timeline }}
                              </th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr v-for="instrument in instruments" v-bind:key="instrument">
                              <td>{{ instrumentNames[instrument] || instrument }}</td>
                              <td
                                v-for="timeline in timelines"
                                v-bind:key="instrument + '-' + timeline"
                                style="vertical-align: top; width: 200px;">
                                <div>
                                    DOWN = <b>{{ getPrediction(instrument, timeline, 'DOWN') }}</b>
                                </div>
                                <div>
                                    MID = <b>{{ getPrediction(instrument, timeline, '-') }}</b>
                                </div>
                                <div>
                                    UP = <b>{{ getPrediction(instrument, timeline, 'UP') }}</b>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </va-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'savedsessions',
  data() {
    return {
      insights: [],
      timelines: [],
      instruments: [],
      instrumentNames: {
          'i1': 'EURUSD',
          'i15': 'CADJPY',
          'i9': 'EURCHF'
      }
    }
  },
  components: {},
  mounted() {
    this.$api.getStocknetInsights().then((result) => {
        debugger;
      this.insights = result.data;
      this.instruments = Object.keys(this.insights);
      this.timelines = Object.keys(this.insights[this.instruments[0]]);
    });
  },
  methods: {
      getPrediction(instrument, timeline, indicator) {
        if (!this.insights ||
            !this.insights[instrument] ||
            !this.insights[instrument][timeline] ||
            !this.insights[instrument][timeline].predictions[indicator]) {
                return '?';
            }
        return Math.round(this.insights[instrument][timeline].predictions[indicator]);
      }
  },
}
</script>

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
  table {
    width: 100%;
  }
</style>
