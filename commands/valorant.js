const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('node:path');
const fs = require('node:fs');

const agentsPath = path.join(__dirname, 'valorant_agents');
const agents     = fs.readdirSync(agentsPath).filter(file => file.endsWith('.png'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('valorant')
		.setDescription('Komendy związane z Valorantem')
        .addSubcommand(subcommand =>
            subcommand
                .setName('agent')
                .setDescription('Losuje agenta')),

	async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'agent') {
			randomAgent = agents[Math.floor(Math.random() * agents.length)] 
			randomAgentPath = path.join(agentsPath, randomAgent);
			randomAgentName = randomAgent.replace('.png', '');
			await interaction.reply({ content: `Wylosowany agent to: **${randomAgentName}**`, files: [randomAgentPath]});
        } 
	},
};