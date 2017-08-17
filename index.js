'use strict'

function error(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			/* istanbul ignore next */
			ctx.status = err.status || err.statusCode || 500
			ctx.body = {
				data: null,
				errors: [{
					message: err.message
				}]
			}
			if (emit) {
				ctx.app.emit('error', err)
			}
		}
	}
}

module.exports = error
