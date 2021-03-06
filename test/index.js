/* eslint prefer-promise-reject-errors: 0 */
'use strict'

const Koa = require('koa')
const test = require('ava')
const server = require('./helper/server')
const error = require('..')

test('404', async t => {
	const koa = new Koa()
	koa
		.use(error())
		.use(ctx => {
			ctx.throw(404)
		})

	const app = server(koa)
	const res = await app.get('/')
	const {code, message} = res.body

	t.is(res.status, 404)
	t.is(code, 404)
	t.is(message, 'Not Found')
})

test('500', async t => {
	const koa = new Koa()
	koa
		.use(error())
		.use(ctx => {
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
	koa
		.use(error())
		.use(() => {
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

test.cb('emit', t => {
	(async () => {
		const koa = new Koa()
		koa
			.use(error(true))
			.use(ctx => {
				ctx.throw(401)
			})
			.on('error', error => {
				t.is(error.message, 'Unauthorized')
				t.end()
			})

		const app = server(koa)
		const res = await app.get('/')

		t.is(res.status, 401)
	})()
})

test('throw', async t => {
	const koa = new Koa()
	koa
		.use(error())
		.use(() => {
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
	const next = () => new Promise((resolve, reject) => {
		reject([new Error('foo'), new Error('bar')])
	})
	await error(false)(ctx, next)
	t.is(ctx.body.errors.length, 2)
})
