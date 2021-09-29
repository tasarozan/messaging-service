<script>
import { mapActions } from 'vuex'
export default {
  name: 'login',
  data() {
    return {
      username: '',
      password: '',

      backendError: null,
    }
  },
  methods: {
    ...mapActions(['login']),
    async submitLogin(e) {
      e.preventDefault()
      try {
        await this.login({
          username: this.username,
          password: this.password,
        })
        this.$router.push('/profile')
      } catch (e) {
        this.backendError = e.response.data.message
      }
    },
  },
}
</script>

<template lang="pug">
.login
    form(@submit="submitLogin")
      h1 Log in to your account
      label(for="username") Username:&nbsp;
        input(v-model="username" id="username" type="username" placeholder="Your username" required)
      label(for="password") Password:&nbsp;
        input(v-model="password" id="password" type="password" placeholder="Your password" required)
      input(type="submit" value="Log in")
    div(v-if="backendError") {{ backendError }}
    div Don't have an account yet? <router-link to="/register">Register</router-link>
</template>

<style lang="scss" scoped>
label {
  display: block;
  margin: 1rem 0;
}
div {
  margin: 1rem 0;
}
</style>
