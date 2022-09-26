const RedisClient = require('redis').RedisClient;
const util = require('util');
const config = require('../../config');

const REDIS_CLIENT_METHODS = [
    "append", "auth", "bgrewriteaof", "bgsave", "bitcount", "bitfield", "bitop", "bitpos", "blpop",
    "brpop", "brpoplpush", "bzpopmin", "bzpopmax", "client", "cluster", "command", "config", "dbsize",
    "debug", "decr", "decrby", "del", "discard", "dump", "echo", "eval", "evalsha",
    "exec", "exists", "expire", "expireat", "flushall", "flushdb", "geoadd", "geohash", "geopos",
    "geodist", "georadius", "georadiusbymember", "get", "getbit", "getrange", "getset", "hdel", "hexists",
    "hget", "hgetall", "hincrby", "hincrbyfloat", "hkeys", "hlen", "hmget", "hmset", "hset",
    "hsetnx", "hstrlen", "hvals", "incr", "incrby", "incrbyfloat", "info", "keys", "lastsave",
    "lindex", "linsert", "llen", "lpop", "lpush", "lpushx", "lrange", "lrem", "lset",
    "ltrim", "memory", "mget", "migrate", "monitor", "move", "mset", "msetnx", "multi",
    "object", "persist", "pexpire", "pexpireat", "pfadd", "pfcount", "pfmerge", "ping", "psetex",
    "psubscribe", "pubsub", "pttl", "publish", "punsubscribe", "quit", "randomkey", "readonly", "readwrite",
    "rename", "renamenx", "restore", "role", "rpop", "rpoplpush", "rpush", "rpushx", "sadd",
    "save", "scard", "script", "sdiff", "sdiffstore", "select", "set", "setbit", "setex",
    "setnx", "setrange", "shutdown", "sinter", "sinterstore", "sismember", "slaveof", "slowlog", "smembers",
    "smove", "sort", "spop", "srandmember", "srem", "strlen", "subscribe", "sunion", "sunionstore",
    "swapdb", "sync", "time", "touch", "ttl", "type", "unsubscribe", "unlink", "unwatch",
    "wait", "watch", "zadd", "zcard", "zcount", "zincrby", "zinterstore", "zlexcount", "zpopmax",
    "zpopmin", "zrange", "zrangebylex", "zrevrangebylex", "zrangebyscore", "zrank", "zrem", "zremrangebylex", "zremrangebyrank",
    "zremrangebyscore", "zrevrange", "zrevrangebyscore", "zrevrank", "zscore", "zunionstore", "scan", "sscan", "hscan",
    "zscan", "xadd", "xrange", "xrevrange", "xlen", "xread", "xreadgroup", "xpending",
];

const REDIS_KEY_METHODS = new Set([
    "append", "bitcount", "bitfield", "bitpos", "blpop", "brpop", "bzpopmin", "bzpopmax", "decr", "decrby", "del", "dump", "exists", 
    "expire", "expireat", "geoadd", "geohash", "geopos", "geodist", "georadius", "georadiusbymember", "get", "getbit", "getrange", 
    "getset", "hdel", "hexists", "hget", "hgetall", "hincrby", "hincrbyfloat", "hkeys", "hlen", "hmget", "hmset", "hset", "hsetnx", 
    "hstrlen", "hvals", "incr", "incrby", "incrbyfloat", "lindex", "linsert", "llen", "lpop", "lpush", "lpushx", "lrange", "lrem", 
    "lset", "ltrim", "mget", "move", "mset", "msetnx", "persist", "pexpire", "pexpireat", "pfadd", "pfcount", "psetex", "pttl", 
    "rename", "renamenx", "restore", "rpop", "rpush", "rpushx", "sadd", "scard", "sdiff", "set", "setbit", "setex", "setnx", "setrange", 
    "sinter", "sismember", "smembers", "sort", "spop", "srandmember", "srem", "strlen", "sunion", "touch", "ttl", "type", "unlink", 
    "watch", "zadd", "zcard", "zcount", "zincrby", "zlexcount", "zpopmax", "zpopmin", "zrange", "zrangebylex", "zrevrangebylex", 
    "zrangebyscore", "zrank", "zrem", "zremrangebylex", "zremrangebyrank", "zremrangebyscore", "zrevrange", "zrevrangebyscore", "zrevrank", 
    "zscore", "sscan", "hscan", "zscan", "xadd", "xtrim", "xdel", "xrange", "xrevrange", "xlen", "xack", "xclaim", "xpending"
]); 

const REDIS_KEYS = 'keys';

var saddAsync;

REDIS_CLIENT_METHODS.forEach(m=> {
    if (typeof RedisClient.prototype[m] !== 'function') {
        return;
    }

    var asyncFn = util.promisify(RedisClient.prototype[m]);
    
    if (config.redis.isStoredKeys && REDIS_KEY_METHODS.has(m)) {
        if (m === 'sadd') {
            saddAsync = asyncFn;
        }

        RedisClient.prototype[m + 'Async'] = async function (...args) {
            var key = args[0];

            await saddAsync.call(this, REDIS_KEYS, key);
            return await asyncFn.apply(this, args);
        };
    } else {
        RedisClient.prototype[m + 'Async'] = function(...args) {
            return asyncFn.apply(this, args);
        };
    }
});
