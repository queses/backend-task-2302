const { Router } = require('express')
const { getProfile } = require('../middleware/getProfile')
const { sequelize } = require('../model')
const { JobsService } = require('../services/JobsService')
const { asyncHandler } = require('../util')

class JobsController {
    constructor() {
        this._service = new JobsService(sequelize)

        const path = '/jobs'
        this.router = Router().use(path, getProfile).get(path, asyncHandler(this._list))
    }

    _list = async (req, res) => {
        const items = await this._service.listActive(req.profile.id)
        res.json(items)
    }
}

module.exports = { JobsController }
