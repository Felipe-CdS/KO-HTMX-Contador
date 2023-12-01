import { Hono } from 'hono'
// import { MessagesDatabase } from './db'
import api from './routes'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'

//export const db = new MessagesDatabase()

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './' }))

//app.get('/', (c) => c.text("aaaa"))
app.route('/', api)
// app.route('/single-chat', singleChatRoutes)

serve({
    fetch: app.fetch,
    port: 3001

})
