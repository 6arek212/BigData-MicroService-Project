const cron = require('node-cron');


// clear redis every day at 00:00
// cron.schedule('0 0 * * *', async () => {
//     console.log('running a task every minute');
//     await redisClient.flushAll()
// });
