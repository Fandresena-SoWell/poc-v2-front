import { boot } from 'quasar/wrappers'
import { IntervalBasedCronScheduler, parseCronExpression } from 'cron-schedule'
import { Spraypaint } from './spraypaint'

const cron = parseCronExpression('* * * * * *')
const tasksScheduler = new IntervalBasedCronScheduler(5 * 1000)

export default boot(({}) => {
  tasksScheduler.registerTask(
    cron,
    async () => {
      console.log('--------- CRON tick', new Date())
      await Spraypaint.processTasksQueue()
    },
    {
      isOneTimeTask: false,
      errorHandler: (err) => {
        console.log('err registering tasksScheduler')
      },
    }
  )
  console.log('tasksScheduler registered')
})

export { tasksScheduler }
