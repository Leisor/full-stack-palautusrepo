const mongoose = require('mongoose')

mongoose.set('strictQuery', false)


const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)

  .then(result => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

// const password = process.argv[2]
// const person = process.argv[3]
// const number = process.argv[4]


mongoose.set('strictQuery', false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
  },
  number: {
    type: String,
    validate: {
      validator: function(v) {
        return (
          /^\d{2}-\d{7}$/.test(v) ||
          /^\d{3}-\d{8}$/.test(v)
        )
      },
      message: props => `${props.value} is not a valid phone number!`
      }
    }
  }
)

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

// const Person = mongoose.model('Person', personSchema)


    // Person 
    //     .find({})
    //     .then(result => {
    //         result.forEach(person => {
    //         console.log(person)
    //         })
    //         mongoose.connection.close()
    //     })

// if (process.argv.length === 5) {
//     const newPerson = new Person({
//         name: person,
//         number: number,
//         id: String(1 + Math.floor(Math.random()*100000))
//     })

//     newPerson.save().then(result => {
//         console.log('person saved to phonebook!')
//         mongoose.connection.close()
//         })
// }

// if (process.argv.length === 3) {
//     Person 
//         .find({})
//         .then(result => {
//             result.forEach(person => {
//             console.log(person)
//             })
//             mongoose.connection.close()
//         })
// }

module.exports = mongoose.model('Person', personSchema)