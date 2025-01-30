const { SlashCommandBuilder } = require('@discordjs/builders');
const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');
const { serverConfigCollection } = require('../../mongodb');
const cmdIcons = require('../../UI/icons/commandicons');
const categoryGifs = {
    "Bot Information": "https://cdn.discordapp.com/attachments/1180451693872287817/1334480756856193034/standard_1.gif?ex=679caf8d&is=679b5e0d&hm=a1c9a55319e011a07c79b9aa59f02832f1d1f5bf11c291d5fcf8add0ca9637cf&",
    "Anime Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334479205248798790/download_4.gif?ex=679cae1b&is=679b5c9b&hm=649a93cdfba21e89ca9fcfeb12700435024f26b60747546af2aba10a2eac76b0&",
    "Basic Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334484038714527784/Pink_aesthetic_background.gif?ex=679cb29c&is=679b611c&hm=56e818d763eb52ba6e377ebaf55658e1e8db8713ae28a7cc18fbc0e68117fb67&",
    "Distube music Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334473436726300672/download_1.gif?ex=679ca8bc&is=679b573c&hm=8ed89a18823f44066946ab5bc417b47d07aa2a55b9486fb52f337ad0b1b99618&",
    "Fun Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334474563475738695/Clooney_Loved_Slapping_Down_Daily_Mail.gif?ex=679ca9c9&is=679b5849&hm=a15a566a1034ef29f40c8e631647a01727331efa7eba0a3ba15c27589196b4a4&",
    "Moderation Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334475486587260959/download_3.gif?ex=679caaa5&is=679b5925&hm=2f069183ac23cd5d0d49c9abc3ea40e66d70e88db47a03deb575c7cebda0d826&",
    "Setup Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334476027799535680/What_are_the_Naruto_hand_seals_based_on_.gif?ex=679cab26&is=679b59a6&hm=ba3d1cff1645ada94d0f965d7e43adc3ed0cbd8f9d9314ae1807a65a2f846ecf&",
    "Utility Commands": "https://cdn.discordapp.com/attachments/1180451693872287817/1334476383665131531/s.gif?ex=679cab7b&is=679b59fb&hm=8b548e65be23c243b1d654c96e9ee7ef7a0232dcd5da02de74ebdb18d7cf7c0b&"
};
module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Displays a list of commands'),

    async execute(interaction) {
        if (interaction.isCommand && interaction.isCommand()) {

            const serverId = interaction.guildId;
            let serverConfig;
            try {
                serverConfig = await serverConfigCollection.findOne({ serverId });
            } catch (err) {
                console.error('Error fetching server configuration from MongoDB:', err);
            }

            const serverPrefix = serverConfig && serverConfig.prefix ? serverConfig.prefix : config.prefix;

            const createSlashCommandPages = () => {
                const pages = [];

                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(config.categories).filter(category => config.categories[category]);
                const disabledCategoriesList = Object.keys(config.categories).filter(category => !config.categories[category]);

                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };

                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };

                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');

                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);

                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);

                const totalCommands = totalCommandFiles + totalExcessCommandFiles;

                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**💜 Bot Developer:** Arnab` +
                        `**Bot Version:** 1.2.0\n` +
                        `**Total Servers:** ${totalServers}\n` +
                        `**Total Members:** ${totalMembers}\n` +
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n` +
                        `**Total Commands:** ${totalCommands}\n` +
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n` +
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    color: "#3498db",
                    author: {
                        name: 'Arnab Ultimate 1',
                        iconURL: "https://cdn.discordapp.com/attachments/1246408947708072027/1255167194036437093/1558-zerotwo-exciteddance.gif?ex=667c250a&is=667ad38a&hm=09e6db36fd79436eb57de466589f21ca947329edd69b8e591d0f6586b89df296&",
                        url: "https://discord.gg/qX9ugahuqh"
                    }
                });

                const commandData = {};

                for (const folder of commandFolders) {
                    if (config.categories[folder]) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../commands/${folder}`)).filter(file => file.endsWith('.js'));
                        commandData[folder] = commandFiles.map(file => {
                            const command = require(`../../commands/${folder}/${file}`);
                            return command.data.name;
                        });
                    }
                }

                for (const [category, commands] of Object.entries(commandData)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Both Slash commands and Prefix\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command}\`\``),
                        color: "#3498db",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            url: "https://discord.gg/qX9ugahuqh"
                        }
                    };

                    pages.push(page);
                }

                return pages;
            };

            const createPrefixCommandPages = () => {
                const pages = [];
                const totalServers = interaction.client.guilds.cache.size;
                const totalMembers = interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0);
                const uptime = process.uptime();
                const uptimeHours = Math.floor(uptime / 3600);
                const uptimeMinutes = Math.floor((uptime % 3600) / 60);
                const uptimeSeconds = Math.floor(uptime % 60);

                const enabledCategoriesList = Object.keys(config.categories).filter(category => config.categories[category]);
                const disabledCategoriesList = Object.keys(config.categories).filter(category => !config.categories[category]);

                const countJsFiles = (dir) => {
                    try {
                        if (fs.existsSync(dir)) {
                            return fs.readdirSync(dir).filter(file => file.endsWith('.js')).length;
                        }
                        return 0;
                    } catch (err) {
                        console.error(`Error reading directory ${dir}:`, err);
                        return 0;
                    }
                };

                const getDirectories = (src) => {
                    return fs.readdirSync(src).filter(file => fs.statSync(path.join(src, file)).isDirectory());
                };

                const commandsDir = path.join(__dirname, '../../commands');
                const excessCommandsDir = path.join(__dirname, '../../excesscommands');

                const commandFolders = getDirectories(commandsDir);
                const totalCommandFiles = commandFolders.reduce((total, folder) => {
                    const folderPath = path.join(commandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);

                const excessCommandFolders = getDirectories(excessCommandsDir);
                const totalExcessCommandFiles = excessCommandFolders.reduce((total, folder) => {
                    const folderPath = path.join(excessCommandsDir, folder);
                    return total + countJsFiles(folderPath);
                }, 0);

                const totalCommands = totalCommandFiles + totalExcessCommandFiles;

                pages.push({
                    title: 'Bot Information',
                    description: `Welcome to the help command! This bot provides a variety of commands to enhance your server experience. Below are the categories and the number of commands available in each.`,
                    commands: [
                        `**💜 Bot Developer:** Arnab` +
                        `**Bot Version:** 1.2.0\n` +
                        `**Total Servers:** ${totalServers}\n` +
                        `**Total Members:** ${totalMembers}\n` +
                        `**Bot Uptime:** ${uptimeHours}h ${uptimeMinutes}m ${uptimeSeconds}s\n` +
                        `**Total Commands:** ${totalCommands}\n` +
                        `**Enabled Categories:** ${enabledCategoriesList.join(', ')}\n` +
                        `**Disabled Categories:** ${disabledCategoriesList.join(', ')}\n`,
                    ],
                    color: "#3498db",
                    author: {
                        name: 'Arnab Ultimate 1',
                        iconURL: "https://cdn.discordapp.com/attachments/1246408947708072027/1255167194036437093/1558-zerotwo-exciteddance.gif?ex=667c250a&is=667ad38a&hm=09e6db36fd79436eb57de466589f21ca947329edd69b8e591d0f6586b89df296&",
                        url: "https://discord.gg/qX9ugahuqh"
                    }
                });

                const prefixCommands = {};

                for (const [category, isEnabled] of Object.entries(config.excessCommands)) {
                    if (isEnabled) {
                        const commandFiles = fs.readdirSync(path.join(__dirname, `../../excesscommands/${category}`)).filter(file => file.endsWith('.js'));
                        prefixCommands[category] = commandFiles.map(file => {
                            const command = require(`../../excesscommands/${category}/${file}`);
                            return {
                                name: command.name,
                                description: command.description
                            };
                        });
                    }
                }

                for (const [category, commands] of Object.entries(prefixCommands)) {
                    const page = {
                        title: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                        description: `**Total Commands : **${commands.length}\n` +
                            `**Usage : **Only Prefix commands with \`${serverPrefix}\`\n\n` +
                            `${category.charAt(0).toUpperCase() + category.slice(1)} related commands`,
                        commands: commands.map(command => `\`\`${command.name}\`\``),
                        color: "#3498db",
                        author: {
                            name: `${category.charAt(0).toUpperCase() + category.slice(1)} Commands`,
                            url: "https://discord.gg/qX9ugahuqh"
                        }
                    };

                    pages.push(page);
                }

                return pages;
            };

            const slashCommandPages = createSlashCommandPages();
            const prefixCommandPages = createPrefixCommandPages();
            let currentPage = 0;
            let isPrefixHelp = false;

            const createEmbed = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                const page = pages[currentPage];
            
                if (!page) {
                    console.error('Page is undefined');
                    return new EmbedBuilder().setColor('#3498db').setTitle('Error').setDescription('Page not found.');
                }
            
                const fieldName = page.title === "Bot Information" ? "Additional Information" : "Commands";
                const color = page.color || '#3498db'; // Ensure a valid color is always set
            
                // Get the appropriate GIF URL based on the category name
                const gifURL = categoryGifs[page.title] || "https://example.com/default-gif.gif"; // Default GIF if no specific one is found
            
                return new EmbedBuilder()
                    .setTitle(page.title)
                    .setDescription(page.description)
                    .setColor(color)
                    .setAuthor({ name: page.author.name, iconURL: page.author.iconURL, url: page.author.url })
                    .addFields({ name: fieldName, value: page.commands.join(', ') })
                    .setImage(gifURL); // Add the GIF as the image in the embed
            };
            

            const createActionRow = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setCustomId('previous1')
                            .setLabel('Previous')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === 0),
                        new ButtonBuilder()
                            .setCustomId('next2')
                            .setLabel('Next')
                            .setStyle(ButtonStyle.Primary)
                            .setDisabled(currentPage === pages.length - 1),
                        new ButtonBuilder()
                            .setCustomId('prefix')
                            .setLabel(isPrefixHelp ? 'Normal Command List' : 'Excess Command List')
                            .setStyle(ButtonStyle.Secondary)
                    );
            };

            const createDropdown = () => {
                const pages = isPrefixHelp ? prefixCommandPages : slashCommandPages;
                return new ActionRowBuilder()
                    .addComponents(
                        new StringSelectMenuBuilder()
                            .setCustomId('page-select')
                            .setPlaceholder('Select a page')
                            .addOptions(pages.map((page, index) => ({
                                label: page.title,
                                value: index.toString()
                            })))
                    );
            };

            await interaction.reply({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });

            const collector = interaction.channel.createMessageComponentCollector({ time: 60000 });

            collector.on('collect', async (button) => {
                if (button.user.id !== interaction.user.id) return;

                if (button.isButton()) {
                    if (button.customId === 'previous1') {
                        currentPage = (currentPage - 1 + (isPrefixHelp ? prefixCommandPages : slashCommandPages).length) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'next2') {
                        currentPage = (currentPage + 1) % (isPrefixHelp ? prefixCommandPages : slashCommandPages).length;
                    } else if (button.customId === 'prefix') {
                        isPrefixHelp = !isPrefixHelp;
                        currentPage = 0;
                    }
                } else if (button.isSelectMenu()) {
                    currentPage = parseInt(button.values[0]);
                }

                try {
                    await button.update({ embeds: [createEmbed()], components: [createDropdown(), createActionRow()] });
                } catch (error) {
                    console.error('Error updating the interaction:', error);
                }
            });

            collector.on('end', async () => {
                try {
                    await interaction.editReply({ components: [] });
                } catch (error) {
                    console.error('Error editing the interaction reply:', error);
                }
            });
        } else {
            const embed = new EmbedBuilder()
                .setColor('#3498db')
                .setAuthor({ 
                    name: "Alert!", 
                    iconURL: cmdIcons.dotIcon,
                    url: "https://discord.gg/qX9ugahuqh"
                })
                .setDescription('- This command can only be used through slash command!\n- Please use `/help`')
                .setTimestamp();

            await interaction.reply({ embeds: [embed] });
        } 
    }
};
