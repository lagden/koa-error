'use strict'

function _flat(arr) {
	if (!Array.prototype.flat) {
		return [].concat(...arr)
	}
	return arr.flat()
}

function _prop(obj, name, value) {
	Object.defineProperty(obj, name, {
		enumerable: true,
		configurable: true,
		value,
		writable: true
	})
}

function _props(error) {
	_prop(error, 'status', error.statusCode || error.status || 500)
	_prop(error, 'message', error.statusMessage || error.message || 'Internal Server Error')
}

function _collection(...args) {
	const errors = new Set()
	for (const error of _flat(args)) {
		_props(error)
		errors.add(error)
	}
	return [...errors]
}

function errorHandling(emit = false) {
	return async (ctx, next) => {
		try {
			await next()
		} catch (error) {
			const errors = _collection(error)
			const [{status}] = errors
			ctx.status = status
			ctx.body = {
				errors
			}
			if (emit) {
				ctx.app.emit('error', errors)
			}
		}
	}
}

module.exports = errorHandling
