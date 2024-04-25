const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
const { executeCommand } = require('./executeCommand');
require('dotenv').config()

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	console.log(`Read command "${command.data.name}".`);
	// Set a new item in the Collection
	// With the key as the command name and the value as the exported module
	client.commands.set(command.data.name, command);
}

client.once('ready', () => {
	console.log("Ziomeczek is ready!");

	setStatus();
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);

	if (!command) return;

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(error);
		await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

async function setStatus() {
	/*
	const currentTemp = await getCurrentTemp();
	const status = `${currentTemp}`;
	*/
	/*
	const currentIp = await getExternalIp();
	const status = `${currentIp}`;
	*/

	const status = "hakej.ddns.net";

	client.user.setPresence({
		status: 'online',
		activities: 
			[{
				name: status,
				type: 1, // There is ActiveTypes enum but for some reason this module won't work for me
				url: `http://${status}`
			}]
	})
}

setTimeout(function() {
	setInterval(setStatus, 60000)
})

async function getCurrentTemp() {
	try {
		const temp = await executeCommand("/usr/bin/vcgencmd measure_temp");
		return temp;
	} catch(e) {
		return "69°";
	}
}

async function getExternalIp() {
	try {
		const ip = await executeCommand("curl icanhazip.com");
		return ip;
	} catch(e) {
		return "0.0.0.0"
	}
}

client.login(process.env.token);
