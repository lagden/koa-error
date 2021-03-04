'use strict'

function errorHandling(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			let multiple
			if (Array.isArray(error)) {
				multiple = {errors: error}
			}
			ctx.status = error?.response?.statusCode ?? error?.statusCode ?? error?.status ?? 500
			ctx.statusMessage = error?.response?.statusMessage ?? error?.statusMessage ?? error?.message ?? 'Internal Server Error'
			ctx.body = multiple ?? error?.graphql ?? error?.response?.body ?? error?.body ?? {code: ctx.status, message: ctx.statusMessage}
			if (emit) {
				ctx.app.emit('error', error)
			}
		}
	}
}

module.exports = errorHandling
