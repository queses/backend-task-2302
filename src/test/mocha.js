process.env.SEQUELIZE_STORAGE = ':memory:'
process.env.SEQUELIZE_NO_LOG = '1'

const { sequelize } = require('../model')

beforeEach(async () => {
    await sequelize.sync({ force: true })
})

after(async () => {
    await sequelize.close()
})
