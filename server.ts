import express from "express";
import { createClient } from 'redis';


const path = require('path');

const app = express();


app.use(express.urlencoded({
    extended: true
  }))


const PORT = process.env.PORT || 4000;
const REDIS_URL = process.env.REDIS_URL || ""


app.listen(PORT, () => console.log(`Server is running here  http://0.0.0.0:${PORT}`));
const client = createClient({
    url: "redis://redis"
});
(async () => {
    
  
    client.on('error', (err) => console.log('Redis Client Error', err));
  
    await client.connect();
  
    await client.set('key', 'value');
    
  })();

app.get("/", (req, res) =>  res.sendFile(path.join('/usr/src/app', 'public','index.html')));
app.post('/api', async (req, res) => {
    console.log(req.body);
    const date = new Date()
    const timestamp = date.getTime()
    const info = {"name" : req.body.name, "book": req.body.booklisttitle, "date": date}
    console.log(info)
    const result = await client.ZADD('bookorder', {score: timestamp, value: JSON.stringify(info)})
    res.redirect('/')
  })
app.get('/admin', async (req, res)=> {
    const data = await client.ZRANGE('bookorder', 0 ,-1);
 
    const other  = JSON.stringify(data).replace(/\\"/g, '')
   
    const nice_data = JSON.stringify(JSON.parse(JSON.stringify(data).replace(/\\"/g, '')), null, 4)
    console.log("pos 0 " + nice_data[0])
    return res.json(nice_data)
})
