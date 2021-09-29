<script>
import { mapState, mapActions } from 'vuex'

export default {
  name: 'profile',
  components: {},
  data() {
    return {
      conversations: [],
      backendError: null,
    }
  },
  async created() {
    this.conversations = await this.fetchConversations(this.user._id)
  },
  methods: {
    ...mapActions(['fetchSession', 'fetchConversations']),
  },
  computed: {
    ...mapState(['user']),
  },
}
</script>

<template lang="pug">
  .about(v-if="user")
    h2 {{ user.name }}
    h2 Blocked Users
    .blockedUsers
      p(v-if="!user.blockedUsers.length")
        | no blocked users yet
      p(v-else)
        div
          .blockedPerson(v-for="person in user.blockedUsers")
            h3 Name: {{ person.name }}
    .conversations
      div(v-if="conversations.length")
        div(v-for="chat in conversations")
          p
      div(v-else)
        h2 No conversations yet!
</template>

<style lang="scss">
.about {
  padding: 2rem;
  border: 1px solid #3339ff;
  background: #8791f3;
  border-radius: 0.3rem;
}
.blockedUsers {
  padding: 2rem;
  border: 3px solid red;
  border-radius: 0.3rem;
}
</style>
