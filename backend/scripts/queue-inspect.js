import dotenv from 'dotenv';
dotenv.config();
import Queue from 'bull';

const redisUrl = process.env.REDIS_URL || 'redis://127.0.0.1:6379';
const q = new Queue('emails', redisUrl);

(async function inspect() {
  try {
    const counts = await q.getJobCounts();
    console.log('job counts:', counts);

    const waiting = await q.getWaiting();
    console.log('waiting jobs:', waiting.map(j => ({ id: j.id, data: j.data })));

    const active = await q.getActive();
    console.log('active jobs:', active.map(j => ({ id: j.id, data: j.data })));

    const completed = await q.getCompleted();
    console.log('completed jobs (ids):', completed.slice(0, 10).map(j => j.id));

    const failed = await q.getFailed();
    console.log('failed jobs (ids):', failed.slice(0, 10).map(j => j.id));

    await q.close();
    process.exit(0);
  } catch (err) {
    console.error('inspect failed', err && err.message ? err.message : err);
    try { await q.close(); } catch(e){}
    process.exit(1);
  }
})();
