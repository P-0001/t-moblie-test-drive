import { checkTask, getTask, readProxies } from 'utils/paths'
import { create } from 'utils/logger'
import { tMobile } from './module'

const { log, error, debug } = create('main')

async function main() {
    if (!checkTask()) {
        error('Task file is not complete. Please fill out the task file.')
        process.exit(1)
    }

    const taskData = getTask()

    if (taskData.useProxies && readProxies().length <= 1) {
        error('Proxy list is empty. Please fill out to use proxies.')
        process.exit(1)
    }

    const task = new tMobile(taskData)

    switch (taskData.mode) {
        case 'order':
            await task.main()
            break
        case 'check':
            await task.check()
            break
        default:
            error(`Invalid mode [${taskData.mode}]. Please Use order or check`)
            process.exit(1)
    }

    process.exit(0)
}

main()