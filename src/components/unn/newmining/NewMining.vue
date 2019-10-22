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
        <va-list fit class="mb-2">
          <va-item v-for="n in 10">
            <va-item-section side>
              <va-checkbox v-model="appBanners" />
            </va-item-section>
            <va-item-section>
              <va-item-label>
                <h1 style="text-transform: capitalize;">feathers</h1>
              </va-item-label>

              <va-item-label caption style="margin-top: 5px;">
                <va-badge class="mb-2" color="dark" outline>true</va-badge>
                <va-badge class="mb-2" color="dark" outline>false</va-badge>
              </va-item-label>
            </va-item-section>
          </va-item>
        </va-list>
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
