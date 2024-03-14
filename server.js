// use this file to run the server in https mode for local development only, you will need to create a self signed certificate and key using mkcert
// used for local development only, do not use in production
// setup only if you need to test or develop the instagram login functionality
const { createServer } = require('https')
const { parse } = require('url')
const next = require('next')
const fs = require('fs')
const port = 3000
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()

const httpsOptions = {
  key: fs.readFileSync('./localhost-key.pem'),
  cert: fs.readFileSync('./localhost.pem')
}

app.prepare().then(() => {
  createServer(httpsOptions, async (req, res) => {
    const parsedUrl = parse(req.url, true)
    await handle(req, res, parsedUrl)
  }).listen(port, (err) => {
    if (err) throw err
    console.log('ready - started server on url: https://localhost:' + port)
  })
})
