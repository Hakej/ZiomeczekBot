const { EmbedBuilder } = require('discord.js');

/** * @param {import('discord.js').Client} client */
module.exports = (client) => {
    sendRules();

    async function sendRules() {
        const embed = new EmbedBuilder()
            .setColor(0xFF0000)
            .setTitle('Zasady')
            .setDescription('Jeżeli nie będziesz przestrzegać zasad możesz zostać wyciszony lub wyrzucony z serwera.')
            .addFields(
                { name: 'Nie bądź dupek', value: 'Nie wyzywaj innych i nie klnij przesadnie.' },
                { name: 'Nie spamuj', value: 'One time is funny two times is f*cking annoying, no?' },
                { name: 'Nie postuj NSFW', value: 'Na tym serwerze mogą być młodsze osoby.' },
                { name: 'Nie promuj swoich rzeczy bez pozwolenia', value: 'Jeżeli chcesz coś zareklamować odezwij się do administracji.' },
            )
            .setTimestamp()
            .setFooter({ text: 'Nie zapomnij followować https://twitch.tv/hakej37'});

        const targetGuild = client.guilds.cache.get(process.env.guildId)
            || (await client.guilds.fetch(process.env.guildId));

        const targetChannel = targetGuild.channels.cache.get(process.env.ZASADY_CHANNEL_ID)
            || (await targetGuild.channels.fetch(process.env.ZASADY_CHANNEL_ID))

        targetChannel.send({ embeds: [embed] });
    }
}