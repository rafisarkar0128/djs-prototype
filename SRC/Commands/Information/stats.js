const {
    ChatInputCommandInteraction,
    Client,
    SlashCommandBuilder,
    EmbedBuilder,
    version,
} = require("discord.js");
const { colour, owner, url } = require("../../config.json");
const { connection } = require("mongoose");
const moment = require("moment");
const pkg = require(`${process.cwd()}/package.json`);
require("../../Events/Client/ready.js");

function rState(val) {
    var status = " ";
    switch (val) {
        case 0:
            status = `\`🔴\` Disconnected`;
            break;
        case 1:
            status = `\`🟢\` Connected`;
            break;
        case 2:
            status = `\`🟡\` Connecting`;
            break;
        case 3:
            status = `\`🟣\` Disconnecting`;
            break;
    }
    return status;
}

module.exports = {
    developer: true,
    data: new SlashCommandBuilder()
        .setName("stats")
        .setDescription("Replies with current stats of the bot."),
    /**
     *
     * @param {ChatInputCommandInteraction} interaction
     * @param {Client} client
     */
    execute: async (interaction, client) => {
        let days = Math.floor(client.uptime / 86400000);
        let hours = Math.floor(client.uptime / 3600000) % 24;
        let minutes = Math.floor(client.uptime / 60000) % 60;
        let seconds = Math.floor(client.uptime / 1000) % 60;

        let webLatency = new Date() - interaction.createdAt;
        let apiLatency = client.ws.ping;

        let emLatency = {
            Green: "🟢",
            Yellow: "🟡",
            Red: "🔴",
        };

        const stats = new EmbedBuilder()
            .setColor(colour.main)
            .setTitle("GENERAL INFO")
            .setDescription(
                [
                    `**🪧 Name :** ${client.user.username} | ${client.user}`,
                    `**🏷️ Tag :** ${client.user.tag}`,
                    `\**⚙️ Version :** ${pkg.version}`,
                    `**👑 Owner :** @deleteduser`,
                    `**🌐 Website :** Coming soon.`,
                    `\n**\`\`\`\nStay tuned for more updates.\n\`\`\`**`,
                ].join("\n")
            )
            .setThumbnail(client.user.avatarURL({ dynamic: true, size: 4096 }))
            .addFields(
                {
                    name: "BOT INFO",
                    value: [
                        `**❕ Status** :  [\`🟢\`] Online`,
                        `**🏓 Ping** : ${client.ws.ping}ms`,
                        `**⏱️ Uptime** :\n\`\`\`\n${days}Days, ${hours}Hours, ${minutes}Minutes, ${seconds}Seconds\n\`\`\``,
                    ].join("\n"),
                },
                {
                    name: "DataBase INFO",
                    value: [
                        `**🪧 Name :** MongoDB`,
                        `**❕ Status :** ${rState(connection.readyState)}`,
                    ].join("\n"),
                },
                {
                    name: "HOST & LIBRARY INFO",
                    value: [
                        `**🪧 Name :** None`,
                        `📚 **Library :** discord.js | V•${version}`,
                    ].join("\n"),
                },
                {
                    name: "**GitHub Repository**",
                    value: [
                        `**🪧 Name :** ${client.user.username}`,
                        `**🔗 Link :** [deleteduser/Node](https://github.com/deleteduser/Node)`,
                    ].join("\n"),
                }
            );

        interaction.reply({
            embeds: [stats],
        });
    },
};
