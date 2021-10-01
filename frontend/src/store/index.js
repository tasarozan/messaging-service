import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import io from 'socket.io-client'

Vue.use(Vuex)

const socket = io()

const mutations = {
  SET_USER: 'set user',
  START_CONVERSATION: 'start conversation',
  ADD_CONVERSATION: 'add conversation',
  SEND_MESSAGE_TO_CONVERSATION: 'send message to conversation',
}

const store = new Vuex.Store({
  state: {
    user: null,
    currentLiveConversation: null,
    conversations: [],
    conversationMessages: [],
  },
  mutations: {
    [mutations.SET_USER](state, user) {
      state.user = user
    },
    [mutations.START_CONVERSATION](state, conversationId) {
      state.currentLiveConversation = conversationId
    },
    [mutations.ADD_CONVERSATION](state, conversationId) {
      state.conversations.push(conversationId)
    },
    [mutations.SEND_MESSAGE_TO_CONVERSATION](state, message) {
      state.conversationMessages.push(message)
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
      return userRequest.data[0]
    },
    async block(store, personId) {
      await axios.put(`/api/users/block/${personId}`)
    },
    async unblock(store, personId) {
      await axios.put(`/api/users/unblock/${personId}`)
    },
    async fetchConversationReceiver(store, credentials) {
      const { conversationId, userId } = credentials

      const conversation = await axios.get(`/api/conversations/receiver/${conversationId}`)

      const receiver = conversation.data.members.filter(personId => personId != userId)[0]
      return receiver
    },
    async fetchConversation(store, credentials) {
      const { conversationId } = credentials

      const conversation = await axios.get(`/api/conversations/conversation/${conversationId}`)
      return conversation.data
    },
    async startConversation({ commit }, personId) {
      const conversation = await axios.post(`/api/conversations/${personId}`)

      socket.emit('start conversation', conversation.data._id, () => {
        commit(mutations.START_CONVERSATION, conversation.data._id)
      })
    },
    async addConversation({ commit }, conversationId) {
      commit(mutations.ADD_CONVERSATION, conversationId)
    },
    async sendMessageToConversation({ commit }, body) {
      console.log(body)
      const message = await axios.post('/api/messages', body)

      commit(mutations.SEND_MESSAGE_TO_CONVERSATION, message.data)
      socket.emit('new message', message.data.conversationId, message.data)
    },
    async joinConversation({ commit }, conversationId) {
      socket.emit('join conversation', conversationId)
      commit(mutations.START_CONVERSATION, conversationId)
    },
  },
  modules: {},
})

socket.on('new conversation', conversationId => {
  store.dispatch('addConversation', conversationId)
})

socket.on('new live conversation message', message => {
  store.commit(mutations.SEND_MESSAGE_TO_CONVERSATION, message)
})

export default async function init() {
  await store.dispatch('fetchSession')
  return store
}
