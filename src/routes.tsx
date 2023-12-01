import { Hono } from 'hono'
import LoginView from './Views/Login/Login'

const api = new Hono()

api.get('/', (c) => {
    return c.redirect('/htmx-test')
})

api.get('/htmx-test', (c: any) => {
    return c.html(<h1>aaa</h1>)
})

api.get('/login', async (c: any) => {
    return c.html(<LoginView messages={"aaaa"}/>)
})

export default api
