const { Op } = require('sequelize')

class JobsService {
    constructor(sequelize) {
        this._sequelize = sequelize
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

    pay(clientId, jobId) {
        return this._sequelize.transaction(async transaction => {
            const job = await this._models.Job.findOne({
                where: { id: jobId },
                include: {
                    model: this._models.Contract,
                    require: true,
                    where: { status: 'in_progress', ClientId: clientId }
                },
                lock: transaction.LOCK.UPDATE,
                transaction
            })

            if (!job) {
                return { code: 404, message: 'Job not found' }
            } else if (job.paid) {
                return { success: false, reason: 'Job was already paid' }
            }

            const profiles = await this._models.Profile.findAll({
                where: { id: { [Op.in]: [job.Contract.ClientId, job.Contract.ContractorId] } },
                lock: transaction.LOCK.UPDATE,
                transaction
            })

            const client = profiles.find(item => item.id === job.Contract.ClientId)
            const contractor = profiles.find(item => item.id === job.Contract.ContractorId)

            if (!client) {
                return { code: 404, message: 'Client not found' }
            } else if (!contractor) {
                return { code: 404, message: 'Contractor not found' }
            } else if (job.price > client.balance) {
                return { success: false, reason: 'Not enough money' }
            }
    
            client.balance -= job.price
            contractor.balance += job.price
            job.paid = true
            job.paymentDate = new Date()

            await Promise.all([
                client.save({ transaction }),
                contractor.save({ transaction }),
                job.save({ transaction })
            ])

            return { success: true }
        })
    }
}

module.exports = { JobsService }
