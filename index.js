const Discord = require("discord.js")
const PandaClient = require("./utils/client")
require('dotenv').config()

new PandaClient(process.env.TOKEN).login()

