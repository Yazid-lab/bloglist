const mongoose = require('mongoose')
const supertest = require('supertest')
const Blog = require('../models/blog')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
jest.setTimeout(30000)
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
//NOTE: 4.11
test('adding a new blog missing a likes attribute', async () => {
  const newBlog = helper.blogWithMissingLikes
  const response = await api
    .post('/api/blogs')
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)
  expect(response.body.likes).toBe(0)
})
//NOTE: 4.12
test('adding an invalid blog', async () => {
  const newBlog = helper.invalidBlog
  await api.post('/api/blogs').send(newBlog).expect(400)
})
//NOTE: 4.13
test('deleting a blog', async () => {
  const blogsAtStart = await helper.getBlogsInDb()
  const blogToDelete = blogsAtStart[0]
  await api.delete(`/api/blogs/${blogToDelete.id}`).expect(204)
  const blogAtEnd = await helper.getBlogsInDb()
  expect(blogAtEnd).toHaveLength(helper.initialBlogs.length - 1)
})
afterAll(() => {
  mongoose.connection.close()
})
