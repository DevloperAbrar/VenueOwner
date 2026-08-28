const { createClient } = require("redis");

let client = null;

async function getRedisClient() {
  if (!process.env.REDIS_URL) return null; // Redis is optional — everything works without it, just uncached

  if (!client) {
    client = createClient({ url: process.env.REDIS_URL });
    client.on("error", (err) => console.error("[REDIS] Error:", err.message));
    await client.connect();
    console.log("[REDIS] Connected.");
  }
  return client;
}

module.exports = { getRedisClient };