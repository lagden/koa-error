'use strict'

function error(...args) {
	const [emit = false] = args
	return async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			const stack = /development|dev|test/.test(process.env.NODE_ENV) ? err.stack : 'only for development or test environments'
			ctx.status = err.status || 500
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
