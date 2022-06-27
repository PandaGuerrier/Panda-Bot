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
		{
			name: 'GiveAway',
			columns: [
				{ name: 'id', type: 'INT' },
				{ name: 'channelId', type: 'VARCHAR' },
				{ name: 'lot', type: 'VARCHAR' },
				{ name: 'gagnants', type: 'INT' },
				{ name: 'idMsg', type: 'VARCHAR' }
			]
		}
	]
	const rowtruc = db.get(`SELECT * FROM GiveAway`)
	if (!rowtruc) db.each(`CREATE TABLE IF NOT EXISTS 'GiveAway' ('id' VARCHAR, 'channelId' VARCHAR, 'lot' VARCHAR, 'gagnants' INT, idMsg VARCHAR)`)

	db.each(`SELECT * FROM bots`, (err, row) => {
		if (!row) {
			db.each("CREATE TABLE IF NOT EXISTS 'bots' ('id' VARCHAR, 'pseudo' VARCHAR);")
		}
	})

	db.each(`SELECT * FROM inviter`, (err, row) => {
		if (!row) db.each("CREATE TABLE IF NOT EXISTS 'inviter' ('id' VARCHAR, 'pseudo' VARCHAR, 'numero' INT, 'partie' INT, 'normal' INT, 'bonus' INT)")
	})

	db.each(`SELECT * FROM users`, (err, row) => {
		if (!row) db.each("CREATE TABLE IF NOT EXISTS 'users' ('inviterId' VARCHAR, 'inviterName' VARCHAR, 'id' VARCHAR, 'code' VARCHAR)")
	})

	db.each(`SELECT * FROM setup`, (err, row) => {
		if (!row) db.each("CREATE TABLE IF NOT EXISTS 'setup' ('id' VARCHAR, 'channelId' VARCHAR,	'actif' BOOLEAN)") && console.log("BBD : ✔️ ")
	})
}

module.exports = {
	getDB,
	registerAllDB
}