## 🏗 Project Structure

This template follows a strict Domain-Driven Design (DDD) layering. The codebase is divided into the Core Kernel, Bounded Contexts (Modules), and Infrastructure Adapters.

```text
src/
├── app/                                    # Application Bootstrapping & Lifecycle
│   ├── config/                             # Merged config & env parser
│   │   ├── index.js
│   │   └── validate.js
│   ├── loaders/                            # System bootstrapping (OS Init)
│   │   ├── anticrash.js
│   │   ├── commands.js
│   │   ├── events.js
│   │   ├── locales.js
│   │   └── plugins.js                      # (Future: Microkernel extension loader)
│   ├── services/                           # Core Application Services
│   │   └── CooldownService.js              # Global command cooldown policy
│   ├── bootstrap.js                        # Bot process entrypoint
│   └── shard.js                            # Sharding entrypoint
│
├── core/                                   # Shared Cross-Cutting Kernel
│   ├── client/
│   │   └── BotClient.js                    # Inversion of Control (IoC) Container
│   ├── logger/
│   │   └── Logger.js                       # SLF4J-style unified logger
│   ├── constants/                          # Static system constants
│   │   ├── colors.js
│   │   ├── emojis.js
│   │   ├── permissions.js
│   │   └── languages.js
│   ├── i18n/                               # Localization domain
│   │   └── locales/                        # bn, en-US
│   └── utils/                              # Pure stateless utilities
│       ├── cache.js
│       └── string.js
│
├── modules/                                # Bounded Contexts (Domains)
│   │
│   ├── guild/                              # ─── Bounded Context: Guild & System ───
│   │   ├── domain/
│   │   │   └── entities/
│   │   │       └── GuildSettings.js        # Domain model (No DB knowledge)
│   │   ├── application/
│   │   │   └── GuildSettingsService.js     # Use cases
│   │   └── presentation/
│   │       ├── commands/
│   │       │   ├── language.js
│   │       │   └── serverinfo.js
│   │       └── events/
│   │           ├── guildCreate.js
│   │           └── guildDelete.js
│   │
│   ├── moderation/                         # ─── Bounded Context: Moderation ───
│   │   ├── application/
│   │   │   └── ModerationService.js
│   │   └── presentation/
│   │       ├── commands/
│   │       │   ├── ban.js
│   │       │   ├── kick.js
│   │       │   ├── purge.js
│   │       │   └── timeout.js
│   │       └── events/
│   │           └── guildBanAdd.js
│   │
│   └── user/                               # ─── Bounded Context: User Accounts ───
│       └── domain/
│           └── entities/
│               └── UserAccount.js
│
├── infrastructure/                         # Outbound Infrastructure Layer
│   ├── cache/                              # In-memory adapters
│   │   └── MemoryCooldownRepository.js     # Implements cooldown storage
│   ├── database/                           # Persistence (DB Driver)
│   │   ├── DatabaseClient.js               # MongoDB Client
│   │   └── repositories/
│   │       ├── BaseRepository.js
│   │       ├── GuildRepository.js          # Implements DB access for GuildSettings
│   │       └── UserRepository.js
│   └── discord/                            # Discord API Clients & Sync Services
│       ├── services/
│       │   ├── fetchRemoteCommands.js
│       │   └── syncCommands.js
│       ├── types/
│       │   ├── commands.d.ts               # TypeScript contract for plain-object commands
│       │   └── events.d.ts                 # TypeScript contract for plain-object events
│       ├── utils/
│       │   └── commandDiff.js
│       └── validate/
│           └── contextmenu.js
│
└── presentation/                           # Gateway / Router Layer (Global Interaction Router)
    ├── dispatchers/
    │   ├── interactionCreate.js            # Routes all Discord interactions
    │   ├── messageCreate.js                # Routes legacy prefix/mention commands
    │   ├── slashRouter.js                  # Executes Slash Commands (with Cooldown checks)
    │   ├── contextRouter.js                # Executes Context Menus
    │   └── autocompleteRouter.js           # Routes Autocomplete requests
    └── context-menus/                      # Context Menu Adapters
        ├── memberinfo.js
        └── messageinfo.js
```

## 🧠 Architecture Notes

- `src/core/` contains the shared kernel. If it doesn't know about Discord, MongoDB, or Lavalink, it goes here.
- `src/modules/` are your isolated features. A moderation module knows nothing about the music module.
- `src/infrastructure/` is where the actual databases and APIs live. If you ever switch from MongoDB to PostgreSQL, you only touch this folder.
- `src/presentation/` is the "front door". It catches the raw Discord events and routes them to the correct module.
- **Type Safety**: We use .d.ts files (like events.d.ts) to ensure our plain-object exports (export default { name, execute }) are strongly typed in VS Code without needing to write TypeScript.
