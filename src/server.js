const express = require('express')
const bodyParser = require('body-parser')
const { ContractsController } = require('./controllers/ContractsController')

init()

async function init() {
    const app = express()
    app.use(bodyParser.json())

    app.use(new ContractsController().router)

    app.use(handleError)

    app.listen(3001, () => {
        console.log('Express App Listening on Port 3001')
    })
}

function handleError(req, res, next, err) {
    console.error(err)
    res.status(500).send('Internal Server Error')
}
