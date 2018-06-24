# express-safe-send [![Build Status](https://travis-ci.org/eljefedelrodeodeljefe/express-safe-send.svg?branch=master)](https://travis-ci.org/eljefedelrodeodeljefe/express-safe-send) [![codecov](https://codecov.io/gh/eljefedelrodeodeljefe/express-safe-send/badge.svg?branch=master)](https://codecov.io/gh/eljefedelrodeodeljefe/express-safe-send?branch=master) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

> Do not send on already sent Express headers.

[![NPM](https://nodei.co/npm/express-safe-send.png)](https://nodei.co/npm/express-safe-send/)


## Install

```bash
npm install express-safe-send
```

## Usage

```js
const safeSend = require('express-safe-send');

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

### safeSend([options])

#### options

Type: `Object`

##### proxyMode

Type: `boolean`<br>
Default: `false`

Override behaviour on the `send` and `json` functions via a JS proxy.

## License

MIT © [Robert Jefe Lindstaedt](https://eljefedelrodeodeljefe.com)
