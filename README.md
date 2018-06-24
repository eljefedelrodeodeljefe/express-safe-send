# express-safe-send [![Build Status](https://travis-ci.org/eljefedelrodeodeljefe/express-safe-send.svg?branch=master)](https://travis-ci.org/eljefedelrodeodeljefe/express-safe-send) [![codecov](https://codecov.io/gh/eljefedelrodeodeljefe/express-safe-send/badge.svg?branch=master)](https://codecov.io/gh/eljefedelrodeodeljefe/express-safe-send?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Do not send on already sent Express headers.

[![NPM](https://nodei.co/npm/express-safe-send.png)](https://nodei.co/npm/express-safe-send/)


## Install

```bash
npm install express-safe-send
```

## The Problem

This solves a problem that arises rarely, but persistently, in production deployments. In `express` route handlers that have defined timeout handling, Node.js timers and timing behaviour can be slighlty undeterministic, because of the nature of Node and libraries that handle timeouts themselves not properly.

Think of a handler that has a `10s` timeout defined in which you make a database call (e.g. to postgres) that itself has a timeout of less than 10 seconds set, because you assign it that safe budget. Node.js event loop delays e.g. through parsing of large incoming data, or time that is not accounted for in your database client, like connection delay, may add to your timeout budget, eventually exceeding it.

When the budget is exceeded your API consumer will already have received headers and assume a timeout. However, your handler might not have knowledge about that fact. A synchronous call (they all are) to `express` send functions, like `res.status(200).json({ users: [] })` will then throw an exception, terminating your server hardly.

This plugin exposes a middleware for just ignoring sending, or extending `express` functions and adding optional callbacks to notify you about it.

## Usage

```js
const safeSend = require('express-safe-send')

const app = express()

app.use(safeSend())
app.use(timeout('10s'))

app.get('/user', function (req, res, next) {
  // make a very long running request, that might time out.
  Users.find({}).toArray(function(err, items) {
    if (err) return next(err)

    // if it (at all) returns the, ignore trying to send the data
    // as Node.js would throw in this process.
    res.status(200).safeJsonSend(items)
  })
})
```

## API

### safeSend([options, callback])

#### options

Type: `Object`

##### proxyMode

Type: `boolean`<br>
Default: `false`

Override behaviour on the `send` and `json` functions via a JS proxy.

#### callback

Type: `Function`

optional callback for global notification

```js
const safeSend = require('express-safe-send')

const app = express()

app.use(safeSend({ proxyMode: false }, (err, req, res, next) => {
  // an error noting the reason why sending was not possible
  console.log(err)
}))

// or

app.use(safeSend((err, req, res, next) => {
  // an error noting the reason why sending was not possible
  console.log(err)
}))
```

## License

MIT © [Robert Jefe Lindstaedt](https://eljefedelrodeodeljefe.com)
