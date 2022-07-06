const { Sequelize } = require('sequelize');
function getDB() {
	return console.log("bite")
}

function registerAllDB(client) {
	const tables = [
		{ name: 'GiveAway', columns: { id: { type: Sequelize.STRING, primaryKey: true, }, users: { type: Sequelize.TEXT }, winners: { type: Sequelize.INTEGER }, lot: { type: Sequelize.STRING }, channelId: { type: Sequelize.STRING }, messageId: { type: Sequelize.STRING }, } },
		{ name: 'Bots', columns: { id: { type: Sequelize.STRING, primaryKey: true }, pseudo: { type: Sequelize.STRING } } },
		{ name: 'Inviter', columns: { id: { type: Sequelize.STRING, primaryKey: true }, pseudo: { type: Sequelize.STRING }, numero: { type: Sequelize.INTEGER }, partie: { type: Sequelize.INTEGER }, normal: { type: Sequelize.INTEGER }, bonus: { type: Sequelize.INTEGER } } },
		{ name: 'Users', columns: { id: { type: Sequelize.STRING, primaryKey: true }, code: { type: Sequelize.STRING }, inviterName: { type: Sequelize.STRING }, inviterId: { type: Sequelize.STRING } } },
		{ name: 'Setup', columns: { id: { type: Sequelize.STRING, primaryKey: true }, actif: { type: Sequelize.STRING }, channelId: { type: Sequelize.STRING } } }
	]

	tables.map(table => {
		const tableCreated = client.db.define(table.name, table.columns, { timestamps: false })
		tableCreated.sync()
	})
}

module.exports = {
	getDB,
	registerAllDB
}