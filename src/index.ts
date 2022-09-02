import { BASE_URL, token } from './config.js'
import { Octokit } from '@octokit/core'
import axios from 'axios'

interface IFollowerUser {
    login: string
    id: number
}

interface ILogger {
    message: string
    type: 'info' | 'error'
}

const block = async (method: string, user: IFollowerUser) =>
    await new Octokit({ auth: token })
        .request(`${method} /user/blocks/${user?.login}`)
        .catch((err) => log({ message: `(${method}) ${err}`, type: 'error' }))

const log = (d: ILogger) => console.log(`[${d.type}]: ${d.message}`)

;(async () =>
    await axios
        .get<Partial<Array<IFollowerUser>>>(BASE_URL)
        .then((res: { [key: string]: any }) =>
            res.data.forEach(async (user: IFollowerUser) => {
                await block('PUT', user!)
                await block('DELETE', user!)

                log({ message: `OK (${user?.login})`, type: 'info' })
            })
        )
        .catch((err: any) => log({ message: `${err}`, type: 'error' })))()
