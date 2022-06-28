const sqlite3 = require('sqlite3').verbose()

function getDB() {
	const db = new sqlite3.Database('database.db', sqlite3.OPEN_READWRITE, (err) => {
		if (err) {
			console.error(err.message)
		}
	})
	return db
}

function registerAllDB() {
	const db = getDB()
	const tables = [
		{name: 'GiveAway',	columns: [	{ name: 'id', type: 'INT' }, { name: 'channelId', type: 'VARCHAR' }, { name: 'lot', type: 'VARCHAR' },	{ name: 'gagnants', type: 'INT' }, { name: 'idMsg', type: 'VARCHAR' }]},
		{name: 'bots',	columns: [{ name: 'id', type: 'VARCHAR' },	{ name: 'pseudo', type: 'VARCHAR' },]},
		{name: 'inviter', columns: [{ name: 'id', type: 'VARCHAR' }, { name: 'pseudo', type: 'VARCHAR' }, { name: 'numero', type: 'INT' }, { name: 'partie', type: 'INT' }, { name: 'normal', type: 'INT' }, { name: 'bonus', type: 'INT' }]},
		{name: 'users',	columns: [{ name: 'id', type: 'VARCHAR' }, { name: 'code', type: 'VARCHAR' }, { name: 'inviterName', type: 'VARCHAR' },	{ name: 'inviterId', type: 'INT' },]},
		{name: 'setup',	columns: [{ name: 'id', type: 'VARCHAR' }, { name: 'channelId', type: 'VARCHAR' }, { name: 'actif', type: 'BOOLEAN' },]}
	]

	tables.forEach(table => {
		db.run(`CREATE TABLE IF NOT EXISTS ${table.name} (${table.columns.map(column => column.name + ' ' + column.type).join(', ')})`) 
	})
}

module.exports = {
	getDB,
	registerAllDB
}