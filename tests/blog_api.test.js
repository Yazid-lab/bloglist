const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
jest.setTimeout(30000);
beforeEach(async () => {
  await Blog.deleteMany({})
  const blogObjects = helper.initialBlogs.map((blog) => new Blog(blog))
  const promiseArray = blogObjects.map((blog) => blog.save())
  await Promise.all(promiseArray)
})
//NOTE: 4.9
test('blogs are returned as json', async () => {
  await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/)
}, 100000)
test('identifier property is named id ', async () => {
  const response = await api.get('/api/blogs')
  expect(response.body[0].id).toBeDefined()
})
//NOTE: 4.10
test('adding a new blog', async () => {
  const newBlog = helper.validBlog
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  const blogsAtEnd = await helper.getBlogsInDb()
  expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)
  const blogIds = blogsAtEnd.map((blog) => blog.id)
  expect(blogIds).toContain(response.body.id)
})

afterAll(() => {
  mongoose.connection.close()
})
