<template>
  <div>
    <table
        class="va-table va-table--striped va-table--hoverable"
        v-if="this.randomSimulatorItem">
      <thead>
        <tr>
          <th>Feature</th>
          <th>Values</th>
          <th>Action</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="(feature, index) in this.randomSimulatorItem.header" v-bind:key="feature + '::' + componentKey" v-if="!isBlacklisted(feature)">
          <td>{{ feature.replace(/\"/g, "") }}</td>
          <td>
              <va-badge
                class="mb-2"
                color="dark"
                :outline="!!((pickedValues[feature] || {})[value])"
                v-for="value in units[feature].values"
                v-bind:key="feature + '::' + value">
                <span @click="toggleValue(feature, value)">{{ value }}</span>
              </va-badge>
              <!--  && (!pickedValues[feature] || pickedValues[feature].length <= 1) -->
              <span v-if="randomSimulatorItem && getOuterRange(feature, randomSimulatorItem.body[index]) !== 'N/A'">
                  {{ randomSimulatorItem.body[index] }}
                  &nbsp;
                  {{ getOuterRange(feature, randomSimulatorItem.body[index]) }}
              </span>
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
    <va-button color="success" @click="morph">Morph</va-button>
    <div>
        <input type="text" v-model="rawInput" />
        <va-button color="success" @click="simulateRaw">Raw Input</va-button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'SimulatorPicker',
  props: ['features', 'units', 'defaultClass', 'randomSimulatorItem', 'miningUnits'],
  data() {
    return {
      componentKey: 0,
      blacklist: {},
      isblack: false,
      pickedValues: {},
      rawInput: '{}',
    }
  },
  watch: {
    randomSimulatorItem: function() {
      if (this.randomSimulatorItem) {
        this.pickedValues = {};
        this.randomSimulatorItem.header.forEach((feature, index) => {
            console.log(this.randomSimulatorItem);
            if (!this.pickedValues[feature]) {
                this.pickedValues[feature] = {};
            }
            this.pickedValues[feature][this.randomSimulatorItem.body[index]] = true;
        });
        this.componentKey++;
      }
    }
  },
  components: {

  },
  methods: {
    simulateRaw() {
        this.pickedValues = JSON.parse(this.rawInput);
        this.componentKey++;
        this.simulate();
    },
    getOuterRange(feature, outerValue) {
        const outerPossibleValues = Object.keys(this.miningUnits);
        const mapper = this.miningUnits[outerPossibleValues[0]].units[feature];
        if (!mapper || !mapper.mapperBounds) {
            return "N/A";
        }
        let index = 0;
        mapper.mapperBounds.forEach((bound) => {
            if (outerValue < bound.first_) {
    			return;
    		}
    		index++;
    		if (outerValue < bound.second_) {
    			return;
    		}
        });

        /*const range = 40 + 1;
		const step = Math.max(1, range / (mapper.groupCount + 2));
		const innerVal = Math.floor(-20 + step * index);*/
        if (index === 0) {
            return `< ${mapper.mapperBounds[0].first_}`;
        } else if (index === mapper.mapperBounds.length) {
            return `>= ${mapper.mapperBounds[mapper.mapperBounds.length - 1].second_}`;
        }
        const bound = mapper.mapperBounds[index-1];
        return `[${bound.first_}, ${bound.second_}]`;
        //return innerVal;
    },
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
    morph() {
        this.$api.morph({
          blacklist: Object.keys(this.blacklist),
          seeds: this.pickedValues
        }).then((result) => {
            this.$emit('morphdatachange', result.data);
        });
    },
    simulate() {
      this.$api.simulate({
        blacklist: Object.keys(this.blacklist),
        seeds: this.pickedValues
      }).then((result) => {
          this.$emit('simulationdatachange', result.data);
      });
    }
  },
}
</script>

<style>
.simulator-picker .va-card {
    height: auto !important;
}

.simulator-picker .va-card__body {
  height: 650px;
  overflow-y: scroll;
}
</style>
<style lang="scss" scoped>
</style>
