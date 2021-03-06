const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server'); // same as const app = require('./../server').app;
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, users, populateTodos, populateUsers} = require('./seed/seed');

// test lifecycle method... run before every test case
beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({text})
            .expect(200) // status should be 200
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }

                // make request to DB to verify
                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should not create todo with invalid body data', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({})
            .expect(400) // status should be 400
            // function in end() because making async db call
            .end((err,res) => {
                if(err) {
                    return done(err);
                }

                // make request to DB to verify
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('GET /todos', () => {
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                // only one for this user
                expect(res.body.todos.length).toBe(1);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should NOT get a todo created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[1]._id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID();
        // should status code is 404
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 400 if invalid id', (done) => {
        var id = '1234';
        // status should be 400
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(400)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var hexId = todos[1]._id.toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toBe(hexId);
            })
            .end((err,res) => {
                if(err) return done(err);

                Todo.findById(hexId).then((todos) => {
                    expect(todos).toBeFalsy()
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should return 404 if not found', (done) => {
        var hexId = new ObjectID().toHexString();

        request(app)
            .delete(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 400 if objectid is invalid', (done) => {
        request(app)
            .get(`/todos/123foo`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(400)
            .end(done);
    });
});

describe('PATCH /todos/:id', () => {
    it('should updated a todo', (done) => {
        var hexId = todos[0]._id.toHexString();
        var text = 'text for test 1';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[0].tokens[0].token)
            .send({text:text,completed:true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.text).toBe(text);
                // expect(res.body.todo.completedAt).toBeA('number');
                expect(typeof res.body.todo.completedAt).toBe('number')
            })
            .end(done);

        // update text, set completed = true
        // assert 200, custom verify response body has text sent, completed = true, completedAt is a num .toBeA('number')
    });

    it('should clear completedAt when todo is not completed', (done) => {
        var hexId = todos[1]._id.toHexString();
        var text = 'text for test 2';
        request(app)
            .patch(`/todos/${hexId}`)
            .set('x-auth', users[1].tokens[0].token)
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.text).toBe(text);
                expect(res.body.todo.completedAt).toBe(null);
            })
            .end(done);
            // update text to comething different, set comopleted = false
            // assert 200, same as above exect completed
    });
});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth',users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = 'don1@email.com';
        var password = '123pwd';

        request(app)
            .post('/users')
            .send({email,password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            })
        .end((err) => {
            if(err) {
                return done(err);
            }

            User.findOne({email:email}).then((user) => {
                expect(user).toBeTruthy();
                expect(user.password).not.toBe(password);
                done();
            })
        });
    });

    it('should return validation errors if invalid request', (done) => {
        request(app)
            .post('/users')
            .send({
                email:'fakemail',
                password:'123'
            })
            .expect(400)
        .end(done);
    });

    it('should not create user if email already exists', (done) => {
        var email = 'don1@email.com';
        var password = '123pwd';

        request(app)
            .post('/users')
            .send({
                email:users[0].email,
                password: '123abc'
            })
            .expect(400)
        .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
            })
            .end((err, res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[1]._id).then((user) => {
                    expect(user.toObject().tokens[1]).toMatchObject({
                        access: 'auth',
                        token: res.headers['x-auth']
                    });
                    done();
                }).catch((err) => done(err));
            });
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: 'badpass'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeFalsy();
            })
            .end(done);
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove token on logout', (done) => {
        // DELETE /users/me/token
        request(app)
            .delete('/users/me/token')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                
            })
            .end((err,res) => {
                if(err) {
                    return done(err);
                }

                User.findById(users[0]._id).then((user) => {
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => {
                    done(e);
                });
            });
    });
})