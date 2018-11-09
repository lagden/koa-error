'use strict'

function _defineProperty(obj, name, value) {
	Object.defineProperty(obj, name, {
		enumerable: true,
		configurable: true,
		value,
		writable: true
	})
}

function errorHandling(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			_defineProperty(error, 'status', error.statusCode || error.status || 500)
			_defineProperty(error, 'message', error.statusMessage || error.message)
			ctx.status = error.status
			ctx.body = {
				errors: [error]
			}

			if (emit) {
				ctx.app.emit('error', error)
			}
		}
	}
}

module.exports = errorHandling
