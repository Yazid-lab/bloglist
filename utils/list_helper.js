const _ = require('lodash')
const dummy = () => {
  return 1
}
const totalLikes = (blogs) => {
  const reducer = (sum, blog) => {
    return sum + blog.likes
  }
  return blogs.reduce(reducer, 0)
}
const favoriteBlog = (blogs) => {
  const reducer = (maxLikesBlog, newBlog) => {
    return newBlog.likes > maxLikesBlog.likes
      ? {
          title: newBlog.title,
          author: newBlog.author,
          likes: newBlog.likes,
        }
      : {
          title: maxLikesBlog.title,
          author: maxLikesBlog.author,
          likes: maxLikesBlog.likes,
        }
  }
  return blogs.reduce(reducer, blogs[0])
}
module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}
