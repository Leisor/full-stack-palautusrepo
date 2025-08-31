import { useState, useEffect } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'

const Notification = ({ message, type }) => {
  if (message === null) {
    return null
  }

  return (
    <div className={type === 'success'
      ? 'success' 
      : 'error'
    }>
      {message}
    </div>
  )
}

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('') 
  const [password, setPassword] = useState('') 
  const [user, setUser] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)
  const [messageType, setMessageType] = useState('error')
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' })

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )  
  }, [])

    useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

   const handleLogin = async event => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({ username, password })
      
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      ) 
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch {
      setErrorMessage('wrong credentials')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
  setUser(null)
  window.localStorage.removeItem('loggedBloglistUser')
  blogService.setToken(null)
}

  if (user === null) {
    return (
      <div>
        <h2>Log in to application</h2>
        <Notification message={errorMessage} type={messageType} />
        <form onSubmit={handleLogin}>
        <div>
          <label>
            username
            <input
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">login</button>
      </form>
      </div>
    )
  }

  const handleNewBlog = async (event) => {
    event.preventDefault()
    
    try {
      const createdBlog = await blogService.create(newBlog)
      setBlogs(blogs.concat(createdBlog))
      setErrorMessage(`a new blog ${newBlog.title} by ${newBlog.author} added`)
      setMessageType('success')
      setNewBlog({ title: '', author: '', url: '' })
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    } catch {
      setErrorMessage('Blog not created!')
      setMessageType('error')
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000)
    }
  }

  return (
    <div>
      <h2>blogs</h2>
      <Notification message={errorMessage} type={messageType} />
      <p>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </p>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} />
      )}
      <h2>create new</h2>
      <form onSubmit={handleNewBlog}>
        <div>
          <label>
            title
            <input
              type="text"
              value={newBlog.title}
              onChange={({ target }) => setNewBlog({ ...newBlog, title: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            author
            <input
              type="text"
              value={newBlog.author}
              onChange={({ target }) => setNewBlog({ ...newBlog, author: target.value })}
            />
          </label>
        </div>
        <div>
          <label>
            url
            <input
              type="text"
              value={newBlog.url}
              onChange={({ target }) => setNewBlog({ ...newBlog, url: target.value })}
            />
          </label>
        </div>
        <button type="submit">create</button>
      </form>

    </div>
  )
}


export default App