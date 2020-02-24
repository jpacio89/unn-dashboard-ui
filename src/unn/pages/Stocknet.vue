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
                                style="vertical-align: top; width: 250px;">
                                <div>
                                    DOWN =
                                    <b>{{ getPrediction(instrument, timeline, 'DOWN') }}</b>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    (SD{{ getAccuracySide(instrument, timeline, 'DOWN') }}%)
                                    (GL{{ getAccuracy(instrument, timeline, 'DOWN') }}%)
                                </div>
                                <div>
                                    MID =
                                    <b>{{ getPrediction(instrument, timeline, '-') }}</b>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    (SD{{ getAccuracySide(instrument, timeline, '-') }}%)
                                    (GL{{ getAccuracy(instrument, timeline, '-') }}%)
                                </div>
                                <div>
                                    UP =
                                    <b>{{ getPrediction(instrument, timeline, 'UP') }}</b>
                                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                                    (SD{{ getAccuracySide(instrument, timeline, 'UP') }}%)
                                    (GL{{ getAccuracy(instrument, timeline, 'UP') }}%)
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
          'i1': 'EUR/USD',
          'i15': 'CAD/JPY',
          'i9': 'EUR/CHF',
          'i19': 'Silver',
          'i3': 'NZD/USD',
          'i8': 'EUR/GBP',
          'i14': 'AUD/JPY',
          'i26': 'China 50',
          'i11': 'GBP/JPY',
          'i5': 'USD/JPY',
          'i10': 'EUR/JPY',
          'i22': 'Natural Gas',
          'i6': 'USD/CHF',
          'i4': 'USD/CAD',
          'i18': 'Gold',
          'i21': 'Copper',
          'i13': 'EUR/CAD',
          'i7': 'AUD/USD',
          'i12': 'EUR/AUD',
          'i16': 'CHF/JPY',
          'i25': 'US Dollar Index',
          'i17': 'Crude Oil',
          'i2': 'GBP/USD',
          'i27': 'USA 500',
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
      },
      getAccuracy(instrument, timeline, indicator) {
          if (!this.insights ||
              !this.insights[instrument] ||
              !this.insights[instrument][timeline] ||
              !this.insights[instrument][timeline].confusionMatrixes[indicator]) {
            return '?';
          }
          const confusionMatrixes = this.insights[instrument][timeline].confusionMatrixes[indicator];
          const acc = (confusionMatrixes[0][0] + confusionMatrixes[2][2]) * 100 / (confusionMatrixes[0][0] + confusionMatrixes[2][2] + confusionMatrixes[0][2] + confusionMatrixes[2][0]);
          return Math.round(acc);
      },
      getAccuracySide(instrument, timeline, indicator) {
            if (!this.insights ||
              !this.insights[instrument] ||
              !this.insights[instrument][timeline] ||
              !this.insights[instrument][timeline].confusionMatrixes[indicator]) {
            return '?';
            }
            const prediction = this.getPrediction(instrument, timeline, indicator);
            const confusionMatrixes = this.insights[instrument][timeline].confusionMatrixes[indicator];
            let acc;
            if (prediction === 20) {
                acc = Math.round(confusionMatrixes[2][2] * 100 / (confusionMatrixes[2][0] + confusionMatrixes[2][2]));
            } else if (prediction === -20) {
                acc = Math.round(confusionMatrixes[0][0] * 100 / (confusionMatrixes[0][0] + confusionMatrixes[0][2]));
            } else {
                acc = '?';
            }
          return acc;
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
