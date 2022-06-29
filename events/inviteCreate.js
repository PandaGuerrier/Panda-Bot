const Invite = require("../utils/invite")

module.exports = {
    name: 'inviteCreate',
    async execute(invite) {
        new Invite().recharge(invite)
    }
}
