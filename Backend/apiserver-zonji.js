const ZongJi = require('zongji');
const mysql = require('mysql');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/status', (request, response) => response.json({ clients: clients.length }));
const port = 3000
let clients = [];
let queries = [];

const connection = mysql.createConnection({
    host: 'staging-prod-db.crhg7zleeuhf.ap-south-1.rds.amazonaws.com',
    user: 'hakate',
    password: '}*w;caq[&Na75HtbamFKbc+[zU&ns8H-'
});

const zongji = new ZongJi({
    host: 'staging-prod-db.crhg7zleeuhf.ap-south-1.rds.amazonaws.com',
    user: 'hakate',
    password: '}*w;caq[&Na75HtbamFKbc+[zU&ns8H-'
});

zongji.on('binlog', async function(evt) {

    if (evt.query != 'BEGIN') {

        //     query = evt.query

        //     query = query.replace(/`tuadmin`/g, '`demo`');

        //     connection.query(query, function(error, results, fields) {

        //     });

       
        console.log(evt);
       await sendEventsToAll(evt.query);
    }
});

zongji.start({
  includeEvents: ['query']
});

process.on('SIGINT', function() {
  console.log('Got SIGINT.');
  zongji.stop();
  process.exit();
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})
  
//this is for client addition
function eventsHandler(request, response, next) {
    const headers = {
      'Content-Type': 'text/event-stream',
      'Connection': 'keep-alive',
      'Cache-Control': 'no-cache'
    };
    response.writeHead(200, headers);
  
    const data = `data: ${JSON.stringify(queries)}\n\n`;
  
    response.write(data);
  
    const clientId = Date.now();
  
    const newClient = {
      id: clientId,
      response
    };
  
    clients.push(newClient);
  
    request.on('close', () => {
      console.log(`${clientId} Connection closed`);
      clients = clients.filter(client => client.id !== clientId);
    });
  }
  
app.get('/events', eventsHandler);
  
function sendEventsToAll(newQueries) {
    clients.forEach(client => client.response.write(`data: ${JSON.stringify(newQueries)}\n\n`))
  }