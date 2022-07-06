const Invite = require("../utils/invite")

module.exports = {
    name: 'inviteDelete',
    async execute(invite) {
        new Invite().refresh(invite)
    }
}
