import { Hono } from 'hono'
import isEmail from 'validator/es/lib/isEmail'

const app = new Hono()

import { db } from './db'

app.post('/sellers', async (c) => {
  const body = await c.req.json()

  if (!isEmail(body.email)) {
    c.status(422)
    return c.text('Invalid email')
  }

  try {
    await db
      .insertInto('sellers')
      .values({ email: body.email })
      .execute()
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
      const pgError = e as { code?: string }
      if (pgError.code === '23505') {
        c.status(400)
        return c.text('Duplicate email')
      }
    }
    throw e
  }

  return c.text('Seller added successfully')
})

app.post('/products', async (c) => {
  const body = await c.req.json()
  const { created_by, title, price } = body
  await db
    .insertInto('products')
    .values({ created_by, title, price })
    .execute()

  return c.text('Product added successfully')
})

app.post('/clients', async (c) => {
  const body = await c.req.json()

  if (!isEmail(body.email)) {
    c.status(422)
    return c.text('Invalid email')
  }

  try {
    await db
      .insertInto('clients')
      .values({ email: body.email })
      .execute()
  } catch (e: unknown) {
    if (e instanceof Error) {
      console.error(e.message)
      const pgError = e as { code?: string }
      if (pgError.code === '23505') {
        c.status(400)
        return c.text('Duplicate email')
      }
    }
    throw e
  }

  return c.text('Client added successfully')
})

app.post('/orders', async (c) => {
  const body = await c.req.json()
  const { created_by, product } = body
  await db
    .insertInto('orders')
    .values({ created_by, product })
    .execute()

  return c.text('Order added successfully')
})

app.get('/sellers', async (c) => {
  const user = await db
    .selectFrom('sellers')
    .selectAll()
    .execute()
  return c.json(user)
})

app.get('/products', async (c) => {
  const seller = c.req.query('seller')

  let query = db
    .selectFrom('products')
    .selectAll()

  if (seller) {
    query = query.where(
      'created_by',
      '=',
      parseInt(seller)
    )
  }

  const products = await query.execute()
  return c.json(products)
})

app.get('/clients', async (c) => {
  const clients = await db
    .selectFrom('clients')
    .selectAll()
    .execute()
  return c.json(clients)
})

app.get('/orders', async (c) => {
  const client = c.req.query('client')
  const seller = c.req.query('seller')

  let query = db
    .selectFrom('orders')
    .innerJoin(
      'products',
      'products.created_by',
      'orders.product'
    )
    .selectAll('orders')

  if (client) {
    query = query.where(
      'orders.created_by',
      '=',
      parseInt(client)
    )
  }

  if (seller) {
    query = query.where(
      'products.created_by',
      '=',
      parseInt(seller)
    )
  }

  const orders = await query.execute()
  return c.json(orders)
})

app.put('/products/<id>', async (c) => {})
app.put('/sellers/<id>', async (c) => {})
app.put('/clients/<id>', async (c) => {})
app.delete('/orders/<id>', async (c) => {})
app.delete('/clients/<id>', async (c) => {})
app.delete('/sellers/<id>', async (c) => {})
app.delete('/products/<id>', async (c) => {})

export default app
