const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Intents } = require('discord.js');
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
	console.log('Ready!');
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

var minutesSpentRunning = 0;

function countAndLogMinutesSpentRunning() {
	minutesSpentRunning += 1
	console.log(`Running for ${minutesSpentRunning} minutes.`)
}

setTimeout(function() {
	setInterval(countAndLogMinutesSpentRunning, 60000)
})

client.login(process.env.token);

function purgeCommands() {
    const guildId = process.env.guildId;
    const guild = client.guilds.cache.get(guildId);

    console.log('Purging commands...');

    // This takes ~0 hour to update
    client.application.commands.set([]);
    // This updates immediately
    guild.commands.set([]);

    console.log('Finished purging commands.');
}