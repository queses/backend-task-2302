const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { sequelize } = require('../model')
const { JobsService } = require('../services/JobsService')
const { asyncHandler } = require('../util')

class JobsController {
    constructor() {
        this._service = new JobsService(sequelize)

        const path = '/jobs'
        this.router = Router()
            .use(path, getProfile)
            .get(path, asyncHandler(this._list))
            .post(path + '/:id/pay', asyncHandler(this._pay))
    }

    _list = async (req, res) => {
        const items = await this._service.listActive(req.profile.id)
        res.json(items)
    }

    _pay = async (req, res) => {
        const result = await this._service.pay(req.profile.id, req.params.id)
        if (result.code) {
            return res.status(result.code).json({ message: result.message })
        }

        res.json(result)
    }
}

module.exports = { JobsController }
