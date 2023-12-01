import { Hono } from 'hono'
import LoginView from './Views/Login/Login'
import { dbSource } from './database'
import { User } from './entities/User'
import BaseHTML from './Views/BaseHTML'

const api = new Hono()

api.get('/', (c) => {
    return c.redirect('/htmx-test')
})

api.get('/htmx-test', async (c: any) => {
    const users = await dbSource.getRepository(User).find()
    const usersHolderHTML = users.map((e) => {
        return (<li>{e.user_id} </li>)
    })

    return c.html(
        <BaseHTML>
            <ul>{usersHolderHTML}</ul>
        </BaseHTML>
    )
})

api.get('/login', async (c: any) => {
    return c.html(<LoginView messages={"aaaa"} />)
})

export default api
