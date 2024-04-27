const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, GatewayIntentBits } = require('discord.js');
const { executeCommand } = require('./executeCommand');
require('dotenv').config()

const client = new Client({ intents: [
	GatewayIntentBits.Guilds,
	GatewayIntentBits.GuildMessages,
	GatewayIntentBits.MessageContent,
	GatewayIntentBits.GuildMembers,
],
});

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

const twitchUrl = "https://www.twitch.tv/hakej37";
const pingujStreamkaRoleId = "1233023903836934206";
const pingujStreamkaChannelId = "1233023855673479199";
const cyfrowyAfganistanId = "1233197213509881878";

const youtubeChecker = require('./youtube-checker');
youtubeChecker(client);

client.once('ready', () => {
	console.log("BOTej37 is ready!");

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
	const status = "https://twitch.tv/hakej37";

	client.user.setPresence({
		status: 'online',
		activities: 
			[{
				name: status,
				type: 1, 
				url: `${status}`
			}]
	})
}

var isStreaming = true;

async function checkIfStreaming() {
	const response = await fetch("https://api.twitch.tv/helix/streams?user_id=111935077", {
		method: 'GET',
		headers: {
			'Client-ID': process.env.TWITCH_BOTEJ_CLIENT_ID,
			'Authorization': 'Bearer ' + process.env.TWITCH_BOTEJ_CLIENT_OAUTH
		}
	});

	var stream = await response.json();
	var wasStreaming = isStreaming;
	isStreaming = stream.data.length > 0;

	if (wasStreaming != isStreaming && isStreaming) 
	{
		client.channels.fetch(pingujStreamkaChannelId)
		.then(channel => {
			channel.send(`<@&${pingujStreamkaRoleId}> ten leniuch odpalił streamka, wbijajta! -> ${twitchUrl}`);
		})
	}
}

setInterval(checkIfStreaming, 60 * 1000);

function sendRulesMessage() {
	const sendRulesMessage = require('./functions/sendRulesMessage');
	sendRulesMessage(client);
}

client.login(process.env.token);