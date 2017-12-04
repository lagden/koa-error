'use strict'

import test from 'ava'
import Koa from 'koa'
import error from '../.'
import server from './helpers/server'

test('404', async t => {
	const koa = new Koa()
	koa
		.use(error())
		.use(async ctx => {
			ctx.throw(404)
		})

	const app = server(koa)
	const res = await app.get('/')
	const {errors: [{message}]} = res.body

	t.is(res.status, 404)
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
	const {errors: [{message}]} = res.body

	t.is(res.status, 500)
	t.is(message, 'Boom!')
})

test.cb('emit', t => {
	(async () => {
		const koa = new Koa()
		koa
			.use(error({emit: true}))
			.use(ctx => {
				ctx.throw(401)
			})
			.on('error', err => {
				t.is(err.message, 'Unauthorized')
				t.end()
			})

		const app = server(koa)
		const res = await app.get('/')

		t.is(res.status, 401)
	})()
})
