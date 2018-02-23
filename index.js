'use strict'

function error(...args) {
	const [emit = false] = args
	return async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			/* istanbul ignore next */
			ctx.status = err.status || err.statusCode || 500
			ctx.body = {
				errors: [{
					message: err.message,
					stack: err.stack
				}]
			}
			if (emit) {
				ctx.app.emit('error', err)
			}
		}
	}
}

module.exports = error
