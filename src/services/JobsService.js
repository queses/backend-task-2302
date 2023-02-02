const { Op } = require('sequelize')

class JobsService {
    constructor(sequelize) {
        this._models = sequelize.models
    }

    listActive(profileId) {
        return this._models.Job.findAll({
            where: {
                paid: { [Op.not]: true }
            },
            include: {
                model: this._models.Contract,
                attributes: [],
                where: {
                    status: 'in_progress',
                    [Op.or]: [{ ContractorId: profileId }, { ClientId: profileId }]
                }
            }
        })
    }
}

module.exports = { JobsService }
