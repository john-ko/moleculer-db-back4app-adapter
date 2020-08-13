# moleculer-db-back4app-adapater

using back4app parse server as a db so no real need for a real database.

## usage
```js
const DbService = require('moleculer-db')
const Back4AppAdapter = require('moleculer-db-back4app-adapter')

const options: {
  headers = {
    'X-Parse-Application-Id': 'key1',
    'X-Parse-REST-API-Key': 'key2',
    'X-Parse-Master-Key': 'key3'
  }
}

module.exports = {
	name: "ServiceName",
	mixins: [DbService],
  adapter: new Back4AppAdapter('https://parseapi.back4app.com', options, 'users'),
}
```

### constructor options
1. base url
2. header options
3. class name
