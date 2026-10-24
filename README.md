# 🚀 Djs-Prototype - Enterprise Discord Bot Template

**Djs-Prototype** is an enterprise-grade, modular Discord bot template built with [discord.js](https://github.com/discordjs/discord.js). It is designed with a strict Domain-Driven Design (DDD) architecture, providing a robust foundation for building highly scalable, decoupled, and maintainable bots.

## 🧪 Project Status

[![Version][version-shield]][version-shield-link]
[![Contributors][contributors-shield]][contributors-url]
[![Forks][forks-shield]][forks-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![CodeQL][codeql]][codeql-url]
[![Dependency Review][dependency-review]][dependency-review-url]
[![CodeFactor][code-factor]][code-factor-url]
[![Last Commit][commit-shield]][commit-url]

## 🏷 Architectural Features

This template isn’t just a collection of files; it’s a framework designed around modern software engineering principles:

- **Domain-Driven Design (DDD):** Strict separation of concerns between Domain entities, Application services, Infrastructure adapters, and Presentation routers.
- **Inversion of Control (IoC) Container:** A built-in dependency injection system (`client.getService()`) to manage repositories, domain services, and external clients cleanly.
- **SLF4J-Style Logger:** A highly customizable, scoped logging system with dynamic stack-tracing, file output, and severity filtering.
- **ESM & NodeNext:** Fully converted to ES2024 standard using Native ESM and subpath imports (e.g., `#core/*`, `#modules/*`) for clean dependency resolution.
- **Inbound & Outbound Adapters:** Discord events are treated as infrastructure adapters, keeping your core business logic entirely decoupled from the discord.js gateway.
- **Advanced Error Handling:** Global AntiCrash boundaries and graceful shutdown lifecycles.
- **Plugin Ecosystem Ready:** (In Development) Built to support modular, drop-in plugins for features like Music, Moderation, and Utility.
- **Templates:** Clean, strongly-typed object templates for Events, Slash Commands, and Context Menus.

## 🔧 Requirements

Before you get started, you need to have the following:

- [![Node.JS](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/download/) (Recommend LTS v22 or Higher)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/try/download/community) (Required for MongoDB database)

## 🚀 Get Started

1. First clone the repository:

```bash
git clone https://github.com/rafisarkar0128/djs-prototype.git
```

2. Change to the directory:

```bash
cd djs-prototype
```

3. Install the required packages:

> [!NOTE]
> I recommend using [pnpm](https://pnpm.io/) for package management. If you want to use npm, you can replace `pnpm` with `npm` in the following commands below.

```bash
pnpm install
```

4. Copy `.env.example` to `.env` and fill in all the required values. 5. Now go to [Discord Developer Page](https://discord.com/developers/applications), select your application or create a new one if you don't have one. Then, head to the OAuth2 tab. In the OAuth2 URL Generator, select the "bot" and "application.commands" scopes, scroll down to select "Administrator" permission, copy the URL, open the URL, and invite the bot to your server. 6. Start the bot:

```bash
pnpm start
pnpm run dev # if you want to run in dev mode
```

5. Now you can start using the bot. Use the `/ping` or `/botinfo` command.

> [!IMPORTANT]
> By default, the bot loads slash commands to a single server. To load slash commands globally, in your `.env` file, change the value of `GLOBAL_COMMANDS` to `true`. This will make sure that the slash commands are available in every server the bot has access to.

## 🗑️ Sharding

**Sharding** is not recommended for bots that are in less than **2,000 servers**. By default the bot runs without sharding. To enable sharding, start the bot like this:

```bash
pnpm run shard
pnpm run devShard # if you want to run in dev mode
```

## 🏗 Project Structure

This template follows a strict Domain-Driven Design (DDD) layering. The codebase is divided into the Core Kernel, Bounded Contexts (Modules), and Infrastructure Adapters.

```text
src/
├── app/                                    # Application Bootstrapping & Lifecycle
│   ├── config/                             # Merged config & env parser
│   ├── loaders/                            # System bootstrapping (OS Init)
│   ├── services/                           # Core Application Services
│   └── bot.js                              # Bot process entrypoint
│
├── core/                                   # Shared Cross-Cutting Kernel
│   ├── client/                             # IoC Container (BotClient)
│   ├── logger/                             # SLF4J-style unified logger
│   ├── constants/                          # Static system constants
│   ├── i18n/                               # Localization domain
│   └── utils/                              # Pure stateless utilities
│
├── modules/                                # Bounded Contexts (Domains)
│   ├── guild/                              # Guild & System Settings
│   │   ├── domain/                         # Pure Domain Models (No DB knowledge)
│   │   ├── application/                    # Use Cases & Services
│   │   └── presentation/                   # Commands & Events
│   ├── moderation/                         # Bans, Kicks, Timeouts
│   └── user/                               # User Accounts
│
├── infrastructure/                         # Outbound Infrastructure Layer
│   ├── cache/                              # In-memory adapters (Cooldowns)
│   ├── database/                           # Persistence (MongoDB Client & Repos)
│   └── discord/                            # Discord API Clients, Sync, & Types
│
└── presentation/                           # Gateway / Router Layer
    ├── dispatchers/                        # Interaction & Message Routers
    └── context-menus/                      # Context Menu Adapters
```

## 🜐 Core Commands

Here are examples of some of the core commands that are available out-of-the-box:

| Name     | Description                                |
| -------- | ------------------------------------------ |
| ping     | 🏓 Pong! Replies with bot's response time. |
| botinfo  | 📖 View bot's information.                 |
| language | 🌐 Change your language for the bot.       |
| invite   | 📨 Invite the bot to your server.          |

## 🤝 Contributing

This project is undergoing active maintenance and architectural updates. Before full active community workflows resume, this repository is not accepting external pull requests, feature requests, or issue reports.

If you want to modify or improve this bot template, you are welcome to fork this repository and maintain your own version.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](https://github.com/rafisarkar0128/djs-prototype/blob/main/LICENSE) file for details.

## 👥 Contributors

Thanks go to these wonderful people for their contributions:

## 🙏 Appreciation & Thanks

This project has been a meaningful part of my coding journey. While active feature development had paused, it is resuming as a dedicated enterprise template repository for anyone who wants to bootstrap their own discord bot using Node.js and discord.js.

Thank you to everyone who supported this project, contributed ideas, tested features, and helped it grow.

I am especially thankful to the open-source ecosystem, including tools and communities around Node.js, discord.js, MongoDB, and many other resources that helped me learn, improve, and build with confidence.

Working on this project taught me a lot and helped me become a better developer. Thank you for being part of that journey.

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
[license-shield]: https://img.shields.io/github/license/rafisarkar0128/djs-prototype.svg?style=for-the-badge
[license-url]: https://github.com/rafisarkar0128/djs-prototype/blob/main/LICENSE
[codeql]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/codeql.yml?style=for-the-badge&logo=github&label=Codeql
[codeql-url]: https://github.com/rafisarkar0128/djs-prototype/actions/workflows/codeql.yml
[dependency-review]: https://img.shields.io/github/actions/workflow/status/rafisarkar0128/djs-prototype/dependency-review.yml?style=for-the-badge&label=Dependency%20Review&logo=github
[dependency-review-url]: https://github.com/rafisarkar0128/djs-prototype/actions?query=workflow%3A%22Dependency+Review%22
[code-factor]: https://img.shields.io/codefactor/grade/github/rafisarkar0128/djs-prototype?logo=codefactor&logoColor=%23F44A6A&style=for-the-badge
[code-factor-url]: https://www.codefactor.io/repository/github/rafisarkar0128/djs-prototype
[commit-shield]: https://img.shields.io/github/last-commit/rafisarkar0128/djs-prototype?style=for-the-badge
[commit-url]: https://github.com/rafisarkar0128/djs-prototype/commits/main
