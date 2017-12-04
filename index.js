'use strict'

function error(options = {emit: false}) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (err) {
			/* istanbul ignore next */
			ctx.status = err.status || err.statusCode || 500
			ctx.body = {
				errors: [{
					message: err.message
				}]
			}
			if (options.emit) {
				ctx.app.emit('error', err)
			}
		}
	}
}

module.exports = error
