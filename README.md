[![Version][version-shield]][version-shield-link]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]

[![MIT License][license-shield]][license-url]
[![CodeQL][codeql]][codeql-url]
[![Dependency Review][dependency-review]][dependency-review-url]
[![CodeFactor][code-factor]][code-factor-url]

# 🚀 Node - Multipurpose Discord Bot

**Node** is a multipurpose Discord bot that is built with [discord.js](https://github.com/discordjs/discord.js), a powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

[✉️ Invite Node][bot-invite] •  [📝 Bug & Request Feature][issues-url]

## 📊 Road Map

- [x] **Basic Bot**
- [x] **Music Bot**
- [x] **Moderation Bot**
- [x] **Information Bot**
- [ ] **Website**
- [ ] **Dashboard**
- [ ] **Documentation**

## 💡 Features

- **Advanced Logger**
- **Moderation Tools**
- **Music Streaming**
- **Server Management**
- **Highly Customizable**
- **Multi-Language Support**
- **Custom Scripts**
- **Advanced Error Handler**
- **Predefined Types**
- **Basic Sharding**
- **Advanced Validation**
- **Templates for Events, Commands & Contexts**

## 🔧 Requirements

Before you get started, you need to have the following:

- [![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download/) (Recommend LTS or Higher)
- [![Lavalink](https://img.shields.io/badge/Lavalink-7289DA?style=for-the-badge&logo=discord&logoColor=white)](https://github.com/lavalink-devs/lavalink) (V4 or Higher)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/try/download/community) (Required for MongoDB database)

## 🚀 Get Started

1. First clone the repository:

```bash
git clone https://github.com/rafisarkar0128/djs-prototype.git
```

2. Change to the directory:

```bash
cd Node
```

3. Install the required packages:

```bash
pnpm install # you can also use npm if you want
```

> [!NOTE]
> Install `pnpm` if you don't have it installed

```bash
npm install -g pnpm
```

4. Copy `example.lavalink-nodes.js` to `lavalink-nodes.js`

> [!IMPORTANT]
> If you are using external nodes then add them. For locally hosted node no need to add extra info.

5. Copy `.env.example` to `.env` and fill in all the required values.

6. Now go to [Discord Developer Page](https://discord.com/developers/applications) select your application and head to OAuth2 tab. In OAuth2 URL Generator select "bot" and "application.commands" scopes, scroll down select "Administrator" permission, copy the URL, open the URL and invite the bot to your server.

7. Start the bot:

```bash
# You can also use npm if you want
pnpm start
pnpm run dev # if you want to run in dev mode
```

8. Start using the bot. Use `/ping` or `/botinfo` commands.

> [!NOTE]
> By default, the bot loads slash commands globally. To load slash commands to a single server, go to `src/config.js`, in `bot` change value of `global` to `false`. This will make sure that the slash commands are available only in your server.

## 🗝️ Sharding

**Sharding** is not recommended for bots that are in less than **2,000 servers**. By default the bot runs without sharding. To enable sharding, start the bot like this:

```bash
pnpm run shard
pnpm run devShard # if you want to run in dev mode
```

## 📜 Commands

> [!NOTE]
> There will be a dedicated markdown file for commands in future.
> For now here are some public commands of the bot.

| Name     | Description                                     |
| -------- | ----------------------------------------------- |
| ping     | 🏓 Pong! Replies with bot's response time.      |
| botinfo  | 📖 View bot's information.                      |
| invite   | returns a link button with bot's invite URL.    |
| language | 🌐 Change your language for the bot.            |
| play     | ▶ Play songs or tracks from available sources. |
| purge    | 🧹 Delete bulk amount of messages.              |

## 🤝 Contributing

Please check the [issues page](https://github.com/rafisarkar0128/djs-prototype/issues) for open issues and feature requests.

Thank you for your interest in contributing to this project! Remember to follow these guidelines when contributing:

1. Fork the repository and create a new branch for your feature or bug fix.
2. Write clean and concise code that follows the established coding style.
3. Create detailed and thorough documentation for any new features or changes.
4. Write and run tests for your code.
5. Submit a pull request with your changes. Your contribution will be reviewed, and any necessary feedback or changes will be discussed with you.

💖 I appreciate your help in making this project better!

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## 👥 Contributors

Thanks go to these wonderful people for their contributions:

<a href="https://github.com/rafisarkar0128/djs-prototype/graphs/contributors">
<img src="https://contrib.rocks/image?repo=rafisarkar0128/djs-prototype" />
</a>

[bot-invite]: https://discord.com/oauth2/authorize?client_id=1030698369435320350
[version-shield]: https://img.shields.io/github/package-json/v/rafisarkar0128/djs-prototype?style=for-the-badge
[version-shield-link]: https://github.com/rafisarkar0128/djs-prototype
[contributors-shield]: https://img.shields.io/github/contributors/rafisarkar0128/djs-prototype?style=for-the-badge
[contributors-url]: https://github.com/rafisarkar0128/djs-prototype/graphs/contributors
[forks-shield]: https://img.shields.io/github/forks/rafisarkar0128/djs-prototype?style=for-the-badge
[forks-url]: https://github.com/rafisarkar0128/djs-prototype/network/members
[stars-shield]: https://img.shields.io/github/stars/rafisarkar0128/djs-prototype?style=for-the-badge
[stars-url]: https://github.com/rafisarkar0128/djs-prototype/stargazers
[issues-shield]: https://img.shields.io/github/issues/rafisarkar0128/djs-prototype?style=for-the-badge
[issues-url]: https://github.com/rafisarkar0128/djs-prototype/issues


[license-shield]: https://img.shields.io/github/license/rafisarkar0128/djs-prototype?style=for-the-badge
[license-url]: https://github.com/rafisarkar0128/djs-prototype/blob/master/LICENSE
[codeql]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/codeql.yml?style=for-the-badge&logo=github&label=Codeql
[codeql-url]: https://github.com/rafisarkar0128/djs-prototype/actions/workflows/codeql.yml
[dependency-review]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/dependency-review.yml?style=for-the-badge&label=Dependency%20Review&logo=github
[dependency-review-url]: https://github.com/rafisarkar0128/djs-prototype/actions?query=workflow%3A%22Dependency+Review%22
[code-factor]: https://img.shields.io/codefactor/grade/github/rafisarkar0128/node?logo=codefactor&logoColor=%23F44A6A&style=for-the-badge
[code-factor-url]: https://www.codefactor.io/repository/github/rafisarkar0128/node
