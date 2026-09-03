# Skills Hub (Tauri Desktop)

A cross-platform desktop app (Tauri + React) for installing, organizing, updating, and syncing Agent Skills to multiple AI coding tools' global or project-level skills directories. Skills Hub prefers symlink/junction and automatically falls back to copy when needed: "Install once, sync everywhere".

## Documentation

- English (default): `README.md` (this file)
- 中文：[`docs/README.zh.md`](docs/README.zh.md)

## Fork Lineage

This repository is an MIT-licensed fork of [qufei1993/skills-hub](https://github.com/qufei1993/skills-hub). It continues the upstream `v0.9.1` code line, includes the current upstream featured-Skill data, and keeps the upstream attribution while adding a fixed `~/.agents/skills` source of truth, hardened local file operations, Trash-only deletion, clearer automatic-update eligibility, and Skill-owned icon metadata.

This fork currently publishes source code only. It does not publish signed installers, updater artifacts, packages, or an automatic binary release.

## Why Skills Hub

AI coding tools increasingly use their own skills directories and installation flows. Maintaining those directories manually can quickly become messy: the same skill gets copied many times, update sources become unclear, tool activation states drift, and bulk cleanup takes too much effort.

Skills Hub installs skills into one central repository, then syncs them to tools such as Claude Code, Codex, Cursor, OpenCode, and Antigravity based on your choices. You can tag skills, choose global or project scope, update tool targets in bulk, and let the system update Git and independent local-source skills on a schedule.

## Key Features

- **Centralized library**: Install skills into one central repository instead of scattering copies across tool folders.
- **Explore and install**: Install from curated lists, online search, local folders, or Git repositories.
- **Multi-tool sync**: Sync skills to different AI coding tools by global or project scope.
- **Bulk management**: Update skills and apply tags, tool targets, enabled state, or Trash-only delete operations to many skills at once.
- **Tag organization**: Filter, group, and maintain skills with tags.
- **Tool management**: Enable built-in tool targets or add custom skills directories.
- **Automatic updates**: Update Git and independent local-source skills on a schedule, with separate updated, skipped, and failed results.
- **Detail view**: Browse skill file trees, Markdown content, and code snippets.
- **Migration**: Scan and import existing local skills into one managed library.
- **Discovery controls**: Choose which installed tool directories participate in import discovery.

## Interface Preview

### My Skills — Managed Skills and Bulk Actions

My Skills provides card and list views for each managed skill's source, tags, sync scope, target tools, and enabled state. The toolbar supports scope filtering, sorting, tag filtering, search, and bulk actions.

When Skills Hub discovers importable Skills in installed tool directories, the discovery banner lets you review them or open Scan settings. Scan sources are independent from sync targets, persist across restarts, and remain accessible from Settings. Only directories containing `SKILL.md` are shown as importable Skills.

![My Skills card view](docs/assets/my-skills-card-view.png)

![My Skills list view with bulk actions](docs/assets/my-skills-list-bulk-actions.png)

### Explore — Curated Skills and Online Search

Explore brings together curated repository skills and online search. After clicking Install, you can choose tags, install scope, and target tools.

![Explore online skills](docs/assets/explore-online-skills.png)

### Add Skill — Set Tags, Scope, and Tools Before Installation

Manual add supports both local folders and Git repositories. Before installing, you can assign tags, choose global or project scope, and choose which tools to sync to.

![Add a skill from a Git repository](docs/assets/add-skill-git-repository.png)

### Tools — Built-in and Custom Tool Management

Tools shows detected and enabled AI coding tools with recognizable product icons. You can enable built-in targets or create and edit custom tools with an avatar, skills directories, and an explicit sync mode.

![Built-in and custom tool management](docs/assets/tools-management.png)

### Updates — Scheduled Runs and Results

Updates can register a system-level schedule that keeps Git and independent local-source skills current while the app is closed. You can also update immediately and review checked, updated, skipped, and failed counts from the latest run. A managed skill that resolves back to the central library is excluded from update eligibility, so it is not attempted or reported as a failed self-update.

![Scheduled skill updates and run results](docs/assets/updates-scheduled-run.png)

### Settings — App-Level Preferences

Settings keeps local app preferences such as interface language, appearance, discovery scanning, Git cache, and the restricted loopback network proxy. This fork intentionally fixes the central library location and does not enable the upstream in-app updater.

![Application preferences](docs/assets/settings-app-preferences.png)

## Workflow

1. Install a skill from Explore, a local folder, or a Git repository.
2. Choose tags, sync scope, and target tools before installation.
3. Skills Hub stores the skill in the fixed source-of-truth directory `~/.agents/skills`.
4. Skills Hub syncs it to global skills directories or project-level skills directories based on each tool's rules.
5. Later, you can organize, enable/disable, move to Trash, or bulk update skills from My Skills, and configure tool targets or automatic updates from Management Center.

## Skill-Provided Icons

Skills Hub does not guess a Skill's publisher or maintain a built-in mapping from Skill names to personal avatars. A Skill can own its icon through the standard Codex UI metadata file `agents/openai.yaml`, with image files stored inside that Skill:

```text
my-skill/
├── SKILL.md
├── agents/
│   └── openai.yaml
└── assets/
    ├── icon-small.svg
    └── logo-large.png
```

```yaml
interface:
  icon_small: "./assets/icon-small.svg"
  icon_large: "./assets/logo-large.png"
  brand_color: "#3B82F6"
```

The managed-Skills list prefers `icon_small`, falls back to `icon_large`, and then uses a generic semantic icon. Icon paths are resolved relative to the Skill root. This keeps icon customization with the Skill, so authors and users can replace an icon without changing Skills Hub source code.

This repository publishes the generic reading and rendering mechanism, not a catalog that assigns personal avatars or third-party logos to Skills. Skill authors and users choose their own assets and are responsible for having permission to redistribute them.

The card renders one icon edge-to-edge in its 48 px rounded tile with no overlay badge. For consistent optical fill, use a square asset with a tightly cropped artboard; transparent padding inside the source image remains part of the image and should be removed from the asset itself.

For safety, `agents/openai.yaml` must be no larger than 64 KiB. Icon paths must be relative, stay inside the Skill directory after canonicalization, and point to a regular non-symlink SVG, PNG, JPEG, or WebP file no larger than 128 KiB. Raster icons are limited to 512×512 and 262,144 pixels. URLs, absolute paths, `..`, active SVG content, oversized raster dimensions, mismatched file signatures, and invalid colors are ignored. The parser reads the block-style `interface` keys shown above. `brand_color` is optional, must use `#RRGGBB`, and is applied only when a valid Skill-provided icon is accepted. The managed list also caps the combined encoded icon payload at 12 MiB; icons beyond that response budget fall back to the generic icon without changing Skill health.

## Supported AI Coding Tools

Skills Hub includes 47 built-in tool adapters and supports custom skills directories from Management Center. Project skills directories are relative to the selected project root. Tools marked `N/A` do not have a confirmed project-level skills directory and are supported for global sync only.

| tool key | Display name | global skills dir (relative to `~`) | project skills dir (relative to project) | detected if exists (relative to `~`) |
| --- | --- | --- | --- | --- |
| `cursor` | Cursor | `.cursor/skills` | `.agents/skills` | `.cursor` |
| `claude_code` | Claude Code | `.claude/skills` | `.claude/skills` | `.claude` |
| `codex` | Codex | `.codex/skills` | `.agents/skills` | `.codex` |
| `deepseek_harness` | DeepSeek Harness | `.dsh/skills` | `.dsh/skills` | `.dsh` |
| `opencode` | OpenCode | `.config/opencode/skills` | `.agents/skills` | `.config/opencode` |
| `antigravity` | Antigravity | `.gemini/config/skills` | `.agents/skills` | `.gemini/config` |
| `amp` | Amp | `.config/agents/skills` | `.agents/skills` | `.config/agents` |
| `kimi_cli` | Kimi Code CLI | `.config/agents/skills` | `.agents/skills` | `.config/agents` |
| `augment` | Augment | `.augment/skills` | `.augment/skills` | `.augment` |
| `openclaw` | OpenClaw | `.openclaw/skills` | `skills` | `.openclaw` |
| `copaw` | Copaw | `.copaw/skill_pool` | `.copaw/skill_pool` | `.copaw` |
| `cline` | Cline | `.agents/skills` | `.agents/skills` | `.agents` |
| `codebuddy` | CodeBuddy | `.codebuddy/skills` | `.codebuddy/skills` | `.codebuddy` |
| `codewhale` | CodeWhale | `.codewhale/skills` | `.codewhale/skills` | `.codewhale` |
| `workbuddy` | WorkBuddy | `.workbuddy/skills` | `N/A` | `.workbuddy` |
| `command_code` | Command Code | `.commandcode/skills` | `.commandcode/skills` | `.commandcode` |
| `continue` | Continue | `.continue/skills` | `.continue/skills` | `.continue` |
| `crush` | Crush | `.config/crush/skills` | `.crush/skills` | `.config/crush` |
| `junie` | Junie | `.junie/skills` | `.junie/skills` | `.junie` |
| `iflow_cli` | iFlow CLI | `.iflow/skills` | `.iflow/skills` | `.iflow` |
| `kiro_cli` | Kiro CLI | `.kiro/skills` | `.kiro/skills` | `.kiro` |
| `kode` | Kode | `.kode/skills` | `.kode/skills` | `.kode` |
| `mcpjam` | MCPJam | `.mcpjam/skills` | `.mcpjam/skills` | `.mcpjam` |
| `mistral_vibe` | Mistral Vibe | `.vibe/skills` | `.vibe/skills` | `.vibe` |
| `mux` | Mux | `.mux/skills` | `.mux/skills` | `.mux` |
| `openclaude` | OpenClaude IDE | `.openclaude/skills` | `.openclaude/skills` | `.openclaude` |
| `openhands` | OpenHands | `.openhands/skills` | `.openhands/skills` | `.openhands` |
| `pi` | Pi | `.pi/agent/skills` | `.pi/skills` | `.pi` |
| `qoder` | Qoder | `.qoder/skills` | `.qoder/skills` | `.qoder` |
| `qoderwork` | QoderWork | `.qoderwork/skills` | `.qoderwork/skills` | `.qoderwork` |
| `qwen_code` | Qwen Code | `.qwen/skills` | `.qwen/skills` | `.qwen` |
| `trae` | Trae | `.trae/skills` | `.trae/skills` | `.trae` |
| `trae_cn` | Trae CN | `.trae-cn/skills` | `.trae/skills` | `.trae-cn` |
| `zencoder` | Zencoder | `.zencoder/skills` | `.zencoder/skills` | `.zencoder` |
| `neovate` | Neovate | `.neovate/skills` | `.neovate/skills` | `.neovate` |
| `pochi` | Pochi | `.pochi/skills` | `.pochi/skills` | `.pochi` |
| `adal` | AdaL | `.adal/skills` | `.adal/skills` | `.adal` |
| `kilo_code` | Kilo Code | `.kilocode/skills` | `.kilocode/skills` | `.kilocode` |
| `roo_code` | Roo Code | `.roo/skills` | `.roo/skills` | `.roo` |
| `goose` | Goose | `.config/goose/skills` | `.goose/skills` | `.config/goose` |
| `gemini_cli` | Gemini CLI | `.gemini/skills` | `.agents/skills` | `.gemini` |
| `github_copilot` | GitHub Copilot | `.copilot/skills` | `.agents/skills` | `.copilot` |
| `clawdbot` | Clawdbot | `.clawdbot/skills` | `.clawdbot/skills` | `.clawdbot` |
| `droid` | Droid | `.factory/skills` | `.factory/skills` | `.factory` |
| `windsurf` | Windsurf | `.codeium/windsurf/skills` | `.windsurf/skills` | `.codeium/windsurf` |
| `moltbot` | MoltBot | `.moltbot/skills` | `.moltbot/skills` | `.moltbot` |
| `hermes_agent` | Hermes Agent | `.hermes/skills` | N/A | `.hermes` |

See [`src-tauri/src/core/tool_adapters/mod.rs`](src-tauri/src/core/tool_adapters/mod.rs) for the complete path rules and detection logic.

## Development

### Prerequisites

- Node.js 18+ (recommended: 20+)
- Rust (stable)
- Tauri system dependencies (follow Tauri official docs for your OS)

```bash
npm install
npm run tauri:dev
```

### Build

These commands build the app locally from source. This repository does not distribute an official installer or binary release.

```bash
npm run lint
npm run build
npm run tauri:build
```

#### Platform build commands (from `package.json`)

- macOS (dmg): `npm run tauri:build:mac:dmg`
- macOS (universal dmg): `npm run tauri:build:mac:universal:dmg`
- Windows (MSI): `npm run tauri:build:win:msi`
- Windows (NSIS exe): `npm run tauri:build:win:exe`
- Windows (MSI+NSIS): `npm run tauri:build:win:all`
- Linux (deb): `npm run tauri:build:linux:deb`
- Linux (AppImage): `npm run tauri:build:linux:appimage`
- Linux (deb+AppImage): `npm run tauri:build:linux:all`

### Tests (Rust)

```bash
cd src-tauri
cargo test
```

## Contributing & Security

- Contributing: [`CONTRIBUTING.md`](CONTRIBUTING.md)
- Code of Conduct: [`CODE_OF_CONDUCT.md`](CODE_OF_CONDUCT.md)
- Security: [`SECURITY.md`](SECURITY.md)

## FAQ / Notes

- Is `index.html` a hosted website? No. It is the Vite entry point embedded in the Tauri desktop app. This repository does not configure or publish GitHub Pages.
- Where are skills stored? This fork fixes the central source of truth at `~/.agents/skills`; tool-specific directories are validated sync targets rather than co-equal sources.
- What are tags for? Tags help you find and organize skills. They do not change where a skill is synced or which tools can use it.
- What is Management Center for? Management Center handles tags, tool targets, and automatic skill updates. Settings keeps app-level preferences.
- Does disabling a skill delete files? No. Disabling only removes tool-side sync. The skill and its configuration remain in the Central Repo and can be enabled again later.
- What does bulk tool setup mean? Skills Hub applies the currently selected tool list to the selected skills. Unchecked tools are removed from those skills' sync targets.
- What is project-level sync? The skill is still stored once in the Central Repo, but its sync target is a selected project directory such as `<project>/.agents/skills`, `<project>/.claude/skills`, or another tool-specific project skills path.
- What is a custom tool directory? If an internal tool or wrapped agent has its own skills directory, you can add it in Management Center as a custom sync target.
- What does automatic update update? It updates Git skills and local skills with an independent external source, then refreshes validated copy-mode targets. Managed skills that only point back to `~/.agents/skills` are not self-updated.
- Which requests use the network proxy? It affects GitHub API calls, curated skill lists, GitHub Contents downloads, and Git clone/fetch/update flows.
- Why is Cursor sync always copy? Cursor currently does not support symlink/junction-based skill directories, so Skills Hub forces directory copy when syncing to Cursor.
- Why does sync sometimes fall back to copy? Skills Hub prefers symlink/junction, but on some systems (especially Windows) symlinks may be restricted; in that case it falls back to directory copy.
- What does `TARGET_EXISTS|...` mean? The target folder already exists and the operation did not overwrite it (default is non-destructive). Remove the existing folder or retry with the appropriate overwrite flow.
- macOS Gatekeeper note (unsigned/notarized builds, may vary by macOS version): if you see “damaged” or “unverified developer”, run `xattr -cr "/Applications/Skills Hub.app"` (https://v2.tauri.app/distribute/#macos).

## Supported Platforms

- macOS (verified)
- Windows (expected by design; not validated locally)
- Linux (expected by design; not validated locally)

## License

MIT License — see `LICENSE`.
