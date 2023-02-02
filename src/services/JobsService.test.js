const { assert } = require('chai')
const { sequelize } = require('../model')
const fixtures = require('../test/fixtures')
const { JobsService } = require('./JobsService')

describe('JobsService', () => {
    const { models } = sequelize

    function getSut() {
        return new JobsService(sequelize)
    }

    it('should list active jobs', async () => {
        await Promise.all([
            models.Profile.create({ ...fixtures.Profile.client, id: 1 }),
            models.Profile.create({ ...fixtures.Profile.contractor, id: 2 }),
            models.Profile.create({ ...fixtures.Profile.client, id: 3 }),

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
            models.Contract.create({
                ...fixtures.Contract.inProgress,
                id: 3,
                ClientId: 3,
                ContractorId: 2
            }),

            models.Job.create({ ...fixtures.Job.unpaid, id: 1, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.unpaid, id: 2, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.paid, id: 3, ContractId: 1 }),
            models.Job.create({ ...fixtures.Job.unpaid, id: 4, ContractId: 2 }),
            models.Job.create({ ...fixtures.Job.unpaid, id: 5, ContractId: 3 })
        ])

        // Get as a client:
        let result = await getSut().listActive(1)
        assert.lengthOf(result, 2)
        assert.includeMembers(
            result.map(item => item.id),
            [1, 2]
        )

        // Get as a contractor:
        result = await getSut().listActive(2)
        assert.lengthOf(result, 3)
        assert.includeMembers(
            result.map(item => item.id),
            [1, 2, 5]
        )
    })
})
