const { Router } = require('express')
const { sequelize } = require('../model')
const { JobsService } = require('../services/JobsService')
const { asyncHandler } = require('../util')

class BalancesController {
    constructor() {
        this._service = new JobsService(sequelize)

        const path = '/balances'
        this.router = Router()
            .post(path + '/deposit/:userId', asyncHandler(this._deposit))
    }

    _deposit = async (req, res) => {
        const result = await this._service.pay(req.profile.id, req.params.id)
        if (result.code) {
            return res.status(result.code).json({ message: result.message })
        }

        res.json(result)
    }
}

module.exports = { BalancesController }
