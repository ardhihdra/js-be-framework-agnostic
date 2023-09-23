const { createClient } = require('redis');
const { promisify } = require('util');


class RedisCache {
  client;
  expires;

  constructor(host, db, expires) {
    try {
      this.client = createClient({ url: `redis://alice:foobared@${host}:6380` });
      this.expires = expires;
      this.client.connect().catch(err => {
        console.error("Failed to connect to redis")
      })
    } catch (err) {
      console.error("Failed to setup to redis")
    }
  }

  async set(key, value) {
    try {
      if (!this.client.isOpen) throw 'Redis not connected'
      const setAsync = promisify(this.client.set).bind(this.client);
      return setAsync(key, JSON.stringify(value), 'EX', this.expires)
    } catch (err) {
      console.error("REDIS ERR", err)
      return
    }
  }

  async get(key) {
    try {
      if (!this.client.isOpen) throw 'Redis not connected'
      const getAsync = promisify(this.client.get).bind(this.client);
      const value = await getAsync(key)
      if (!value) return null;
      return JSON.parse(value);
    } catch (err) {
      console.error("REDIS ERR", err)
      return
    }
  }
}

module.exports = {
  RedisCache
}