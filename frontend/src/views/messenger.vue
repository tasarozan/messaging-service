<script>
import { mapActions, mapState } from 'vuex'

export default {
  name: 'Messenger',
  props: ['data'],
  data() {
    return {
      person: null,
      message: '',
      receiver: '',

      backendError: null,
    }
  },
  async created() {
    this.person = await this.fetchUser(this.$route.params.data)
  },
  methods: {
    ...mapActions([
      'fetchUser',
      'block',
      'unblock',
      'startConversation',
      'sendMessageToConversation',
      'joinConversation',
      'fetchConversationReceiver',
    ]),
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
    async sendMessage(e) {
      e.preventDefault()
      try {
        await this.sendMessageToConversation({
          text: this.message,
          receiverId: this.receiver,
          conversationId: this.currentLiveConversation,
        })
        this.message = ''
      } catch (err) {
        this.backendError = e.response.data.message
      }
    },
  },
  computed: {
    ...mapState(['user', 'conversationMessages', 'conversations', 'currentLiveConversation']),
  },
}
</script>

<template lang="pug">
.container
  .box(v-if="person")
    h2 {{ person.name }}
    .blockBtn(v-if="user")
      div(v-if="user._id != person._id")
        div(v-if="!user.blockedUsers.some(element => element._id == person._id)")
          button.btn.btn-primary(@click="blockUser(person._id)" type='submit') Block {{person.name}}
        div(v-else)
          button.btn.btn-primary(@click="unblockUser(person._id)" type='submit') Unblock {{person.name}}
    button.btn.btn-primary(@click="startConversation(person._id)" type='submit') Start Conversation

  .box(v-else)
    h2 User not found
  .conversations
    div(v-if="conversations.length")
      h2 Conversations
      div(v-for="conversation in conversations")
        p {{conversation}}
        button.btn.btn-primary(@click="joinConversation(conversation)" type='submit') Join Conversation
    div(v-else)
      h2 No conversations yet
  div(v-if="currentLiveConversation")
    h3 Conversation Started
    .messages
      .message(v-for="message in conversationMessages")
        p
          span {{ message.sender }}:&nbsp;
          span {{message.text}}
    form(@submit="sendMessage")
      input(type="text" v-model="message")
      input(type="submit" value="Send message")
</template>
<style lang="scss">
.box {
  padding: 2rem;
  border: 1px solid #3339ff;
  background: #8791f3;
  border-radius: 0.3rem;
}
</style>
