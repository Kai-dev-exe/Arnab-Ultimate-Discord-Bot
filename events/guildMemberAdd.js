const { EmbedBuilder } = require('discord.js');
const { welcomeCollection } = require('../mongodb');
const data = require('../UI/banners/welcomecards');

async function loadWelcomeConfig() {
    try {
        const configs = await welcomeCollection.find().toArray();
        return configs.reduce((acc, config) => {
            acc[config.serverId] = config;
            return acc;
        }, {});
    } catch (err) {
        return {};
    }
}

function getOrdinalSuffix(number) {
    if (number === 11 || number === 12 || number === 13) {
        return 'th';
    }
    const lastDigit = number % 10;
    switch (lastDigit) {
        case 1:
            return 'st';
        case 2:
            return 'nd';
        case 3:
            return 'rd';
        default:
            return 'th';
    }
}

function truncateUsername(username, maxLength = 15) {
    return username.length > maxLength ? `${username.slice(0, maxLength)}...` : username;
}

function getRandomGif() {
    const gifThumbnails = [
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334809888479772724/Anime_Water_gif.gif?ex=679de214&is=679c9094&hm=11874b016fd59e787431074a10d88a2ddf52888e0177c8d78eecfd74b7a01be0&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334809980779499560/Blade_Runner_2049_2017_directed_by_Denis_Villeneuve_5_6.gif?ex=679de22a&is=679c90aa&hm=57207f0fed6e38c72a732d21f84a70f6fa1a045e3a7c6ff23f6f2d53582ae596&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810010928287794/Blue_Background_Anime_Lights_GIF_-_Blue_Background_Anime_Lights_-_Discover__Share_GIFs.gif?ex=679de232&is=679c90b2&hm=e9d1c81c4752b1575bbee10ce244cf83d65a3bf2b61f3231a0342293131f8d2a&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810062773817404/download_1.gif?ex=679de23e&is=679c90be&hm=a058ed0c61a35024e4b96a28c02d05f3ac6affec1f16e8fc8c789936da093b07&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810122651701299/download_2.gif?ex=679de24c&is=679c90cc&hm=ea3600939845dc2f4a02ea6f26c27328c952630c7ea5b3fd8ece83c587a8b0ed&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810248384348221/download_3.gif?ex=679de26a&is=679c90ea&hm=5ce7686bc54c43dcce4c595ae1be9c7c2d118cd36cd8ff1bbb6cbe4afa727a2c&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810248829210655/download_4.gif?ex=679de26a&is=679c90ea&hm=925aefd4d056953e61949a293effe5bf941fb82e6896b40477cec97d05d915b0&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810249328066570/download_5.gif?ex=679de26b&is=679c90eb&hm=70b84013c81334d746b6bd58f3ae98a962b41d1900dfcee6d7c93907ba10510c&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810309117874236/download_6.gif?ex=679de279&is=679c90f9&hm=22a5da30a9162e69557acf5c2f9019308813b98f8af0456fb149cb197e323140&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810309566926858/download_7.gif?ex=679de279&is=679c90f9&hm=265b60f20461a06ebfefc13185800cf91a6a6b617315974fd335f7ea3af7de32&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810309986095155/download_8.gif?ex=679de279&is=679c90f9&hm=e357c3f279933808c4d094111d60c671349b6057eb4995de5e8ce95de3ece709&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810310388875335/download_9.gif?ex=679de279&is=679c90f9&hm=7b2a71aaf2adf65ae8cb4a8c2b2cb372fbd0fd7dd7fadc4f40f157e80f81702c&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810498067206195/download_10.gif?ex=679de2a6&is=679c9126&hm=bf7c267a262adb10fdf3699d13d9c706d554a05000013a3e0005ab9e23dd48a6&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810498595684414/download.gif?ex=679de2a6&is=679c9126&hm=3e03f5319a7fd34ba57bf89f17e2bf0b7e77db1eb01670dab4cd4f9784e030ae&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810498968850495/Howls_Moving_Castle.gif?ex=679de2a6&is=679c9126&hm=b21b86c34e814a7bb4055a182d90dfaa43b267f0bb8480dd5d7d78a6e34e89e7&',
        'https://cdn.discordapp.com/attachments/1334801232358936628/1334810499367436308/Register_-_Login.gif?ex=679de2a6&is=679c9126&hm=28609a1d2de057240bec2830e97a861973df5c13d2d7508624c95b125110c53c&'
    ];
    return gifThumbnails[Math.floor(Math.random() * gifThumbnails.length)];
}
module.exports = async (client) => {
    let welcomeConfig = await loadWelcomeConfig();

    setInterval(async () => {
        welcomeConfig = await loadWelcomeConfig();
    }, 5000);

    client.on('guildMemberAdd', async (member) => {
        const guildId = member.guild.id;
        const settings = welcomeConfig[guildId];

        if (settings && settings.status) {
            const welcomeChannel = member.guild.channels.cache.get(settings.welcomeChannelId);
            if (welcomeChannel) {
                const memberCount = member.guild.memberCount;
                const suffix = getOrdinalSuffix(memberCount);
                const userName = truncateUsername(member.user.username);
                const joinDate = member.joinedAt.toDateString();
                const creationDate = member.user.createdAt.toDateString();
                const animatedIcon = 'https://cdn.discordapp.com/attachments/1180451693872287817/1334800525069389864/hearts-red-e.gif?ex=679dd95c&is=679c87dc&hm=e5543db816c2f39ae8ef1ddfd8332b1674297ece9365949ead9d9363247ffcac&'; // Replace with your APNG URL
                const gifThumbnail = getRandomGif();
                
                const embed = new EmbedBuilder()
    .setTitle("Welcome!")
    .setDescription(`${member}, You are the **${memberCount}${suffix}** member of our server!`)
    .setColor("#00e5ff")
    .setThumbnail(member.user.displayAvatarURL({ format: 'png', dynamic: true, size: 256 }))
    .setImage(gifThumbnail)
    .addFields(
        { name: 'Username', value: userName, inline: true },
        { name: 'Join Date', value: joinDate, inline: true },
        { name: 'Account Created', value: creationDate, inline: true }
    )
    .setFooter({ text: "We're glad to have you here!", iconURL: animatedIcon })
    .setAuthor({ name: userName, iconURL: member.user.displayAvatarURL() })
    .setTimestamp();

                
                welcomeChannel.send({
                    content: `Hey ${member}!`,
                    embeds: [embed]
                });                
            }
        }
    });
};
