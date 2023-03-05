-- local currentScore = tonumber(redis.call("ZSCORE", KEYS[1], KEYS[2]))

-- if  not currentScore or tonumber(ARGV[1]) < currentScore then
--     redis.call("ZADD", KEYS[1], ARGV[1], KEYS[2])
-- end




local count = tonumber(redis.call("HGET", KEYS[3], KEYS[2]))
local currentAVG = tonumber(redis.call("ZSCORE", KEYS[1], KEYS[2]))
local newFinishTime = ARGV[1]

if not count then
    count = 0
end

if not currentAVG then
    currentAVG = 0
end




local newAVG = (currentAVG * count + newFinishTime) / (count + 1)

redis.call("ZADD", KEYS[1], newAVG, KEYS[2])

redis.call("HINCRBY", KEYS[3], KEYS[2], 1)
