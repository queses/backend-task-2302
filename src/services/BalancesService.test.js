const { assert } = require('chai')
const { sequelize } = require('../model')
const fixtures = require('../test/fixtures')
const { BalancesService } = require('./BalancesService')

describe('BalancesService', () => {
    const { models } = sequelize

    function getSut() {
        return new BalancesService(sequelize)
    }

    it('should deposit', async () => {
        await Promise.all([
            models.Profile.create({ ...fixtures.Profile.client, id: 1, balance: 100 }),
            models.Profile.create({ ...fixtures.Profile.contractor, id: 2 }),

            models.Contract.create({
                ...fixtures.Contract.inProgress,
                id: 1,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.terminated,
                id: 2,
                ClientId: 1,
                ContractorId: 2
            }),

            models.Job.create({ ...fixtures.Job.unpaid, price: 50, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.unpaid, price: 50, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.paid, price: 50, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.unpaid, price: 50, ContractId: 2 })
        ])

        const result = await getSut().deposit(1, 25)
        assert.deepEqual(result, { success: true, newAmount: 125 })

        const profile = await models.Profile.findByPk(1)
        assert.equal(profile.balance, 125)
    })

    it('should not deposit if amount is greater than 25% of unpaid jobs price', async () => {
        await Promise.all([
            models.Profile.create({ ...fixtures.Profile.client, id: 1, balance: 100 }),
            models.Profile.create({ ...fixtures.Profile.contractor, id: 2 }),

            models.Contract.create({
                ...fixtures.Contract.inProgress,
                id: 1,
                ClientId: 1,
                ContractorId: 2
            }),

            models.Job.create({ ...fixtures.Job.unpaid, price: 50, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.unpaid, price: 50, ContractId: 1 })
        ])

        const result = await getSut().deposit(1, 26)
        assert.deepEqual(result, { success: false, reason: 'Deposit amount cannot be greater than 25' })

        const profile = await models.Profile.findByPk(1)
        assert.equal(profile.balance, 100)
    })
})
