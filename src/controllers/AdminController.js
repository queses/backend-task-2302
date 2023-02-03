const { Router } = require('express')
const { sequelize } = require('../model')
const { AdminService } = require('../services/AdminService')
const { asyncHandler } = require('../util')

class AdminController {
    constructor() {
        this._service = new AdminService(sequelize)

        const path = '/admin'
        this.router = Router()
            .get(path + '/best-profession', asyncHandler(this._bestProfession))
            .get(path + '/best-client', asyncHandler(this._bestClient))
    }

    _bestProfession = async (req, res) => {
        const dates = this._parseDates(req)
        if (!dates) {
            return res.status(400).json({ message: 'Invalid params' })
        }

        const items = await this._service.getBestProfessions(dates[0], dates[1])

        res.json(items)
    }

    _bestClient = async (req, res) => {
        const dates = this._parseDates(req)
        const limit = this._parseLimit(req)
        if (!dates || limit === null) {
            return res.status(400).json({ message: 'Invalid params' })
        }

        const items = await this._service.getBestClients(dates[0], dates[1], limit)

        res.json(items)
    }

    _parseDates(req) {
        const start = new Date(req.query.start)
        const end = new Date(req.query.end)
        if (isNaN(start.getTime()) || isNaN(end.getTime()) || start.getTime() > end.getTime()) {
            return null
        }

        return [start, end]
    }

    _parseLimit(req) {
        const limit = req.query.limit ? parseInt(req.query.limit, 10) : 2
        if (isNaN(limit)) {
            return null
        }

        return limit
    }
}

module.exports = { AdminController }
