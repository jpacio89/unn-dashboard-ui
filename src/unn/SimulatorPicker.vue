<template>
  <div>
    <table class="va-table va-table--striped va-table--hoverable">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Values</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="feature in features" v-bind:key="feature + '::' + componentKey" v-if="!isBlacklisted(feature)">
          <td>{{ feature.replace(/\"/g, "") }}</td>
          <td>
              <va-badge class="mb-2" color="dark" :outline="!!((pickedValues[feature] || {})[value])" v-for="value in units[feature].values" v-bind:key="feature + '::' + value">
                <span @click="toggleValue(feature, value)">{{ value }}</span>
              </va-badge>
          </td>
          <td style="vertical-align: top; width: 100px;">
            <va-button flat small color="gray" icon="fa fa-star" @click="star(feature)" />
            <va-button flat small color="gray" icon="fa fa-trash" @click="remove(feature)" />
          </td>
        </tr>
      </tbody>
    </table>
    <va-button color="success" @click="randomize">Randomize</va-button>
    <va-button color="success" @click="simulate">Simulate</va-button>
  </div>
</template>

<script>
export default {
  name: 'SimulatorPicker',
  props: ['features', 'units', 'defaultClass'],
  data() {
    return {
      componentKey: 0,
      blacklist: {},
      isblack: false,
      pickedValues: {}
    }
  },
  components: {

  },
  methods: {
    toggleValue(feature, value, noUiRefresh) {
      if (!this.pickedValues[feature] || !this.pickedValues[feature][value]) {
        if (!this.pickedValues[feature]) {
          this.pickedValues[feature] = {};
        }
        this.pickedValues[feature][value] = true;
        if (!noUiRefresh) {
          this.uiRefresh();
        }
        return;
      }
      this.pickedValues[feature][value] = !this.pickedValues[feature][value];
      if (!noUiRefresh) {
        this.uiRefresh();
      }
    },
    star (feature) {
        ((this.units[feature] || {}).values || []).forEach((_value) => {
          this.toggleValue(feature, _value, true);
        });
        this.uiRefresh();
    },
    isBlacklisted(feature) {
      return this.blacklist && this.blacklist[feature] === true;
    },
    remove(feature) {
      this.isblack = true;
      this.blacklist[feature] = true;
      this.uiRefresh();
    },
    uiRefresh() {
      this.componentKey++;
    },
    randomize() {
      (this.features || []).forEach((feature) => {
        const _values = (this.units[feature] || {}).values || [];
        _values.forEach((_value) => {
          this.toggleValue(feature, _value, true);
          this.pickedValues[feature][_value] = Math.random() > 0.5;
        });
        this.uiRefresh();
      });
    },
    simulate() {
      this.$api.simulate({
        blacklist: Object.keys(this.blacklist),
        seeds: this.pickedValues
      });
    }
  },
}
</script>

<style lang="scss" scoped>
</style>
