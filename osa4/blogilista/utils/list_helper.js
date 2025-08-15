const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
    let sum = 0
    blogs.forEach(blog => {
        sum += blog.likes
    })
    return sum
}

const favoriteBlog = (blogs) => {
    mostLikes = 0
    blogWithMostLikes = ""
    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            blogWithMostLikes = blog
        }
    })
    return blogWithMostLikes
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
}