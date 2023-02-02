const { Op } = require('sequelize')

class ContractsService {
    constructor(sequelize) {
        this._models = sequelize.models
    }

    getById(profileId, id) {
        return this._models.Contract.findOne({
            where: {
                id,
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
            }
        })
    }

    getNonTerminated(profileId) {
        return this._models.Contract.findAll({
            where: {
                status: { [Op.ne]: 'terminated' },
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
            }
        })
    }
}

module.exports = { ContractsService }
