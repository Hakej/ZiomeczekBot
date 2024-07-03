const Parser = require('rss-parser');

const parser = new Parser();

const fs = require('node:fs');
const lastCheckedVidDataPath = "./data/vidsThatWereAlreadyNotified.txt";
const youtubeChannelId =  process.env.YOUTUBE_CHANNEL_ID; //

/** * @param {import('discord.js').Client} client */
module.exports = (client) => {
    var lastCheckedVidId = fs.readFileSync(lastCheckedVidDataPath, 'utf-8'); 

    var notifiedVideos = fs.readFileSync(lastCheckedVidDataPath).toString().split("\n");

    console.log("Reading already notified videos..")
    console.log("###")
    for (i in notifiedVideos) {
        console.log(notifiedVideos[i]);
    }   
    console.log("###")

    checkYoutube();
    setInterval(checkYoutube, 60_000)

    async function checkYoutube() {
        try {
            const YOUTUBE_RSS_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${youtubeChannelId}`;

            const feed = await parser.parseURL(YOUTUBE_RSS_URL).catch((e) => null);

            if (!feed?.items.length) return;

            const latestVideo = feed.items[0];
            const latestVideoId = latestVideo.id.split(':')[2]

            if (notifiedVideos.includes(latestVideoId)) return;

            const targetGuild = client.guilds.cache.get(process.env.guildId)
                || (await client.guilds.fetch(process.env.guildId));

            const targetChannel = targetGuild.channels.cache.get(process.env.NOWE_FILMY_CHANNEL_ID)
                || (await targetGuild.channels.fetch(process.env.NOWE_FILMY_CHANNEL_ID))

            console.log("There's a new YT video, id: " + latestVideoId);

            lastCheckedVidId = latestVideoId
            fs.appendFile(lastCheckedVidDataPath, "\n" + latestVideoId, function (err) {
                if (err) throw err;
                console.log('Saved!');
                notifiedVideos.push(latestVideoId);
            });

            var latestVideoUrl = `https://www.youtube.com/watch?v=${latestVideoId}`

            targetChannel.send(`<@&${process.env.NOWE_FILMY_ROLE_ID}> ten śmierdziel dodał nowy filmik, oglądajta! -> ${latestVideoUrl}`);
            //console.log((`<@&${process.env.NOWE_FILMY_ROLE_ID}> ten śmierdziel dodał nowy filmik, oglądajta! -> ${latestVideoUrl}`));
        } catch (error) {
            console.log(`Error in ${__filename}:\n`, error);
        }
    }

}