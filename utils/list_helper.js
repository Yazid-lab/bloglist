const dummy = (blog) => {
  return 1
}
const totalLikes = (blogs) =>{
    const reducer = (sum, blog)=>{
        return sum + blog.likes
    }
    return blogs.reduce(reducer,0)
}

//TODO: exercise 4.5: ADD favoriteBlog function
module.exports = {
  dummy, totalLikes
}
