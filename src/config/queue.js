import {Queue} from 'bullmq';
import {redisConnection} from './redis.js';

export const reminderQueue = new Queue('reminders',{
   connection:redisConnection
})