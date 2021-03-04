'use strict'

const request = require('supertest')
const toPort = require('hash-to-port')

function server(koa) {
	const hash = (Number(String(Math.random()).split('.')[1]) + Date.now()).toString(26)
	return request.agent(koa.listen(toPort(hash)))
}

module.exports = server
