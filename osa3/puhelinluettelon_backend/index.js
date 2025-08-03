require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Person = require('./models/person')
const app = express()

app.use(express.json())

morgan.token('body', (req) => JSON.stringify(req.body))

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.use(express.static('dist'))

// let persons = [
//     {
//       "name": "Arto Hellas",
//       "number": "040-123456",
//       "id": "1"
//     },
//     {
//       "name": "Ada Lovelace",
//       "number": "39-44-5323523",
//       "id": "2"
//     },
//     {
//       "name": "Dan Abramov",
//       "number": "12-43-234345",
//       "id": "3"
//     },
//     {
//       "name": "Mary Poppendieck",
//       "number": "39-23-6423122",
//       "id": "4"
//     }
//   ]

app.get('/info', (request, response) => {
    const personCount = persons.length
    const requestTimestamp = new Date()
    response.send(
        `<p>Phonebook has info for ${personCount} people<p>
        <p>${requestTimestamp}</p>
        `
    )
})  

app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    response.json(person)
  })
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter(person => person.id !== id)

//   response.status(204).end()
// })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(result => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

const generateId = () => {
    return String(1 + Math.floor(Math.random()*100000))
}

app.post('/api/persons', (request, response) => {
  const body = request.body

  // if (!body.name || !body.number) {
  //   return response.status(400).json({ 
  //     error: 'name or number missing!' 
  //   })
  // }

  // if (persons.some(person => person.name === body.name)) {
  //   return response.status(400).json({ 
  //     error: 'name already exists!' 
  //   }) 
  // }

  const person = new Person({
    name: body.name,
    number: body.number,
    id: generateId(),
  })

  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})