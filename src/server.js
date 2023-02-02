const express = require('express')
const bodyParser = require('body-parser')
const { ContractsController } = require('./controllers/ContractsController')

init()

async function init() {
    const app = express()
        .use(bodyParser.json())
        .use(new ContractsController().router)

    app.listen(3001, () => {
        console.log('Express App Listening on Port 3001')
    })
}
