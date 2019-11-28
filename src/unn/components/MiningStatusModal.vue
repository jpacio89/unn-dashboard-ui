<template>
    <modal
        name="mining-status-modal"
        :scrollable="true"
        :clickToClose="false"
        @before-open="beforeOpen"
        :width="800"
        :height="600">
        <div class="container">
            <h1>Mining Status</h1>
            <div v-for="feature in Object.keys(status)">
                <div>
                    <span>{{ feature }}:&nbsp;</span>
                    <span>{{ status[feature].statusLabel }}</span>
                    <span>,&nbsp;{{ status[feature].artifactCount }} artifacts.</span>
                    <va-progress-bar
                        v-if="status[feature].statusLabel === 'CACHING'"
                        :value="status[feature].progressPercentage">
                        {{ status[feature].progressPercentage }}%
                    </va-progress-bar>
                </div>
            </div>
        </div>
    </modal>
</template>

<script>
export default {
  name: 'MiningStatusModal',
  props: [],
  data() {
    return {
        status: {}
    }
  },
  components: {

  },
  methods: {
    checkStatus() {
        this.$api.getMiningStatus().then((statusResponse) => {
            this.status = statusResponse.data;
        }).finally(() => {
            setTimeout(this.checkStatus, 1000);
        })
    },
    beforeOpen(event) {
        this.checkStatus();
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
