'use strict'

const request = require('supertest')
const toPort = require('hash-to-port')
const hexId = require('@tadashi/hex-id')

function server(koa) {
	return request.agent(koa.listen(toPort(hexId())))
}

module.exports = server
