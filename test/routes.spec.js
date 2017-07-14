process.env.NODE_ENV = 'test';
process.env.TOKEN ='eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6ImZvbyIsInBhc3N3b3JkIjoiYmFyIiwiaWF0IjoxNDk5OTg1Nzk2LCJleHAiOjE1MDA4NDk3OTZ9.vLrvviDQ2uGwSLUKXAlHjj7ttOaU0cTk-BEN25PG0LI';
const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');

const server = require('../server');
const knex = require('../db/knex');

const jwt = require('jsonwebtoken');
const config = require('dotenv').config().parsed;
const checkauth = '../server';


chai.use(chaiHttp);



describe('Client Routes', () => {
  it('should return the homepage with text', (done) => {
    chai.request(server)
    .get('/')
    .end((err, response) => {
      response.should.have.status(200);
      response.should.be.html;
      done();
    });
  });

  it('should return a 404 for a route that does not exist', (done) => {
    chai.request(server)
    .get('/sad')
    .end((err, response) => {
      response.should.have.status(404);
      done();
    });
  });
});

describe('API Routes', () => {


  beforeEach((done) => {
    knex.migrate.rollback()
    .then(() => {
      knex.migrate.latest()
      .then(() => {
        knex.seed.run()
        .then(() => {
          done();
        });
      });
    });
  });

  describe('authorization post', () => {
    it('should return an authentication token, happy', (done) => {
       chai.request(server)
       .post('/api/v1/authenticate')
       .send({ username: 'foo', password: 'bar' })
       .end((err, response) => {
         response.should.have.status(200);
         response.body.should.be.a('object');
         response.body.should.have.property('token');
         done();
       });
     });

    it('should not return an authentication token, sad', (done) => {
      chai.request(server)
      .post('/api/v1/authenticate')
      .send({ username: 'no', password: 'way' })
      .end((err, response) => {
        response.should.have.status(403);
        response.body.should.be.a('object');
        response.body.should.have.property('message');
        response.body.message.should.equal('Invalid Credentials');
        done();
      });
    });
  });

  describe('GET /api/v1/sports/', () => {
    it('should return all of the sports', (done) => {
      chai.request(server)
      .get('/api/v1/sports/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        done();
      });
    });
  });

  describe('GET /api/v1/sports/id/:id', () => {
    it('should return the sport of id 3', (done) => {
      chai.request(server)
      .get('/api/v1/sports/id/3')
      .end((err, response) => {
        response.body.sort((a, b) => a.id - b.id);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('golf');
        done();
      });
    });

    it('should return no sport', (done) => {
      chai.request(server)
      .get('/api/v1/sports/id/5')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Could not find sport with id of 5`);
        done();
      });
    });
  });

  describe('GET /api/v1/sports/sport/:sport', () => {
    it('should return the sport boxing', (done) => {
      chai.request(server)
      .get('/api/v1/sports/sport/boxing')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('boxing');
        done();
      });
    });

    it('should return not return a sport', (done) => {
      chai.request(server)
      .get('/api/v1/sports/sport/fishing')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`Could not find fishing`);
        done();
      });
    });
  });

  describe('GET /api/v1/covers/', () => {
    it('should return all of the covers', (done) => {
      chai.request(server)
      .get('/api/v1/covers/')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(6);
        done();
      });
    });
  });

  describe('GET /api/v1/covers/date/:date', () => {
    it('should return the cover of specified date', (done) => {
      chai.request(server)
      .get('/api/v1/covers/date/06132016')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('boxing');
        done();
      });
    });

    it('should return not return a cover', (done) => {
      chai.request(server)
      .get('/api/v1/covers/date/08092017')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`No covers were found for the date 08092017.`);
        done();
      });
    });
  });

  describe('GET /api/v1/covers/id/:id', () => {
    it('should return the cover of specified date', (done) => {
      chai.request(server)
      .get('/api/v1/covers/id/4')
      .end((err, response) => {
        response.body.sort((a, b) => a.id - b.id);
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('climbing');
        done();
      });
    });

    it('should return not return a cover', (done) => {
      chai.request(server)
      .get('/api/v1/covers/id/9')
      .end((err, response) => {
        response.should.have.status(404);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('error');
        response.body.error.should.equal(`No covers were found with id of 9.`);
        done();
      });
    });
  });

  describe('GET /api/v1/sports/id/:sport_id/covers', () => {
    it('should return the covers for sport specified by id', (done) => {
      chai.request(server)
      .get('/api/v1/sports/id/3/covers')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(2);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('golf');
        done();
      });
    });

    it('should not return the covers for sport specified by id', (done) => {
      chai.request(server)
      .get('/api/v1/sports/id/9/covers')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('note');
        response.body.note.should.equal(`No covers exist for that sport_id`);
        done();
      });
    });
  });

  describe('GET /api/v1/sports/sport/:sport/covers', () => {
    it('should return the cover of specified date', (done) => {
      chai.request(server)
      .get('/api/v1/sports/sport/boxing/covers')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(3);
        response.body[0].should.have.property('sport');
        response.body[0].sport.should.equal('boxing');
        done();
      });
    });

    it('should not return the covers for sport specified by id', (done) => {
      chai.request(server)
      .get('/api/v1/sports/sport/fishing/covers')
      .end((err, response) => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('note');
        response.body.note.should.equal(`No covers exist for fishing`);
        done();
      });
    });
  });

  describe('POST /api/v1/sports', () => {
      it('should add sport into database if user has auth', (done) => {
      chai.request(server)
      .post('/api/v1/sports')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 4, sport: 'fencing'
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(4);
        done();
      });
    });

      it('should not insert new sport if user does not input required format', (done) => {
      chai.request(server)
      .post('/api/v1/sports')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 4, name: 'fencing'
    })
      .end((err, response) => {
        response.should.have.status(422);
        done();
      });
    });

      it('should not insert new sport if user does not have auth', (done) => {
      chai.request(server)
      .post('/api/v1/sports')
      .send({ id: 4, sport: 'fencing'
      })
      .end((err, response) => {
        response.should.have.status(403);

        done();
      });
    });
  });

  describe('POST /api/v1/covers', () => {
      it('should add cover into database if user has auth', (done) => {
      chai.request(server)
      .post('/api/v1/covers')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 9, date: '08091900', sport: 'boxing', level: 'pro', athlete: 'joe bob', gender: 'male', sport_id: 1
      })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(9);
        done();
      });
    });

      it('should not add cover into database if user is missing a property', (done) => {
      chai.request(server)
      .post('/api/v1/covers')
      .set('Authorization', process.env.TOKEN)
      .send({ id: 9, score: '08091900', sport: 'boxing', level: 'pro', athlete: 'joe bob', gender: 'male', sport_id: 1
      })
      .end((err, response) => {
        response.should.have.status(422);
        done();
      });
    });

      it('should not insert new sport if user does not have auth', (done) => {
      chai.request(server)
      .post('/api/v1/sports')
      .send({ id: 9, date: '08091900', sport: 'boxing', level: 'pro', athlete: 'joe bob', gender: 'male', sport_id: 1
      })
      .end((err, response) => {
        response.should.have.status(403);
        done();
      });
    });
  });

  describe('PATCH update cover', () => {
    it('should update cover if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .patch('/api/v1/covers/id/1')
      .set('Authorization', process.env.TOKEN)
      .send({ sport: 'golf' })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('sport');
        response.body.sport.should.equal('golf');
          done();
        });
      });

    it('should not update cover if user does not have auth', (done) => {
      chai.request(server)
      .patch('/api/v1/covers/id/1')
      .send({ sport: 'golf' })
      .end((err, response) => {
        response.should.have.status(403);

          done();
        });
      });
  });

  describe('PATCH update sport', () => {
    it('should update sport if user has authorization and hits enpoint', (done) => {
      chai.request(server)
      .patch('/api/v1/sports/id/1')
      .set('Authorization', process.env.TOKEN)
      .send({ sport: 'sleeping' })
      .end((err, response) => {
        response.should.have.status(201);
        response.body.should.have.property('sport');
        response.body.sport.should.equal('sleeping');
          done();
        });
      });

    it('should not update sport if user does not have auth', (done) => {
      chai.request(server)
      .patch('/api/v1/covers/id/1')
      .send({ sport: 'sleeping' })
      .end((err, response) => {
        response.should.have.status(403);

          done();
      });
    });
  });

  describe('DELETE requests', () => {
    it('should delete a cover with auth by id', (done) => {
      chai.request(server)
      .get('/api/v1/covers')
      .end((error, response) => {
        response.body.length.should.equal(6);
        chai.request(server)
        .delete('/api/v1/covers/id/delete/1')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/covers')
          .end((error, response) => {
            response.body.length.should.equal(5);
            done();
          });
        });
      });
    });

    it('should not delete a cover without auth by id', (done) => {
      chai.request(server)
      .get('/api/v1/covers')
      .end((error, response) => {
        response.body.length.should.equal(6);
        chai.request(server)
        .delete('/api/v1/covers/id/delete/1')
        .end((err, response) => {
          response.should.have.status(403);
          chai.request(server)
          .get('/api/v1/covers')
          .end((error, response) => {
            response.body.length.should.equal(6);
            done();
          });
        });
      });
    });

    it('should delete a cover with auth by date', (done) => {
      chai.request(server)
      .get('/api/v1/covers')
      .end((error, response) => {
        response.body.length.should.equal(6);
        chai.request(server)
        .delete('/api/v1/covers/date/delete/04172017')
        .set('Authorization', process.env.TOKEN)
        .end((err, response) => {
          response.should.have.status(204);
          chai.request(server)
          .get('/api/v1/covers')
          .end((error, response) => {
            response.body.length.should.equal(5);
            done();
          });
        });
      });
    });

    it('should not delete a cover without auth', (done) => {
      chai.request(server)
      .get('/api/v1/covers')
      .end((error, response) => {
        response.body.length.should.equal(6);
        chai.request(server)
        .delete('/api/v1/covers/date/delete/04172017')
        .end((err, response) => {
          response.should.have.status(403);
          chai.request(server)
          .get('/api/v1/covers')
          .end((error, response) => {
            response.body.length.should.equal(6);
            done();
          });
        });
      });
    });
  });
});
