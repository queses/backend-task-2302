const { Op } = require('sequelize')

class AdminService {
    constructor(sequelize) {
        this._sequelize = sequelize
        this._models = sequelize.models
    }

    getBestProfessions(startDate, endDate) {
        return this._models.Job.findAll({
            ...this._getBaseJobQuery(startDate, endDate, 'Contractor'),
            attributes: [
                [this._sequelize.col('Contract.Contractor.profession'), 'profession'],
                [this._sequelize.fn('SUM', this._sequelize.col('price')), 'priceSum']
            ],
            group: 'Contract.Contractor.profession',
            order: [['priceSum', 'DESC']]
        })
    }

    getBestClients(startDate, endDate, limit) {
        const sqlFullName = "`Contract->Client`.`firstName` || ' ' || `Contract->Client`.`lastName`"

        return this._models.Job.findAll({
            ...this._getBaseJobQuery(startDate, endDate, 'Client'),
            attributes: [
                [this._sequelize.col('Contract.Client.id'), 'id'],
                [this._sequelize.literal(sqlFullName), 'fullName'],
                [this._sequelize.fn('SUM', this._sequelize.col('price')), 'paid']
            ],
            group: 'Contract.Client.id',
            order: [['paid', 'DESC']],
            limit
        })
    }

    _getBaseJobQuery(startDate, endDate, contractProfileAs) {
        return {
            where: {
                paid: { [Op.is]: true },
                paymentDate: { [Op.between]: [startDate, endDate] }
            },
            include: [
                {
                    model: this._models.Contract,
                    required: true,
                    attributes: [],
                    include: {
                        model: this._models.Profile,
                        as: contractProfileAs,
                        required: true,
                        attributes: []
                    }
                }
            ]
        }
    }
}

module.exports = { AdminService }
