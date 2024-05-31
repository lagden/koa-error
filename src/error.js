function errorHandling(emit) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			ctx.status = error?.response?.statusCode ?? error?.statusCode ?? error?.status ?? 500
			ctx.statusMessage = error?.response?.statusMessage ?? error?.statusMessage ?? error?.message ?? 'Internal Server Error'
			ctx.statusText = error?.response?.statusText ?? error?.statusText ?? ctx.statusMessage
			// prettier-ignore
			ctx.body = error?.response?.body ?? error?.body ?? {
				code: ctx.status,
				message: ctx.statusMessage,
				status: ctx.status,
				statusMessage: ctx.statusMessage,
				statusText: ctx.statusText,
			}

			if (emit) {
				ctx.app.emit('error', error)
			}
		}
	}
}

export default errorHandling
