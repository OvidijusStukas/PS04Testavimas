var connection = require ('../config/connection');

function Todo() {
  this.get = function(res) {
    connection.acquire(function(err,con) {
      con.query('select * from todo_list', function(err,result) {
        con.release();
        res.send(result);
        console.log("Get successful");
      });
    });
  };
  this.getByID = function(id,res) {
    connection.acquire(function(err,con) {
      con.query('select * from todo_list where id = ?', id, function(err,result) {
        con.release();
        if (result.length > 0)
          res.send(result);
        else {
          res.status(404).send(result);
        }
        console.log("Get by ID successful");
      });
    });
  };
  this.create = function(todo,res) {
    connection.acquire(function(err,con) {
      con.query('insert into todo_list set ?', todo, function(err,result) {
        con.release();
        if (err) {
          res.status(400).send({message:'TODO creation fail'});
        } else {
          res.status(201).send({todo: result});
          console.log("Post successful");
        }
      });
    });
  };
  this.update = function(todo,id,res) {
    connection.acquire(function(err,con) {
      con.query('update todo_list set name = ?, priority = ?, date = ?, preferred_date = ?  where id = ?', [todo.name, todo.priority, todo.date, todo.preferred_date, id], function(err,result) {
        con.release();
        if (err || result.affectedRows === 0) {
          res.status(400).send({message:'TODO update fail'});
        } else {
          res.send({todo: result});
          console.log("Put successful");
        }
      });
    });
  };
  this.delete = function(id,res) {
    connection.acquire(function(err,con) {
      con.query('delete from todo_list where id = ?', id, function(err, result) {
        con.release();

        if (err || result.affectedRows === 0) {
          res.status(400).send({message:'TODO delete fail'});
        } else {
          res.sendStatus(204);
          console.log("Delete successful");
        }
      });
    });
  };
}

module.exports = new Todo();
