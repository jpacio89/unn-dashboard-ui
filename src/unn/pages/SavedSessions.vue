<template>
    <div class="dashboard">
        <div style="display: block; width: 100%;">
            <div class="row row-equal">
                <div class="flex xs12 session-list">
                    <va-card title="Saved Sessions">
                        <table class="va-table va-table--striped va-table--hoverable">
                          <thead>
                            <tr>
                              <th>Session</th>
                              <th>Action</th>
                            </tr>
                          </thead>

                          <tbody>
                            <tr v-for="session in savedSessions" v-bind:key="session">
                              <td>{{ session }}</td>
                              <td style="vertical-align: top; width: 100px;">
                                <va-button flat small color="gray" icon="fa fa-download" @click="loadSession(session)" />
                                <!--<va-button flat small color="gray" icon="fa fa-trash" @click="remove(feature)" />-->
                              </td>
                            </tr>
                          </tbody>
                        </table>
                    </va-card>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
  name: 'savedsessions',
  data() {
    return {
      savedSessions: [],
    }
  },
  components: {},
  mounted() {
    this.$api.listSavedSessions().then((result) => {
      this.savedSessions = result.data;
    });
  },
  methods: {
      loadSession(session) {
          this.$api.loadSession(session).then((result) => {
            alert('Session loaded.');
          });
      }
  },
}
</script>

<style lang="scss" scoped>
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
  table {
    width: 100%;
  }
</style>
