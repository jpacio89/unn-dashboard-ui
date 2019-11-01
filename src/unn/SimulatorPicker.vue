<template>
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
          this.componentKey++;
        }
        return;
      }
      this.pickedValues[feature][value] = !this.pickedValues[feature][value];
      if (!noUiRefresh) {
        this.componentKey++;
      }
    },
    star (feature) {
        ((this.units[feature] || {}).values || []).forEach((_value) => {
          this.toggleValue(feature, _value);
        });
        this.componentKey++;
    },
    isBlacklisted(feature) {
      return this.blacklist && this.blacklist[feature] === true;
    },
    remove(feature) {
      this.isblack = true;
      this.blacklist[feature] = true;
      this.componentKey++;
    },
  },
}
</script>

<style lang="scss" scoped>
</style>
