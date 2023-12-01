import { Hono } from 'hono'
import api from './routes'
import { serve } from '@hono/node-server'
import { serveStatic } from '@hono/node-server/serve-static'
import { configDotenv } from 'dotenv'
import { dbSource } from './database'
import "reflect-metadata";
import transactionDetailsRoutes from './Views/Admin/TransactionDetails/routes'

configDotenv();
dbSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization:", err)
    });

const app = new Hono()

app.use('/assets/*', serveStatic({ root: './' }))

app.route('/', api)
app.route('/transaction-details', transactionDetailsRoutes)

serve({
    fetch: app.fetch,
    port: 3001

})
