const { Op } = require('sequelize')

class JobsService {
    constructor(sequelize) {
        this.sequelize = sequelize
        this.models = sequelize.models
    }

    listActive(profileId) {
        return this.models.Job.findAll({
            where: {
                paid: { [Op.not]: true }
            },
            attributes: { exclude: 'Contract' },
            include: {
                model: this.models.Contract,
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
