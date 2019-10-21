<template>
  <div class="dashboard">
    <div class="row row-equal">
      <div class="flex xs12 lg6">
        <va-card title="Load OpenML Dataset">
          <va-input
            v-model="withDescription"
            placeholder="Insert dataset ID" />
        </va-card>
      </div>
      <div class="flex xs12 lg6">
        <va-card title="Features">
          1 <br/>
          2
        </va-card>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'newmining',
  components: {

  },

  methods: {
    launchEpicmaxToast () {
      this.showToast(`Let's work together!`, {
        icon: 'fa-star-o',
        position: 'top-right',
        duration: Infinity,
        action: {
          text: 'Hire us',
          href: 'http://epicmax.co/#/contact',
          class: 'vuestic-toasted-link',
        },
      })
    },
  },
}
</script>

<style lang="scss">
  .row-equal .flex {
    .va-card {
      height: 100%;
    }
  }
  .dashboard {
    .va-card {
      margin-bottom: 0 !important;
    }
  }
</style>
