
module.exports = (options = {}) => {
  options = Object.assign(options, {
    proxyMode: false
  })

  return function safeSendMiddleware (req, res, next) {
    res.safeSend = function safeSend (body, cb) {
      if (res.headersSent && typeof cb === 'function') return cb(new Error('express-safe-send: headers were already are sent'), req, res, next)
      if (res.headersSent) return

      res.send(body)

      if (typeof cb === 'function') return cb(null, req, res, next)
    }

    res.safeJsonSend = function safeSend (body, cb) {
      if (res.headersSent && typeof cb === 'function') return cb(new Error('express-safe-send: headers were already are sent'), req, res, next)
      if (res.headersSent) return

      res.json(body)

      if (typeof cb === 'function') return cb(null, req, res, next)
    }

    return next()
  }
}
