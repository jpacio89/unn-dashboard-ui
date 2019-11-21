<template>
    <modal name="feature-histogram-modal" :scrollable="false" @before-open="beforeOpen" :width="800" :height="400">
        <div class="container">
      <!--<va-card>-->
          <va-chart :data="getChartData()" type="vertical-bar" />
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
        histogram: {}
    }
  },
  components: {

  },
  methods: {
    beforeOpen(event) {
        this.histogram = event.params.histogram.occurences;
    },
    getChartData() {
        const labels = Object.keys(this.histogram);
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
 }
</style>
