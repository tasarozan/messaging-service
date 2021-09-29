<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'UserDetail',
  data() {
    return {
      person: null,
      message: null,

      backendError: null,
    }
  },
  async created() {
    this.person = await this.fetchUser(this.$route.params.username)
  },
  methods: {
    ...mapActions(['fetchUser', 'block', 'unblock', 'sendConversationMessages']),
    async blockUser(personId) {
      try {
        await this.block(personId)
      } catch (e) {
        this.backendError = e.response.data.message
      }
    },
    async unblockUser(personId) {
      try {
        await this.unblock(personId)
      } catch (e) {
        this.backendError = e.response.data.message
      }
    },
    sendMessage(e) {
      e.preventDefault()
      this.sendConversationMessages(this.message)
      this.message = ''
    },
  },
  computed: {
    ...mapState(['user', 'conversationMessages']),
  },
}
</script>

<template lang="pug">
.box(v-if="person")
  h2 {{ person.name }}
.box(v-else)
  h2 User not found
</template>
<style lang="scss">
.box {
  padding: 2rem;
  border: 1px solid #3339ff;
  background: #8791f3;
  border-radius: 0.3rem;
}
</style>
