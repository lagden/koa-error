# koa-error

[![NPM version][npm-img]][npm]
[![Build Status][ci-img]][ci]
[![Coverage Status][coveralls-img]][coveralls]

[![XO code style][xo-img]][xo]


[npm-img]:         https://img.shields.io/npm/v/@tadashi/koa-error.svg
[npm]:             https://www.npmjs.com/package/@tadashi/koa-error
[ci-img]:          https://travis-ci.org/lagden/koa-error.svg
[ci]:              https://travis-ci.org/lagden/koa-error
[coveralls-img]:   https://coveralls.io/repos/github/lagden/koa-error/badge.svg?branch=master
[coveralls]:       https://coveralls.io/github/lagden/koa-error?branch=master

[xo-img]:          https://img.shields.io/badge/code_style-XO-5ed9c7.svg
[xo]:              https://github.com/sindresorhus/xo


A [Koa](https://github.com/koajs/koa) `error handler` middleware

## Install

```
$ npm i -S @tadashi/koa-error
```


## Usage

```js
const Koa = require('koa')
const error = require('@tadashi/koa-error')

const koa = new Koa()
koa
	.use(error(true))
	.use(ctx => {
		ctx.throw(401)
	})
	.on('error', [err] => {
		console.log(err.message) // Unauthorized
	})
```


## API

#### error(emit)

parameter   | type                 | required    | default             | description
----------- | -------------------- | ----------- | ------------------- | ------------
emit        | boolean              | no          | false               | Emit error event


## License

MIT © [Thiago Lagden](https://github.com/lagden)
