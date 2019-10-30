<template>
  <div class="flex xs4 lg3">
    <va-card v-for="" :title="feature">
      <table>
        <tr v-for="row in matrix">
          <td v-for="col in row">
            {{ col }}
          </td>
        </tr>
        <tr>
          <td></td>
          <td></td>
          <td style="padding-top: 10px;">
            <va-badge class="mb-2" color="dark" outline>
              unknowns = {{ unknowns }}
            </va-badge>
          </td>
        </tr>
      </table>

    </va-card>
  </div>
</template>

<script>
export default {
  name: 'ConfusionMatrix',
  props: ['feature', 'matrix', 'unknowns'],
  data() {
    return {

    }
  },
  components: {

  },
  methods: {

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
  }
</style>
