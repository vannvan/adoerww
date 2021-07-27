import dayjs from 'dayjs'
export default {
  computed: {
    formatTime() {
      return (time) => {
        return dayjs(time).format('YYYY-MM-DD HH:mm:ss')
      }
    }
  }
}
