const { Op } = require('sequelize')

class BalancesService {
    constructor(sequelize) {
        this._sequelize = sequelize
        this._models = sequelize.models
    }

    deposit(userId, amount) {
        return this._sequelize.transaction(async transaction => {
            if (typeof amount !== 'number' || amount <= 0) {
                return { success: false, message: `Deposit amount should be above 0` }
            }

            const profile = await this._models.Profile.findOne({
                where: { id: userId, type: 'client' },
                lock: transaction.LOCK.UPDATE,
                transaction
            })

            if (!profile) {
                return { code: 404, message: 'Not found' }
            }

            const jobsSum = await this._models.Job.findAll({
                attributes: [[this._sequelize.fn('SUM', this._sequelize.col('price')), 'priceSum']],
                where: { paid: { [Op.not]: true } },
                include: {
                    model: this._models.Contract,
                    attributes: [],
                    where: { status: 'in_progress', ClientId: userId },
                    required: true
                },
                transaction
            })

            const priceSum = jobsSum[0].dataValues.priceSum
            if (priceSum === null) {
                return { success: false, reason: `No unpayed jobs found for the user` }
            }

            const maxAmount = priceSum * 0.25
            if (amount > maxAmount) {
                return {
                    success: false,
                    reason: `Deposit amount cannot be greater than ${maxAmount}`
                }
            }

            profile.balance += amount

            await profile.save({ transaction })

            return { success: true, newAmount: profile.balance }
        })
    }
}

module.exports = { BalancesService }
