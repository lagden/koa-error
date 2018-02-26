'use strict'

/* istanbul ignore next */
const {NODE_ENV = 'production'} = process.env

function error(...args) {
	const [emit = false] = args
	return async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			/* istanbul ignore next */
			const stack = /dev|test/.test(NODE_ENV) ? err.stack : 'only dev mode'
			/* istanbul ignore next */
			ctx.status = err.status || err.statusCode || 500
			ctx.body = {
				errors: [{
					message: err.message,
					stack
				}]
			}
			if (emit) {
				ctx.app.emit('error', err)
			}
		}
	}
}

module.exports = error
