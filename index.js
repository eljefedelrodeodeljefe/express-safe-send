
module.exports = (options = {}) => {
  options = Object.assign(options, {
    proxyMode: false
  })

  return function safeSendMiddleware (req, res, next) {
    res.safeSend = function safeSend (body) {
      if (res.headersSent) return
      return res.send(body)
    }

    res.safeJsonSend = function safeSend (body) {
      if (res.headersSent) return

      return res.json(body)
    }

    return next()
  }
}
