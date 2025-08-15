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
//   {
//     "name": "Arto Hellas",
//     "number": "040-123456",
//     "id": "1"
//   },
//   {
//     "name": "Ada Lovelace",
//     "number": "39-44-5323523",
//     "id": "2"
//   },
//   {
//     "name": "Dan Abramov",
//     "number": "12-43-234345",
//     "id": "3"
//   },
//   {
//     "name": "Mary Poppendieck",
//     "number": "39-23-6423122",
//     "id": "4"
//   }
// ]

app.get('/info', (request, response, next) => {
  Person.countDocuments({})
    .then(count => {
      const requestTimestamp = new Date()
      response.send(
        `<p>Phonebook has info for ${count} people</p>
         <p>${requestTimestamp}</p>`
      )
    })
    .catch(error => next(error))
})

app.get('/api/persons', (request, response, next) => {
  Person.find({})
    .then(persons => {
      response.json(persons)
    })
    .catch(error => next(error))
})

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then(person => {
      if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})

// app.delete('/api/persons/:id', (request, response) => {
//   const id = request.params.id
//   persons = persons.filter(person => person.id !== id)
//   response.status(204).end()
// })

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// const generateId = () => {
//   return String(1 + Math.floor(Math.random()*100000))
// }

app.post('/api/persons', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    const error = new Error()
    error.name = 'FieldMissingError'
    return next(error)
  }

  Person.find({ name: body.name })
    .then(existingPerson => {
      if (existingPerson.length > 0) {
        const error = new Error()
        error.name = 'DuplicateError'
        return next(error)
      }

      const person = new Person({
        name: body.name,
        number: body.number,
      })

      return person.save()
    })
    .then(savedPerson => {
      response.json(savedPerson)
    })
    .catch(error => next(error))
  //console.log(error.response.data)
})

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body

  if (!body.name || !body.number) {
    const error = new Error()
    error.name = 'FieldMissingError'
    return next(error)
  }

  const person = {
    name: body.name,
    number: body.number,
  }

  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } else if (error.name === 'FieldMissingError') {
    return response.status(400).send({ error: 'name or number missing!' })
  } else if (error.name === 'DuplicateError') {
    return response.status(400).send({ error: 'name already exists!' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).send({ error: error.message })
  }
  next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})