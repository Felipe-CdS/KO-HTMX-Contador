import { Hono } from "hono"
import TransactionDetails from "."

const transactionDetailsRoutes = new Hono()

transactionDetailsRoutes.get('/', (c) => {
    return c.html(<TransactionDetails />);
})


export default transactionDetailsRoutes
