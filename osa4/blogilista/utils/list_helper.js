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
    let mostLikes = 0
    let blogWithMostLikes = ""
    blogs.forEach(blog => {
        if (blog.likes > mostLikes) {
            mostLikes = blog.likes
            blogWithMostLikes = blog
        }
    })
    return blogWithMostLikes
}

const mostBlogs = (blogs) => {
    let mostProductiveAuthor = ""
    let mostProductiveAuthorBlogs = 0
    const authorsAndBlogs = []

    blogs.forEach(blog => {
        const index = authorsAndBlogs.findIndex(a => a.author === blog.author)
        if (index !== -1) {
            authorsAndBlogs[index].blogs += 1
        }
        else {
            authorsAndBlogs.push({
                author: blog.author,
                blogs: 1
            })
        }
            
    })

    authorsAndBlogs.forEach(aAndB => {
        if (aAndB.blogs > mostProductiveAuthorBlogs) {
            mostProductiveAuthorBlogs = aAndB.blogs
            mostProductiveAuthor = aAndB.author
        }
    })

    return {
        author: mostProductiveAuthor,
        blogs: mostProductiveAuthorBlogs
    }

}

const mostLikes = (blogs) => {
    let mostPopularAuthor = ""
    let mostPopularAuthorLikes = 0
    const authorsAndLikes = []

    blogs.forEach(blog => {
        const index = authorsAndLikes.findIndex(a => a.author === blog.author)
        if (index !== -1) {
            authorsAndLikes[index].likes += blog.likes
        }
        else {
            authorsAndLikes.push({
                author: blog.author,
                likes: blog.likes
            })
        }
            
    })

    authorsAndLikes.forEach(aAndL => {
        if (aAndL.likes > mostPopularAuthorLikes) {
            mostPopularAuthorLikes = aAndL.likes
            mostPopularAuthor = aAndL.author
        }
    })

    return {
        author: mostPopularAuthor,
        likes: mostPopularAuthorLikes
    }

}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes,
}