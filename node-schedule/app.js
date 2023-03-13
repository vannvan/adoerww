const schedule = require('node-schedule')

const axios = require('axios')

const dayjs = require('dayjs')

// 定义规则
const rule = new schedule.RecurrenceRule()
// rule.date = [1] //每月1号
rule.dayOfWeek = [1, 2, 3, 4, 5] //每周一、周三、周五
rule.hour = [9, 15, 17] // 每天0点和12点开始推送
rule.minute = [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55] // 每隔 5 分钟执行一次
rule.second = 0 //每分钟的0秒执行

const hahaha = () => {
  const hour = dayjs().format('HH')

  let time = '早上'

  if (hour < 11) {
    time = '早上'
  }
  if (11 < hour < 13) {
    time = '中午'
  }
  if (13 < hour < 18) {
    time = '下午'
  }
  if (18 < hour) {
    time = '晚上'
  }
  axios
    .post('https://moguv-test.mogulinker.com/server/ding?type=song', {
      type: 'song',
      noticeContent: time + '好啊！听首歌放松一下吧',
    })
    .then((res) => {
      if (res && res.code == 1) {
        console.log('发送成功')
      }
    })
}

// 启动任务
const job = schedule.scheduleJob(rule, () => {
  console.log(new Date())
  hahaha()
})

console.log('任务已启动')

// job.cancel();
