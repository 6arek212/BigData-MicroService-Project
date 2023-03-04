local currentScore = tonumber(redis.call("ZSCORE", KEYS[1], KEYS[2]))

if  not currentScore or tonumber(ARGV[1]) < currentScore then
    redis.call("ZADD", KEYS[1], ARGV[1], KEYS[2])
end
