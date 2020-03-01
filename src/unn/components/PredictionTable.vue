<template>
    <table>
        <thead>
            <th>Indicator</th>
            <th>Value</th>
            <th>TPR/TNR</th>
            <th>Accuracy</th>
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
        return indicator !== '-' && prediction === 20 && acc >= 70;
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
