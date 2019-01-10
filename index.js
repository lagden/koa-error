'use strict'

function _defineProperty(obj, name, value) {
	Object.defineProperty(obj, name, {
		enumerable: true,
		configurable: true,
		value,
		writable: true
	})
}

function _dpError(error) {
	_defineProperty(error, 'status', error.statusCode || error.status || 500)
	_defineProperty(error, 'message', error.statusMessage || error.message)
}

function _error(_err) {
	const errors = []
	if (Array.isArray(_err)) {
		for (const error of _err) {
			_dpError(error)
			errors.push(error)
		}
	} else {
		_dpError(_err)
		errors.push(_err)
	}
	return errors
}

function errorHandling(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			const errors = _error(error)
			const [{status}] = errors
			ctx.status = status
			ctx.body = {errors}
			if (emit) {
				ctx.app.emit('error', errors)
			}
		}
	}
}

module.exports = errorHandling
