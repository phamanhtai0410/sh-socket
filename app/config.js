require('dotenv').config()
console.log(JSON.parse(process.env.REDIS_CLUSTER))
const config = {
    redis: {
        pubsub: JSON.parse(process.env.REDIS_CLUSTER)
    },
    socketio: {
        pingInterval: 60000
    }
}

module.exports = config;
