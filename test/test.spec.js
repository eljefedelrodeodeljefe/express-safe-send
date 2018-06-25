const test = require('tape')
const request = require('supertest')
const express = require('express')
const timeout = require('connect-timeout')
const sinon = require('sinon')

test('safe-json: will ignore sending when headers are aldready sent', t => {
  const app = express()

  app.use(require('../')())
  app.use(timeout('10ms'))

  app.get('/user', function (req, res) {
    setTimeout(() => {
      t.doesNotThrow(() => {
        res.status(200).safeJsonSend({ name: 'john' })
      })
    }, 100)
  })

  request(app)
    .get('/user')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(503)
    .end(function (err, res) {
      t.error(err)

      t.end()
    })
})

test('safe-send: will ignore sending when headers are aldready sent', t => {
  const app = express()

  app.use(require('../')())
  app.use(timeout('10ms'))

  app.get('/user', function (req, res) {
    setTimeout(() => {
      t.doesNotThrow(() => {
        res.safeSend({ name: 'john' })
      })
    }, 100)
  })

  request(app)
    .get('/user')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(503)
    .end(function (err, res) {
      t.error(err)

      t.end()
    })
})

test('safe-json: will ignore sending when headers are aldready sent and will send callback with', t => {
  const app = express()

  const callback = sinon.spy()

  app.use(require('../')())
  app.use(timeout('10ms'))

  app.get('/user', function (req, res) {
    setTimeout(() => {
      t.doesNotThrow(() => {
        res.status(200).safeJsonSend({ name: 'john' }, callback)

        t.ok(callback.calledOnce)
      })
    }, 100)
  })

  request(app)
    .get('/user')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(503)
    .end(function (err, res) {
      t.error(err)

      t.end()
    })
})

test('safe-send: will ignore sending when headers are aldready sent and will send callback', t => {
  const app = express()

  const callback = sinon.spy()

  app.use(require('../')())
  app.use(timeout('10ms'))

  app.get('/user', function (req, res) {
    setTimeout(() => {
      t.doesNotThrow(() => {
        res.safeSend({ name: 'john' }, callback)

        t.ok(callback.calledOnce)
      })
    }, 100)
  })

  request(app)
    .get('/user')
    .expect('Content-Type', 'text/html; charset=utf-8')
    .expect(503)
    .end(function (err, res) {
      t.error(err)

      t.end()
    })
})
