<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Messenger',
  props: ['data'],
  data() {
    return {
      person: null,
      message: null,

      backendError: null,
    }
  },
  async created() {
    this.person = await this.fetchUser(this.$route.params.data)
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
  .blockBtn(v-if="user")
    div(v-if="user._id != person._id")
      div(v-if="!user.blockedUsers.some(element => element._id == person._id)")
        button.btn.btn-primary(@click="blockUser(person._id)" type='submit') Block {{person.name}}
      div(v-else)
        button.btn.btn-primary(@click="unblockUser(person._id)" type='submit') Unblock {{person.name}}
  .messages
        .message(v-for="message in conversationMessages")
          p
            span {{ message.sender }}:&nbsp;
            span {{ message.text }}
  form(@submit="sendMessage")
        input(type="text" v-model="message")
        input(type="submit" value="Send message")
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
