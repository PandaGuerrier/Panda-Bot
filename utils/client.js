const anticrash = require("./anticrash")
const files = require("./nodeFiles.js")
const { Collection, Client } = require("discord.js")
const { Sequelize } = require('sequelize');
const { registerAllDB } = require("../utils/database")
const { Player } = require("discord-player");

class PandaClient {
    constructor(token) {
        this.token = token
    }
    login() {
        const client = new Client({ fetchAllMembers: true, partials: ['MESSAGE', 'CHANNEL', 'REACTION'], intents: 32767, presence: { status: "online" } })

        client.db = new Sequelize({
            dialect: 'sqlite',
            storage: './database.db',
            define: {
                freezeTableName: true
            },
            //logging: false
        });

        registerAllDB(client)
        files(client)
        anticrash()

        client.commands = new Collection()
        client.invites = new Collection()
        client.player = new Player(client)

        client.login(this.token)
    }
}

module.exports = PandaClient




/*

Pour mieux réexpliquer : 
- Une meilleure utilisation de la bdd : que ce soit pour la conception : avec les tables du giveaway par exemple ; ou pour l'utilisation : un orm ce sera toujours mieux que de faire ses requêtes comme tu les fait là
- Bonne maîtrise du langage : tout ce que je t'avais déjà dit sur les mélanges de async/await fonctions callback et .then; la structure du code qui devient de plus en plus illisible au fur et a mesure que tu rajoute des éléments (ex : boutonInteraction.js) + c'est mélangé, ce n'est pas les commentaires qui feront que ton code sera mieux structuré
réduire un maximum ton nombre d'indentation (la plupart sont inutiles) selon moi ça nuit grandement a la lisibilité surtout sur des gros fichiers

*/