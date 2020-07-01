const express = require('express');
const { uuid, isUuid } = require('uuidv4');

const app = express();

app.use(express.json());

const meets = [];

function logRequests(request, response, next){
  const { method, url } = request;

  const logLabel = `[${method.toUpperCase()}] ${url}`;

  console.log(logLabel);
  return next();
}

function validateMeetId(request, response, next){
  const { id } = request.params;
  console.log('id ='+ id);
  if(!isUuid(id)){
    return response.status(400).json({erro: 'Invalid meet ID.'})
  }

  return next();
}

app.use(logRequests);
app.use('/meets/:id', validateMeetId);


app.get('/meets', (request, response)=>{
  const { type } = request.query;

  const results = type
    ? meets.filter(meet => meet.type.includes(type))
    :meets;

  return response.json(results);
});

app.post('/meets', (request, response)=>{

  const {name, type} = request.body;

  const meet = { id: uuid(), name, type};
  
  meets.push(meet);

  return response.json(meet);
});

app.put('/meets/:id', (request, response)=>{
  const { id } = request.params;
  const { name, type } = request.body;

  const meettIndex = meets.findIndex(meet => meet.id === id);

  if(meettIndex < 0){
    return response.status(400).json({error:"Meet not found."});
  }

  const meet = { id, name, type };

  meets[meettIndex] = meet;

  return response.json(meet);
});

app.delete('/meets/:id', (request, response)=>{
  const { id } = request.params;

  const meettIndex = meets.findIndex(meet => meet.id === id);

  if(meettIndex < 0){
    return response.status(400).json({error:"Meet not found."});
  }

  meets.splice(meettIndex, 1);

  return response.status(204).send();
});

// set port that you'd like load the application
app.listen(3333, ()=>{
  console.log('🚀 Back-end started! 🖥');
});