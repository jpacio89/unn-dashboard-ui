<template>
    <modal name="feature-histogram-modal" :scrollable="false" @before-open="beforeOpen" :width="800" :height="600">
        <div class="container">
      <!--<va-card>-->
          <div style="height: 400px;">
              <va-chart :data="getChartData()" type="vertical-bar" />
          </div>
          <div class="controls">
              <input type="number" v-model="groupCount" />
              <va-button color="success" @click="plotHistogram">Load</va-button>
          </div>
        </div>
      <!--</va-card>-->
    </modal>
</template>

<script>
export default {
  name: 'FeatureHistogramModal',
  props: [],
  data() {
    return {
        histogram: {},
        feature: '',
        groupCount: 0,
    }
  },
  components: {

  },
  methods: {
    plotHistogram() {
        this.$api.getFeatureHistogram(this.groupCount, this.feature).then(() => {
            setTimeout(() => this.$api.fetchUnitsReport().then((result) => {
                this.histogram = result.data.units[this.feature].histogram.occurences;
                this.groupCount = Object.keys(this.histogram).length;
            }), 1000);
        });
    },
    beforeOpen(event) {
        this.histogram = event.params.histogram.occurences;
        this.feature = event.params.feature;
        this.groupCount = Object.keys(this.histogram).length;
    },
    getChartData() {
        const labels = Object.keys(this.histogram);
        labels.sort((a, b) => a - b);
        let values = [];
        labels.forEach((label) => {
          values.push(this.histogram[label]);
        });
        return {
          'labels': labels,
          'datasets': [
            {
              label: 'Occurences',
              backgroundColor: this.$themes['primary'],
              borderColor: 'transparent',
              data: values
            }
          ],
        };
    },
  },
}
</script>

<style lang="scss" scoped>
 .container {
     padding: 40px;
     box-sizing: border-box;
     background-color: white;
     width: 100%;
     height: 100%;

     input {
         padding: 5px;
     }

     .controls {
         height: 125px;
        display: flex;
        align-items: center;
        justify-content: center;
     }
 }
</style>
