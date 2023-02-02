const { assert } = require('chai')
const { sequelize } = require('../model')
const fixtures = require('../test/fixtures')
const { ContractsService } = require('./ContractsService')

describe('ContractsService', () => {
    const { models } = sequelize

    function getSut() {
        return new ContractsService(sequelize)
    }

    it('should get by id', async () => {
        await Promise.all([
            models.Profile.create({ ...fixtures.Profile.client, id: 1 }),
            models.Profile.create({ ...fixtures.Profile.contractor, id: 2 }),
            models.Profile.create({ ...fixtures.Profile.client, id: 3 }),

            models.Contract.create({
                ...fixtures.Contract.new,
                id: 1,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.new,
                id: 2,
                ClientId: 3,
                ContractorId: 2
            })
        ])

        // Get clients's contract:
        let result = await getSut().getById(1, 1)
        assert.isNotNull(result)
        assert.deepOwnInclude(result.dataValues, {
            ...fixtures.Contract.new,
            id: 1,
            ClientId: 1,
            ContractorId: 2
        })

        // Get contractor's contract:
        result = await getSut().getById(2, 1)
        assert.isNotNull(result)
        assert.deepOwnInclude(result.dataValues, {
            ...fixtures.Contract.new,
            id: 1,
            ClientId: 1,
            ContractorId: 2
        })

        // Get other user's contract:
        result = await getSut().getById(1, 2)
        assert.isNull(result)
    })

    it('should get non terminated', async () => {
        await Promise.all([
            models.Profile.create({ ...fixtures.Profile.client, id: 1 }),
            models.Profile.create({ ...fixtures.Profile.contractor, id: 2 }),
            models.Profile.create({ ...fixtures.Profile.client, id: 3 }),

            models.Contract.create({
                ...fixtures.Contract.new,
                id: 1,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.new,
                id: 2,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.inProgress,
                id: 3,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.terminated,
                id: 4,
                ClientId: 1,
                ContractorId: 2
            }),
            models.Contract.create({
                ...fixtures.Contract.new,
                id: 5,
                ClientId: 3,
                ContractorId: 2
            })
        ])

        // Get as a client:
        let result = await getSut().getNonTerminated(1)
        assert.lengthOf(result, 3)
        assert.includeMembers(
            result.map(item => item.id),
            [1, 2, 3]
        )

        // Get as a contractor:
        result = await getSut().getNonTerminated(2)
        assert.lengthOf(result, 4)
        assert.includeMembers(
            result.map(item => item.id),
            [1, 2, 3, 5]
        )
    })
})
