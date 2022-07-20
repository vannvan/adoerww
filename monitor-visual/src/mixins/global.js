import dayjs from 'dayjs'
export default {
  computed: {
    formatTime() {
      return (time) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  },

  methods: {
    successAlert(message) {
      this.$Message.success(message)
    },

    errorAlert(message) {
      this.$Message.error(message)
    }
  }
}
