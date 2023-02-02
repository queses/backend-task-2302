const { Op } = require('sequelize')

class ContractsService {
    constructor(sequelize) {
        this.sequelize = sequelize
        this.models = sequelize.models
    }

    getById(profileId, id) {
        return this.models.Contract.findOne({
            where: {
                id,
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
            }
        })
    }

    getNonTerminated(profileId) {
        return this.models.Contract.findAll({
            where: {
                status: { [Op.ne]: 'terminated' },
                [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
            }
        })
    }
}

module.exports = { ContractsService }
