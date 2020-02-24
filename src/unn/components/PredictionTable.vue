<template>
    <table>
        <thead>
            <th>Indicator</th>
            <th>Value</th>
            <th>Side ACC</th>
            <th>Full ACC</th>
        </thead>
        <tbody>
          <tr v-for="indicator in indicators" v-bind:key="indicator" :class="{ 'highlight': shouldHighlight(instrument, timeline, indicator) }">
            <td>{{ indicator }}</td>
            <td><b>{{ getPrediction(instrument, timeline, indicator) }}</b></td>
            <td>{{ getAccuracySide(instrument, timeline, indicator) }}%</td>
            <td>{{ getAccuracy(instrument, timeline, indicator) }}%</td>
            </td>
          </tr>
        </tbody>
    </table>
</template>

<script>
export default {
  name: 'PredictionTable',
  props: ['instrument', 'timeline', 'insights'],
  data() {
    return {
        indicators: ['DOWN', '-', 'UP'],
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
  components: {

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
      },
      shouldHighlight(instrument, timeline, indicator) {
        const prediction = this.getPrediction(instrument, timeline, indicator);
        const acc = this.getAccuracySide(instrument, timeline, indicator);
        if (acc === '?') {
            return false;
        }
        return indicator !== '-' && prediction === 20 && acc >= 85;
      }
  },
}
</script>

<style lang="scss" scoped>
  table {
    width: 100%;

    td {
      width: 33.333%;
      text-align: center;
    }

    .highlight td {
        background-color: lightgreen;
    }
  }
</style>
