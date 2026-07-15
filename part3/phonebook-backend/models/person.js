const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

const url = process.env.MONGODB_URI

if (!url) {
  console.error('MONGODB_URI is missing')
  process.exit(1)
}

console.log('Connecting to MongoDB...')

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error.message)
  })

const personSchema = new mongoose.Schema({
  name: {
    type: String,
    minLength: 3,
    required: true
  },

  number: {
    type: String,
    minLength: 8,
    required: true,

    validate: {
      validator: (number) => {
        return /^\d{2,3}-\d+$/.test(number)
      },
      message: (props) =>
        `${props.value} is not a valid phone number`
    }
  }
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()

    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Person', personSchema)