<template>
  <div>
    <h1>{{ message }}</h1>
    {{ currentTabId }}
    <button @click="handleClick()">使用back的方法</button>
  </div>
</template>

<script>
import { getURL } from '@/lib/chrome-client.js'
// 获取当前选项卡ID
function getCurrentTabId(callback) {
  chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
    if (callback) callback(tabs.length ? tabs[0].id : null)
  })
}
// 向content-script主动发送消息
function sendMessageToContentScript(message, callback) {
  getCurrentTabId((tabId) => {
    chrome.tabs.sendMessage(tabId, message, function(response) {
      if (callback) callback(response)
    })
  })
}
export default {
  name: 'w-button',
  data() {
    return {
      message: '来自Vue.js的Hello Worlds',
      currentTabId: null,
    }
  },
  mounted() {
    // console.log(getURL('index.html'))
    // window.open(getURL('home.html'), '_black')
  },
  methods: {
    handleClick() {},
  },
}
</script>

<style></style>
