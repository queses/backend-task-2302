const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { sequelize } = require('../model')
const { ContractsService } = require('../services/ContractsService')
const { callbackify } = require('util')

class ContractsController {
    constructor() {
        this._service = new ContractsService(sequelize)

        const path = '/contracts'
        this.router = Router()
            .use(path, getProfile)
            .get(path + '/:id', callbackify(this._getById))
            .get(path, callbackify(this._list))
    }

    _getById = async (req, res) => {
        const item = await this._service.getById(req.profile.id, req.params.id)
        if (!item) {
            return res.status(404).end()
        }

        res.json(item)
    }

    _list = async (req, res) => {
        const items = await this._service.getNonTerminated(req.profile.id)
        res.json(items)
    }
}

module.exports = { ContractsController }
