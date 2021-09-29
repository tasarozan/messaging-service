<script>
import { mapActions } from 'vuex'
export default {
  name: 'register',
  data() {
    return {
      name: '',
      username: '',
      password: '',
      backendError: null,
    }
  },
  methods: {
    ...mapActions(['register']),
    async submitRegister() {
      try {
        await this.register({
          name: this.name,
          username: this.username,
          password: this.password,
        })
        this.$router.push('/login')
      } catch (e) {
        this.backendError = e.response.data.message
      }
    },
  },
}
</script>

<template lang="pug">
.register
    form( @submit.prevent="submitRegister")
      h1 Create a new account
      label(for="name") Name:&nbsp;
        input(v-model="name" id="name" type="text" placeholder="Your name" required)
      label(for="username") Username:&nbsp;
        input(v-model="username" id="username" type="username" placeholder="Your username" required)
      label(for="password") Password:&nbsp;
        input(v-model="password" id="password" type="password" placeholder="Your password" required)
      input(type="submit" value="Register")
    div(v-if="backendError") {{ backendError }}
    div Already have an account? <router-link to="/login">Log in</router-link>
</template>

<style lang="scss" scoped>
label {
  display: block;
  margin: 1rem 0;
}
</style>
