# 🚀 djs-prototype - Multipurpose Discord Bot Template

**djs-prototype** is a multipurpose Discord bot and template repository built with [discord.js](https://github.com/discordjs/discord.js), a powerful [Node.js](https://nodejs.org) module that allows you to easily interact with the [Discord API](https://discord.com/developers/docs/intro).

## 🧪 Project Status

[![Version][version-shield]][version-shield-link]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![Support Server][support-shield]][support-server]
[![MIT License][license-shield]][license-url]
[![CodeQL][codeql]][codeql-url]
[![Dependency Review][dependency-review]][dependency-review-url]
[![CodeFactor][code-factor]][code-factor-url]
[![Last Commit][commit-shield]][commit-url]

## 📊 Project Snapshot

- [x] **Basic Bot**
- [x] **Music Bot**
- [x] **Moderation Bot**
- [x] **Information Bot**
- [ ] **Website** (cancelled)
- [ ] **Dashboard** (cancelled)
- [ ] **Documentation** (cancelled)

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
git clone [https://github.com/rafisarkar0128/djs-prototype.git](https://github.com/rafisarkar0128/djs-prototype.git)
```

2. Change to the directory:

```bash
cd djs-prototype
```

3. Install the required packages:

```bash
npm install
```

4. Copy `example.lavalinkNodes.js` to `lavalinkNodes.js`

> [!IMPORTANT]
> If you are using external nodes then add them. For locally hosted node make sure the host, port, and password are correct.

5. Copy `.env.example` to `.env` and fill in all the required values.
6. Now go to [Discord Developer Page](https://discord.com/developers/applications), select your application or create a new one if you don't have one. Then, head to the OAuth2 tab. In the OAuth2 URL Generator, select the "bot" and "application.commands" scopes, scroll down to select "Administrator" permission, copy the URL, open the URL, and invite the bot to your server.
7. Start the bot:

```bash
npm start
npm run dev # if you want to run in dev mode
```

8. Now you can start using the bot. Use the `/ping` or `/botinfo` command.

> [!NOTE]
> By default, the bot loads slash commands to a single server. To load slash commands globally, go to `src/config.js`, in `bot` object, change the value of `global` to `true`. This will make sure that the slash commands are available in every server the bot has access to.

## 🗝️ Sharding

**Sharding** is not recommended for bots that are in less than **2,000 servers**. By default the bot runs without sharding. To enable sharding, start the bot like this:

```bash
npm run shard
npm run devShard # if you want to run in dev mode
```

## 📜 Commands

Here are examples of some of the commands that are available in the bot:

| Name     | Description                                    |
| -------- | ---------------------------------------------- |
| ping     | 🏓 Pong! Replies with bot's response time.     |
| botinfo  | 📖 View bot's information.                     |
| invite   | Returns a link button with bot's invite URL.   |
| language | 🌐 Change your language for the bot.           |
| play     | ▶ Play songs or tracks from available sources. |
| purge    | 🧹 Delete bulk amount of messages.             |

## 🤝 Contributing

This project was previously in an inactive state and is undergoing active maintenance and architectural updates. Before full active community workflows resume, this repository is not accepting external pull requests, feature requests, or issue reports.

If you want to modify or improve this bot, you are welcome to fork this repository and maintain your own version.

Thank you to everyone who contributed and supported this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://www.google.com/search?q=LICENSE) file for details.

## 👥 Contributors

Thanks go to these wonderful people for their contributions:

## 🙏 Appreciation & Thanks

This project has been a meaningful part of my coding journey. While active feature development had paused, it is resuming as a dedicated template repository for anyone who wants to bootstrap their own Discord bot using Node.js and discord.js.

Thank you to everyone who supported this project, contributed ideas, tested features, and helped it grow.

I am especially thankful to the open-source ecosystem, including tools and communities around Node.js, discord.js, Lavalink, MongoDB, and many other resources that helped me learn, improve, and build with confidence.

Working on this project taught me a lot and helped me become a better developer. Thank you for being part of that journey.

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
[support-shield]: https://img.shields.io/discord/1054284394791178291?logo=discord&colorB=7289DA&style=for-the-badge
[support-server]: https://discord.gg/E6H9VvBdTk
[license-shield]: https://img.shields.io/github/license/rafisarkar0128/djs-prototype?style=for-the-badge
[license-url]: https://github.com/rafisarkar0128/djs-prototype/blob/master/LICENSE
[codeql]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/codeql.yml?style=for-the-badge&logo=github&label=Codeql
[codeql-url]: https://github.com/rafisarkar0128/djs-prototype/actions/workflows/codeql.yml
[dependency-review]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/dependency-review.yml?style=for-the-badge&label=Dependency%20Review&logo=github
[dependency-review-url]: https://github.com/rafisarkar0128/djs-prototype/actions?query=workflow%3A%22Dependency+Review%22
[code-factor]: https://img.shields.io/codefactor/grade/github/rafisarkar0128/djs-prototype?logo=codefactor&logoColor=%23F44A6A&style=for-the-badge
[code-factor-url]: https://www.codefactor.io/repository/github/rafisarkar0128/djs-prototype
[commit-shield]: https://img.shields.io/github/last-commit/rafisarkar0128/djs-prototype?style=for-the-badge
[commit-url]: https://github.com/rafisarkar0128/djs-prototype/commits/main
