<template>
    <modal
        name="mining-status-modal"
        :scrollable="true"
        :clickToClose="false"
        @before-open="beforeOpen"
        @before-close="beforeClose"
        :width="800"
        :height="600">
        <div class="container">
            <va-card title="Mining Status" class="mb-2">
                <table class="va-table va-table--striped va-table--hoverable">
                  <thead>
                    <tr>
                      <th>Feature</th>
                      <th>Status</th>
                      <th>Info</th>
                      <th>Progress</th>
                    </tr>
                  </thead>

                  <tbody>
                    <tr v-for="feature in Object.keys(status)" v-bind:key="feature">
                      <td>{{ feature }}</td>
                      <td>{{ status[feature].statusLabel }}</td>
                      <td>{{ status[feature].artifactCount }} artifacts</td>
                      <td>
                          <va-progress-bar
                              v-if="status[feature].statusLabel !== 'IDLE'"
                              :value="status[feature].progressPercentage">
                              {{ status[feature].progressPercentage.toFixed(2) }}%
                          </va-progress-bar>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="controls">
                    <va-button color="success" @click="close" v-if="isDone()">Check Results</va-button>
                </div>
            </va-card>
        </div>
    </modal>
</template>

<script>
export default {
  name: 'MiningStatusModal',
  props: [],
  data() {
    return {
        status: {},
        timerHandler: null,
    }
  },
  components: {

  },
  methods: {
    checkStatus() {
        this.$api.getMiningStatus().then((statusResponse) => {
            this.status = statusResponse.data;
        }).finally(() => {
            if (this.isDone()) {
                return;
            }
            this.timerHandler = setTimeout(this.checkStatus, 50);
        })
    },
    beforeOpen(event) {
        this.checkStatus();
    },
    beforeClose() {
        this.timerHandler && clearTimeout(this.timerHandler);
        this.$emit('miningdone');
    },
    close() {
        this.timerHandler && clearTimeout(this.timerHandler);
        this.$modal.hide('mining-status-modal');
    },
    isDone() {
        return Object.keys(this.status)
                .filter(feature => this.status[feature].statusLabel !== 'DONE')
                .length === 0 && Object.keys(this.status).length > 0;
    }
  },
}
</script>

<style lang="scss" scoped>
.container {
    box-sizing: border-box;
    width: 100%;
    height: 100%;

    table {
        width: 100%;
        height: 100%;
    }

    .controls {
        padding: 30px;
        text-align: center;
    }
}
</style>
