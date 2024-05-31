import Koa from 'koa'
import test from 'ava'
import server from './helper/server.js'
import error from '../src/error.js'

test('200', async t => {
	const koa = new Koa()
	koa.use(error()).use(ctx => {
		ctx.body = {ok: true}
	})

	const app = server(koa)
	const res = await app.get('/')

	t.is(res.status, 200)
	t.snapshot(res.body)
})

test('404', async t => {
	const koa = new Koa()
	koa.use(error()).use(ctx => {
		ctx.throw(404)
	})

	const app = server(koa)
	const res = await app.get('/')

	t.is(res.status, 404)
	t.snapshot(res.body)
})

test('500', async t => {
	const koa = new Koa()
	koa.use(error()).use(ctx => {
		ctx.throw(500, 'Boom!')
	})

	const app = server(koa)
	const res = await app.get('/')
	const {code, message} = res.body

	t.is(res.status, 500)
	t.is(code, 500)
	t.is(message, 'Boom!')
})

test('custom error', async t => {
	const koa = new Koa()
	koa.use(error()).use(() => {
		const error = new Error('xiiii')
		error.statusCode = 422
		error.statusMessage = 'custom error'
		error.expose = true
		throw error
	})

	const app = server(koa)
	const res = await app.get('/')
	const {code, message} = res.body

	t.is(res.status, 422)
	t.is(code, 422)
	t.is(message, 'custom error')
})

test('emit', async t => {
	const koa = new Koa()
	koa.use(error(true)).use(ctx => {
		ctx.throw(401)
	})

	const app = server(koa)
	const res = await app.get('/')

	t.is(res.status, 401)
})

test('throw', async t => {
	const koa = new Koa()
	koa.use(error()).use(() => {
		throw new Error('Something is wrong')
	})

	const app = server(koa)
	const res = await app.get('/')
	const {code, message} = res.body

	t.is(res.status, 500)
	t.is(code, 500)
	t.is(message, 'Something is wrong')
})

test('collection', async t => {
	const ctx = {}
	const next = () =>
		new Promise((resolve, reject) => {
			reject([new Error('foo'), new Error('bar')])
		})
	await error(false)(ctx, next)
	t.snapshot(ctx.status)
	t.snapshot(ctx.statusText)
	t.snapshot(ctx.body)
})

test('more data', async t => {
	const koa = new Koa()
	koa.use(error(true)).use(ctx => {
		ctx.throw(400, undefined, {
			body: {
				code: 400,
				message: 'Bad!!',
				id: 123,
			},
		})
	})

	const app = server(koa)
	const res = await app.get('/')

	t.is(res.status, 400)
	t.snapshot(res.body)
})

test('response', async t => {
	const koa = new Koa()
	koa.use(error()).use(() => {
		const error = new Error('xiiii')
		error.response = {
			statusCode: 422,
			statusMessage: 'custom error',
			body: {
				fail: true,
			},
		}
		error.expose = true
		throw error
	})

	const app = server(koa)
	const res = await app.get('/')

	t.is(res.status, 422)
	t.snapshot(res.body)
})
