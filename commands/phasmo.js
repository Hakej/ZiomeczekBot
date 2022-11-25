const { SlashCommandBuilder } = require('@discordjs/builders');
const path = require('node:path');
const fs = require('node:fs');

const mapsPath = path.join(__dirname, 'phasmophobia_maps');
const maps = fs.readdirSync(mapsPath).filter(file => file.endsWith('.png'));

const cpMapsPath = path.join(__dirname, 'phasmophobia_cursed_possessions');
const cpMaps = fs.readdirSync(cpMapsPath).filter(file => file.endsWith('.png'));

module.exports = {
	data: new SlashCommandBuilder()
		.setName('phasmo')
		.setDescription('Komendy związane z Phasmophobią')
        .addSubcommand(subcommand =>
            subcommand
                .setName('mapa')
                .setDescription('Losuje mape'))

		.addSubcommand(subcommand =>
			subcommand
				.setName('cp')
				.setDescription('Pokazuje mape z przekletymi przedmiotami')
				.addStringOption(option => 
					option.setName('mapa')
						.setDescription('Mapa jaka chcesz zobaczyc')
						.setRequired(true))),

	async execute(interaction) {
        const subCommand = interaction.options.getSubcommand();

        if (subCommand === 'mapa') {
			randomMap = maps[Math.floor(Math.random() * maps.length)] 
			randomMapPath = path.join(mapsPath, randomMap);
			randomMapName = randomMap.replace('.png', '');
			await interaction.reply({ content: `Wylosowana mapa to: **${randomMapName}**`, files: [randomMapPath]})
        } 
		else if (subCommand === 'cp')
		{
			const requestedMapName = interaction.options.getString('mapa');
			const map = cpMaps.filter(element => element.toLowerCase().includes(requestedMapName.toLowerCase()))[0];
			
			if (!map)
			{
				interaction.reply("Nie mogłem znaleźć mapy.");
				return;
			}

			mapPath = path.join(cpMapsPath, map);
			mapName = map.replace('.png', '');

			await interaction.reply({ content: `**${mapName}**`, files: [mapPath]})
		}
	},
};