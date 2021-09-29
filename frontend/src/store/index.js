import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

Vue.use(Vuex)

const socket = io()

const mutations = {
  SET_USER: 'set user',
  SET_CURRENT_CONVERSATION: 'set current conversation',
  ADD_CONVERSATION: 'add conversation',
  SEND_CONVERSATION_MESSAGES: 'send conversation messages',
}

const store = new Vuex.Store({
  state: {
    user: null,
    currentConversation: null,
    conversations: [],
    conversationMessages: [],
  },
  mutations: {
    [mutations.SET_USER](state, user) {
      state.user = user
    },
    [mutations.SET_CURRENT_CONVERSATION](state, live) {
      state.currentConversation = live
    },
    [mutations.ADD_CONVERSATION](state, convs) {
      state.conversations.push(convs)
    },
    [mutations.SEND_CONVERSATION_MESSAGES](state, convMessages) {
      state.conversationMessages.push(convMessages)
    },
  },
  actions: {
    async fetchSession({ commit }) {
      const user = await axios.get('/api/account/session')
      commit(mutations.SET_USER, user.data || null)
    },
    async login({ commit }, credentials) {
      const user = await axios.post('/api/account/session', credentials)
      commit(mutations.SET_USER, user.data)
    },
    register(store, user) {
      return axios.post('/api/account', user)
    },
    async logout({ commit }) {
      await axios.delete('/api/account/session')
      commit(mutations.SET_USER, null)
    },
    async fetchUser(store, credentials) {
      const userRequest = await axios.get(`/api/users/search/${credentials}`)
      console.log(userRequest)
      return userRequest.data[0]
    },
    // async fetchConversations(store, credentials) {
    //   console.log(credentials)
    //   const conversationRequest = await axios.get(`/api/conversations`)
    //   return conversationRequest.data
    // },
    async block(store, personId) {
      await axios.put(`/api/users/block/${personId}`)
    },
    async unblock(store, personId) {
      await axios.put(`/api/users/unblock/${personId}`)
    },
    async addConversation({ commit }, convs) {
      commit(mutations.ADD_CONVERSATION, convs)
    },
    async sendConversationMessages({ state, commit }, text) {
      const message = {
        text,
        sender: state.user.username,
      }
      commit(mutations.SEND_CONVERSATION_MESSAGES, message)
      socket.emit('new message', state.currentConversation, message)
    },
    async joinConversation({ commit }, conversationId) {
      socket.emit('join conversation', conversationId)
      commit(mutations.SET_CURRENT_CONVERSATION, conversationId)
    },
  },
  modules: {},
})

socket.on('new conversation', user => {
  store.dispatch('addConversation', user)
})

socket.on('new live stream message', message => {
  store.commit(mutations.SEND_CONVERSATION_MESSAGES, message)
})

export default async function init() {
  await store.dispatch('fetchSession')
  return store
}
