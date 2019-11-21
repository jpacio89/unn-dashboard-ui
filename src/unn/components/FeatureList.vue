<template>
  <table class="va-table va-table--striped va-table--hoverable">
    <thead>
      <tr>
        <th>Feature</th>
        <th>Possible Values</th>
        <th>Action</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="feature in features" v-bind:key="feature + '::' + componentKey" v-if="!isBlacklisted(feature)">
        <td>{{ feature.replace(/\"/g, "") }}</td>
        <td>
          <va-badge class="mb-2" color="dark" outline v-for="value in units[feature].values" v-bind:key="feature + '::' + value">
            {{ value }}
          </va-badge>
        </td>
        <td style="vertical-align: top; width: 100px;">
          <va-button v-if="units[feature].histogram" flat small color="gray" icon="fa fa-search" @click="openHistogram(feature)" />
          <va-button flat small :color="getStarColor(feature)" icon="fa fa-star" @click="star(feature)" />
          <va-button flat small color="gray" icon="fa fa-trash" @click="remove(feature)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
export default {
  name: 'FeatureList',
  props: ['features', 'units', 'defaultClass'],
  data() {
    return {
      componentKey: 0,
      blacklist: {},
      isblack: false,
      defaultClassInner: null,
    }
  },
  components: {

  },
  methods: {
    getStarColor (feature) {
      return feature === (this.defaultClassInner || this.defaultClass) ? 'primary' : 'gray';
    },
    star (feature) {
      this.defaultClassInner = feature;
      this.$emit('classchange', this.defaultClassInner);
    },
    isBlacklisted(feature) {
      return this.blacklist && this.blacklist[feature] === true;
    },
    remove(feature) {
      this.isblack = true;
      this.blacklist[feature] = true;
      this.componentKey++;
      this.$emit('blacklistchange', this.blacklist);
    },
    openHistogram(feature) {
        this.$modal.show('feature-histogram-modal', {
            histogram: this.units[feature].histogram,
        });
    }
  },
}
</script>

<style lang="scss">
.feature-list .va-card__body {
  height: 650px;
  overflow-y: scroll;
}
</style>
<style lang="scss" scoped>
table {
  width: 100%;
}
</style>
