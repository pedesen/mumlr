# MUMLR - Multi User Mate Light Remote

Enables multiple users to open a web page and control an LED Matrix called Mate Light

### Content

* `server.js` - Serves the app and creates a websocket server
* `config.js` - Configure host IP, ports, matrix, ...
* `app/` - Files to be served (html, css, js)
* `espruino/mumlr.js` - Code to deploy to a micro controller running Espruino firmware

### Usage

```
yarn
npm run all
```

### License

MIT