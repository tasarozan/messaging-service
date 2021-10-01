<script>
import { mapActions, mapState } from 'vuex'
export default {
  name: 'Search',
  data() {
    return {
      username: '',
      person: null,
      message: null,

      backendError: null,
    }
  },
  methods: {
    ...mapActions(['fetchUser', 'block', 'unblock', 'sendConversationMessages']),
    async searchUser() {
      try {
        if (this.user.username == this.username) {
          this.$router.push('/profile')
        } else {
          this.$router.push({
            name: 'Messenger',
            params: {
              data: this.username,
            },
          })
        }
      } catch (e) {
        this.backendError = e.response.data.message
      }
    },
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<template lang="pug">
.search
  form(@submit.prevent="searchUser")
    label(for="username")  &nbsp;
      input(v-model="username" id="username" placeholder="Enter a username" required)
    input(type="submit" value="Search")
  div(v-if="backendError") {{ backendError }}
</template>
<style lang="scss">
.box {
  padding: 2rem;
  border: 1px solid #3339ff;
  background: #8791f3;
  border-radius: 0.3rem;
}
</style>
