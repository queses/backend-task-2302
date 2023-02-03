const { Router } = require('express')
const { sequelize } = require('../model')
const { BalancesService } = require('../services/BalancesService')
const { asyncHandler } = require('../util')

class BalancesController {
    constructor() {
        this._service = new BalancesService(sequelize)

        const path = '/balances'
        this.router = Router()
            .post(path + '/deposit/:userId', asyncHandler(this._deposit))
    }

    _deposit = async (req, res) => {
        const result = await this._service.deposit(req.params.userId, req.body.amount)
        if (result.code) {
            return res.status(result.code).json({ message: result.message })
        }

        res.json(result)
    }
}

module.exports = { BalancesController }
