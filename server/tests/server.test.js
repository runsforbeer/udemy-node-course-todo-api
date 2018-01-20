const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server'); // same as const app = require('./../server').app;
const {Todo} = require('./../models/todo');

// test lifecycle method... run before every test case
beforeEach((done) => {
    Todo.remove({}).then(() => done()); // will remove all todos
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
                Todo.find().then((todos) => {
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
            .end((err,res) => {
                if(err) {
                    return done(err);
                }

                // make request to DB to verify
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            });
    });
});