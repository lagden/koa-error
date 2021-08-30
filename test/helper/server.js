import request from 'supertest'
import toPort from 'hash-to-port'
import hexId from '@tadashi/hex-id'

function server(koa) {
	return request.agent(koa.listen(toPort(hexId())))
}

export default server
