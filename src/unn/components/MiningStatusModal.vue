<template>
    <modal
        name="mining-status-modal"
        :scrollable="false"
        :clickToClose="false"
        @before-open="beforeOpen"
        :width="800"
        :height="600">
        <h2>Mining Status</h2>
        <div v-for="feature in Object.keys(status)">
            <div>
                <span>{{ feature }}:&nbsp;</span>
                <span>{{ status[feature].statusLabel }}</span>
                <span>,&nbsp;{{ status[feature].artifactCount }} artifacts.</span>
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

</style>
