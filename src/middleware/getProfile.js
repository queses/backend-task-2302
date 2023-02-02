const { sequelize } = require('../model')
const { callbackify } = require('util')

// Use `callbackify` to catch errors in async function:
const getProfile = callbackify(async (req, res, next) => {
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
