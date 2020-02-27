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
                              <td>
                                <b>{{ instrumentNames[instrument] || instrument }}</b>
                              </td>
                              <td
                                  v-for="timeline in timelines"
                                  v-bind:key="instrument + '-' + timeline"
                                  style="vertical-align: top; width: 300px;">
                                  <PredictionTable
                                    :insights="insights"
                                    :instrument="instrument"
                                    :timeline="`${timeline}d`" />
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
import PredictionTable from '@/unn/components/PredictionTable.vue';

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
          'i40': 'Platinum',
          'i48': 'AUD/NZD',
          'i31': 'FRA40',
          'i29': 'US30',
          'i46': 'AUD/CHF',
          'i52': 'GBP/NZD',
          'i33': 'AUS200',
          'i32': 'GER30',
          'i43': 'EURO50',
          'i42': 'USD/ZAR',
          'i72': 'CHF/HUF',
          'i66': 'ZAR/JPY',
          'i65': 'GBP/CAD',
          'i1011': 'Bank of America',
          'i1010': 'Boeing',
          'i1012': 'Caterpillar',
          'i1002': 'Google',
          'i1001': 'Apple',
          'i1003': 'Facebook',
          'i1006': 'Altaba',
          'i1007': 'Zynga',
          'i1005': 'Amazon',
          'i1009': 'American Express',
          'i1013': 'Cisco',
          'i30': 'UK100',
          'i1008': 'Alcoa',
          'i1004': 'Microsoft',
          'i49': 'EUR/NZD',
          'i1014': 'Chevron',

      }
    }
  },
  components: {
      PredictionTable
  },
  mounted() {
    this.$api.getStocknetInsights().then((result) => {
      this.insights = result.data;
      this.instruments = Object.keys(this.insights);
      //this.timelines = Object.keys(this.insights[this.instruments[0]]).map((key) => parseInt(key.replace(/d/, ''))).sort((a,b) => a-b);
      this.timelines = [3, 5, 7, 10, 14];
    });
  },
  methods: {

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
