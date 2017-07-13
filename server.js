const express = require('express')
const cors = require('cors');
const app = express()
const bodyParser = require('body-parser')
const database = require('./db/knex')

const jwt = require('jsonwebtoken');
const config = require('dotenv').config();

app.use(express.static(`${__dirname}/public`))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.use(cors());


if (!config.CLIENT_SECRET || !config.USERNAME || !config.PASSWORD) {
  throw 'Make sure you have a CLIENT_SECRET, USERNAME, and PASSWORD in your .env file'
}

app.set('secretKey', config.CLIENT_SECRET);
const checkAuth = (request, response, next) => {
  const token = request.body.token ||
                request.params.token ||
                request.headers.authorization;
  if (token) {
    jwt.verify(token, app.get('secretKey'), (error, decoded) => {
    if (error) {
      return response.status(403).send({
        success: false,
        message: 'Invalid authorization token.'
      });
    } else {
        request.decoded = decoded;
        next();
      }
    });
  }
  else {
    return response.status(403).send({
      success: false,
      message: 'You must be authorized to hit this endpoint'
    });
  }
};

app.set('port', process.env.PORT || 3000)
app.locals.title = 'byob'


app.get('/', (request, response) => {
  response.sendFile('index.html')
})

app.post('/api/v1/authenticate', (request, response) => {
  const user = request.body;
  if (user.username !== config.USERNAME || user.password !== config.PASSWORD) {
    response.status(403).send({
      success: false,
      message: 'Invalid Credentials'
    });
  } else {
    let token = jwt.sign(user, app.get('secretKey'), {
      expiresIn: 864000
    });

    response.json({
      success: true,
      username: user.username,
      token: token
    });
  }
});

app.post('/api/v1/sports', checkAuth, (request, response) => {
  const sport = request.body;

  for(let requiredParams of ['sport']) {
    if(!sport[requiredParams]) {
      return response.status(422).json({error: `Expected format: { sport: <string> }. You are missing a ${requiredParams} property`})
    }
  }

  database('sports').insert(sport, 'id', 'sport')
  .then((sport) => {
    response.status(201).json({id: sport[0]})
  })
  .catch(error => response.status(500).json({ error }))
})

app.post('/api/v1/covers', checkAuth, (request, response) => {
  const cover = request.body;

  for(let requiredParams of ['date', 'sport', 'level', 'athlete', 'gender', 'sport_id']) {
    if(!cover[requiredParams]) {
      return response.status(422).json({error: `Expected format: { date: <string>, sport: <string>, level: <string>, athlete: <string>, gender: <string>, sport_id: <integer> }. You are missing a ${requiredParams} property`})
    }
  }

  database('covers').insert(cover, 'id')
  .then((cover) => {
    response.status(201).json({id: cover[0]})
  })
  .catch(error => response.status(500).json({ error }))
})

app.patch('/api/v1/covers/id/:id', checkAuth, (request, response) => {
  const keys = Object.keys(request.body);
  database('covers').where('id', request.params.id).update(request.body, ['id', ...keys])
  .then((updated) => {
    if (!updated.length) {
      response.sendStatus(404).json({error:'could not update '});
    } else {
      response.status(200).send(updated[0]);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.patch('/api/v1/sports/id/:id', checkAuth, (request, response) => {
  const keys = Object.keys(request.body);
  database('sports').where('id', request.params.id).update(request.body, ['id', ...keys])
  .then((updated) => {
    if (!updated.length) {
      response.sendStatus(404);
    } else {
      response.status(200).send(updated[0]);
    }
  })
  .catch(error => response.status(500).send(error));
});

app.delete('/api/v1/covers/id/delete/:id', checkAuth, (request, response) => {
  const { id } = request.params;
  database('covers').where('id', id).del()
    .then(result => {
      if(!result.length) {
        response.status(204).json({note: 'deleted!'})
      } else {
        response.status(404).json({ error: `There were no covers with that id to delete!` })
      }
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.delete('/api/v1/covers/date/delete/:date', checkAuth, (request, response) => {
  const { date } = request.params;
  database('covers').where('date', date).del()
    .then(result => {
      if(!result.length) {
        response.status(204).json({message: 'deleted!'})
      } else {
        response.status(404).json({ error: 'There were no covers with specified date to delete!' })
      }
    })
    .catch(error => {
      response.status(500).json({error})
    })
})

app.get('/api/v1/sports/', (request, response) => {
  database('sports').select()
  .then((sports) => {
    if(sports.length) {
      response.status(200).json(sports)
    } else {
      respsonse.status(404).json({error: 'No sports were found!'})
    }
  })
  .catch(error => response.status(500).json({ error}))
})

app.get('/api/v1/sports/id/:id', (request, response) => {
  database('sports').where('id', request.params.id).select()
  .then((sport) => {
    if(sport.length) {
      response.status(200).json(sport);
    } else {
      response.status(404).json({error:`Could not find sport with id of ${request.params.id}`})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.get('/api/v1/sports/sport/:sport', (request, response) => {

  database('sports').where('sport', request.params.sport).select()
  .then((sport) => {
    if(sport.length) {
      response.status(200).json(sport);
    } else {
      response.status(404).json({error:`Could not find ${request.params.sport}`})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.get('/api/v1/covers/', (request, response) => {
  database('covers').select()
  .then((covers) => {
    if(covers.length){
      response.status(200).json(covers)
    } else {
      response.status(404).json({error: 'No covers were found.'})
    }
  })
  .catch(error => response.status(500).json({error}))
})

app.get('/api/v1/covers/date/:date', (request, response) => {
  database('covers').where('date', request.params.date).select()
  .then((covers) => {
    if(covers.length){
      response.status(200).json(covers)
    } else {
      response.status(404).json({error: `No covers were found for the date ${request.params.date}.`})
    }
  })
  .catch(error => response.status(500).json({error}))
})

app.get('/api/v1/covers/id/:id', (request, response) => {
  database('covers').where('id', request.params.id).select()
  .then((covers) => {
    if(covers.length){
      response.status(200).json(covers)
    } else {
      response.status(404).json({error: `No covers were found with id of ${request.params.id}.`})
    }
  })
  .catch(error => response.status(500).json({error}))
})

app.get('/api/v1/sports/id/:sport_id/covers', (request, response) => {
  database('covers').where('sport_id', request.params.sport_id).select()
  .then((cover) => {
    if(cover.length) {
      response.status(200).json(cover);
    } else {
      response.status(200).json({note: 'No covers exist for that sport_id'})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.get('/api/v1/sports/sport/:sport/covers', (request, response) => {
  database('covers').where('sport', request.params.sport).select()
  .then((cover) => {
    if(cover.length) {
      response.status(200).json(cover);
    } else {
      response.status(200).json({note: `No covers exist for ${request.params.sport}`})
    }
  })
  .catch( error => response.status(500).json({ error }))
})

app.listen(app.get('port'), () => {
  console.log(`${app.locals.title} is running on ${app.get('port')}.`)
})

module.exports = app;
