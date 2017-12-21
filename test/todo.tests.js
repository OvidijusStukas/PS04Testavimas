'use strict';

process.env.NODE_ENV = 'test';
var
  server = require('../app.js'),
  chai = require('chai'),
  should = chai.should(),
  connection = require ('../app/config/connection'),
  chaiHttp = require('chai-http');

chai.use(chaiHttp);

var todo = {
  id: '5',
  name: 'test todo',
  priority: 'low'
};

describe('Todos', function() {
  beforeEach(function (done) {
    connection.acquire(function(err,con) {
      con.query('insert into todo_list set ?', todo, function() {
          con.release();
          done();
      });
    });
  });

  afterEach(function (done) {
    connection.acquire(function(err,con) {
      con.query('delete from todo_list', todo.name, function() {
        con.release();
        done();
      });
    });
  });

  it('GET should return todos as list', function(done) {
    chai.request(server)
      .get('/todo')
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it('GET/:id should return todo', function (done) {
    chai.request(server)
      .get('/todo/'+todo.id)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.length.should.be.eql(1);
        done();
      });
  });

  it('GET/:id without bad id should return error', function(done) {
    chai.request(server)
      .get('/todo/null')
      .end(function (err, res) {
        res.should.have.status(404);
        res.body.length.should.be.eql(0);
        done();
      });
  });

  it('POST should create new todo', function(done) {
    var newTodo = {
      name: 'new todo'
    };

    chai.request(server)
      .post('/todo')
      .send(newTodo)
      .end(function (err, res) {
        res.should.have.status(201);
        res.body.should.be.a('object');
        res.body.should.have.property('todo');
        done();
      });
  });

  it('POST with bad todo should return error', function(done) {
    chai.request(server)
      .post('/todo')
      .send(null)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('TODO creation fail');
        done();
      });
  });

  it('DELETE/:id should delete todo with correct id', function(done) {
    chai.request(server)
      .delete('/todo/' + todo.id)
      .end(function (err, res) {
        res.should.have.status(204);
        res.body.should.be.a('object');
        res.body.should.be.eql({});
        done();
      });
  });

  it('DELETE/:id with bad id should return error', function(done) {
    chai.request(server)
      .delete('/todo/null')
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('TODO delete fail');
        done();
      });
  });

  it('PUT/:id should update todo', function(done) {
    var copy = Object.assign(todo);
    copy.name = 'updated todo';

    chai.request(server)
      .put('/todo/' + copy.id)
      .send(copy)
      .end(function (err, res) {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.body.should.have.property('todo');
        done();
      });
  });

  it('PUT/:id with bad id should return error', function(done) {
    var copy = Object.assign(todo);
    copy.name = 'updated todo';

    chai.request(server)
      .put('/todo/' + null)
      .send(copy)
      .end(function (err, res) {
        res.should.have.status(400);
        res.body.should.be.a('object');
        res.body.should.have.property('message').eql('TODO update fail');
        done();
      });
  });
});
