const express = require('express')
const bodyParser = require('body-parser')
const { ContractsController } = require('./controllers/ContractsController')
const { JobsController } = require('./controllers/JobsController')
const { BalancesController } = require('./controllers/BalancesController')

init()

async function init() {
    const app = express()
        .use(bodyParser.json())
        .use(new ContractsController().router)
        .use(new JobsController().router)
        .use(new BalancesController().router)

    app.use(handleError)

    app.listen(3001, () => {
        console.log('Express App Listening on Port 3001')
    })
}

function handleError(err, req, res, next) {
    console.error(err)
    res.status(500).json({ message: 'Internal Server Error' })
}
