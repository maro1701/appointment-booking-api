import 'dotenv/config';
import app from './app.js';
import './modules/workers/reminder.worker.js';
const PORT = process.env.PORT;

app.listen(PORT,()=>{
   console.log(`The server is running on ${PORT}`);
})