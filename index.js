'use strict'

function errorHandling(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			ctx.status = error.status || 500
			ctx.body = {
				errors: [{
					message: error.message
				}]
			}

			if (emit) {
				ctx.app.emit('error', error)
			}
		}
	}
}

module.exports = errorHandling
