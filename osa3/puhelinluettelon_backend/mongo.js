const mongoose = require('mongoose')

const password = process.argv[2]
const person = process.argv[3]
const number = process.argv[4]

const url = `mongodb+srv://hleskel:${password}@cluster0.fsxbv1f.mongodb.net/puhelinluettelo?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
  id: Number
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
  const newPerson = new Person({
    name: person,
    number: number,
    id: String(1 + Math.floor(Math.random() * 100000))
  })

  newPerson.save().then(() => {
    console.log('person saved to phonebook!')
    mongoose.connection.close()
  })
}

if (process.argv.length === 3) {
  Person
    .find({})
    .then(result => {
      result.forEach(person => {
        console.log(person)
      })
      mongoose.connection.close()
    })
}
