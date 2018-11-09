'use strict'

class CustomError extends Error {
	constructor(message, {statusCode, statusMessage}) {
		super(message)
		this.name = 'CustomError'
		this.statusCode = statusCode
		this.statusMessage = statusMessage || message
	}
}

module.exports = CustomError
