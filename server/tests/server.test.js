const expect = require('expect');
const request = require('supertest');
const {ObjectID} = require('mongodb');

const {app} = require('./../server'); // same as const app = require('./../server').app;
const {Todo} = require('./../models/todo');

const todos = [{
        _id: new ObjectID(),
        text: 'First test todo'
    }, {
        _id: new ObjectID(),
        text: 'Second test todo'
    }
];
// test lifecycle method... run before every test case
beforeEach((done) => {
    Todo.remove({}).then(() => {
        return Todo.insertMany(todos);
    }).then(() => done()); // will remove all todos
});

describe('POST /todos', () => {
    it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
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
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done);
    });
});

describe('GET /todos/:id', () => {
    it('should get a todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toHexString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe(todos[0].text);
            })
            .end(done);
    });

    it('should return 404 if todo not found', (done) => {
        var id = new ObjectID();
        // should status code is 404
        request(app)
            .get(`/todos/${id.toHexString()}`)
            .expect(404)
            .end(done);
    });

    it('should return 400 if invalid id', (done) => {
        var id = '1234';
        // status should be 400
        request(app)
            .get(`/todos/${id}`)
            .expect(400)
            .end(done);
    });
});