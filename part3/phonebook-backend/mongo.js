const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument:')
  console.log('node mongo.js <password> [name] [number]')
  process.exit(1)
}

const password = process.argv[2]

const url =
  `mongodb://pranjalssingh149_db_user:${password}@ac-nxtdc9v-shard-00-00.usyult5.mongodb.net:27017,ac-nxtdc9v-shard-00-01.usyult5.mongodb.net:27017,ac-nxtdc9v-shard-00-02.usyult5.mongodb.net:27017/phonebookApp?ssl=true&replicaSet=atlas-4rhht1-shard-0&authSource=admin&retryWrites=true&w=majority&appName=Cluster1`

mongoose.set('strictQuery', false)

mongoose
  .connect(url)
  .then(() => {
    console.log('Connected to MongoDB')

    const personSchema = new mongoose.Schema({
      name: String,
      number: String
    })

    const Person = mongoose.model('Person', personSchema)

    if (process.argv.length === 3) {
      Person.find({}).then(result => {
        console.log('Phonebook:')

        result.forEach(person => {
          console.log(`${person.name} ${person.number}`)
        })

        mongoose.connection.close()
      })
    } else {
      const person = new Person({
        name: process.argv[3],
        number: process.argv[4]
      })

      person.save().then(() => {
        console.log(`Added ${person.name} number ${person.number} to phonebook`)
        mongoose.connection.close()
      })
    }
  })
  .catch(error => {
    console.log('Connection error:')
    console.log(error)
    process.exit(1)
  })