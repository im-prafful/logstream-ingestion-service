import express from 'express';
const app = express();
import { pushToSQS } from './uploadToSQS.js';
import { fetchData, insertData, handleFailedLogs } from './insertion.js';
app.use(express.json());

//TEST ROUTE 1
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'Hello from Serverless Express (Vendia) ES6 Backend!'
  });
});



//----------------------------------------------------------------------
//     SQS PRODUCER LOOP
//-------------------------------------------------------------------------
let intervalId = null
app.get('/api/startQueueIngestion', (req, res) => {

  if (intervalId) {
    return res.json({ message: "Loop already running!" });//to prevent multiple restarts by hitting the route again and again
  }

  intervalId = setInterval(() => {
    pushToSQS()
  }, 3000)

  res.json({ message: "Loop started, pushing to SQS every 3 seconds" });
})

app.get('/api/stopQueueIngestion', (req, res) => {
  if (!intervalId) {
    return res.json({ message: "No loop running!" });
  }

  if (intervalId) {
    clearInterval(intervalId)
  }

  intervalId = null;
  res.json({ message: "Loop stopped" });
})


//--------------------------------------------------------------------------
//SQS → DB INSERT LOOP
//--------------------------------------------------------------------------

let insertLoopRunning = false

app.get('/api/insertLoop', async (req, res) => {

  if (insertLoopRunning) {
    return res.json({ message: "Insert pipeline already running" });//to prevent multiple restarts by hitting the route again and again
  }

  // Send the HTTP response immediately BEFORE starting the infinite loop
  // If we don't send the response first, Express will keep the request open forever,
  // causing the browser to load indefinitely and blocking other incoming requests.
  res.json({ message: "Insert pipeline started" });

  //run loop in background
  insertLoopRunning = true
  while (insertLoopRunning) {
    try {
      await fetchData();
      await insertData();
      await handleFailedLogs();

      console.log("Cycle done. Waiting 10s...");
      await new Promise((res) => setTimeout(res, 10000));
    } catch (err) {
      console.error("ERROR:", err.message);
      await new Promise((res) => setTimeout(res, 5000));
    }
  }
})

app.get("/api/stopInsertLoop", (req, res) => {
  insertLoopRunning = false;
  res.json({ message: "Insert pipeline stopped" });
});


app.listen(3546,(req,res)=>{
  res.send(`server listening on 3456`)
})
// IMPORTANT: Export the Express app instance
//export default app;

