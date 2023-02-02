const { sequelize } = require('../model')
const { asyncHandler } = require('../util')

const getProfile = asyncHandler(async (req, res, next) => {
    const { Profile } = sequelize.models

    const profile = await Profile.findOne({
        where: { id: req.get('profile_id') || 0 }
    })

    if (!profile) {
        return res.status(401).end()
    }

    req.profile = profile
    next()
})

module.exports = { getProfile }
