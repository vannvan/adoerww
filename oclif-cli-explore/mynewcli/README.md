oclif-hello-world
=================

oclif example Hello World CLI

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![CircleCI](https://circleci.com/gh/oclif/hello-world/tree/main.svg?style=shield)](https://circleci.com/gh/oclif/hello-world/tree/main)
[![GitHub license](https://img.shields.io/github/license/oclif/hello-world)](https://github.com/oclif/hello-world/blob/main/LICENSE)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g mynewcli
$ mynewcli COMMAND
running command...
$ mynewcli (--version)
mynewcli/0.0.0 darwin-arm64 node-v16.9.0
$ mynewcli --help [COMMAND]
USAGE
  $ mynewcli COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`mynewcli hello PERSON`](#mynewcli-hello-person)
* [`mynewcli hello world`](#mynewcli-hello-world)
* [`mynewcli help [COMMANDS]`](#mynewcli-help-commands)
* [`mynewcli plugins`](#mynewcli-plugins)
* [`mynewcli plugins:install PLUGIN...`](#mynewcli-pluginsinstall-plugin)
* [`mynewcli plugins:inspect PLUGIN...`](#mynewcli-pluginsinspect-plugin)
* [`mynewcli plugins:install PLUGIN...`](#mynewcli-pluginsinstall-plugin-1)
* [`mynewcli plugins:link PLUGIN`](#mynewcli-pluginslink-plugin)
* [`mynewcli plugins:uninstall PLUGIN...`](#mynewcli-pluginsuninstall-plugin)
* [`mynewcli plugins:uninstall PLUGIN...`](#mynewcli-pluginsuninstall-plugin-1)
* [`mynewcli plugins:uninstall PLUGIN...`](#mynewcli-pluginsuninstall-plugin-2)
* [`mynewcli plugins update`](#mynewcli-plugins-update)

## `mynewcli hello PERSON`

Say hello

```
USAGE
  $ mynewcli hello PERSON -f <value>

ARGUMENTS
  PERSON  Person to say hello to

FLAGS
  -f, --from=<value>  (required) Who is saying hello

DESCRIPTION
  Say hello

EXAMPLES
  $ oex hello friend --from oclif
  hello friend from oclif! (./src/commands/hello/index.ts)
```

_See code: [dist/commands/hello/index.ts](https://github.com/vannvan/mynewcli/blob/v0.0.0/dist/commands/hello/index.ts)_

## `mynewcli hello world`

Say hello world

```
USAGE
  $ mynewcli hello world

DESCRIPTION
  Say hello world

EXAMPLES
  $ mynewcli hello world
  hello world! (./src/commands/hello/world.ts)
```

## `mynewcli help [COMMANDS]`

Display help for mynewcli.

```
USAGE
  $ mynewcli help [COMMANDS] [-n]

ARGUMENTS
  COMMANDS  Command to show help for.

FLAGS
  -n, --nested-commands  Include all nested commands in the output.

DESCRIPTION
  Display help for mynewcli.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.2.9/src/commands/help.ts)_

## `mynewcli plugins`

List installed plugins.

```
USAGE
  $ mynewcli plugins [--core]

FLAGS
  --core  Show core plugins.

DESCRIPTION
  List installed plugins.

EXAMPLES
  $ mynewcli plugins
```

_See code: [@oclif/plugin-plugins](https://github.com/oclif/plugin-plugins/blob/v2.4.7/src/commands/plugins/index.ts)_

## `mynewcli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mynewcli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mynewcli plugins add

EXAMPLES
  $ mynewcli plugins:install myplugin 

  $ mynewcli plugins:install https://github.com/someuser/someplugin

  $ mynewcli plugins:install someuser/someplugin
```

## `mynewcli plugins:inspect PLUGIN...`

Displays installation properties of a plugin.

```
USAGE
  $ mynewcli plugins:inspect PLUGIN...

ARGUMENTS
  PLUGIN  [default: .] Plugin to inspect.

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

GLOBAL FLAGS
  --json  Format output as json.

DESCRIPTION
  Displays installation properties of a plugin.

EXAMPLES
  $ mynewcli plugins:inspect myplugin
```

## `mynewcli plugins:install PLUGIN...`

Installs a plugin into the CLI.

```
USAGE
  $ mynewcli plugins:install PLUGIN...

ARGUMENTS
  PLUGIN  Plugin to install.

FLAGS
  -f, --force    Run yarn install with force flag.
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Installs a plugin into the CLI.
  Can be installed from npm or a git url.

  Installation of a user-installed plugin will override a core plugin.

  e.g. If you have a core plugin that has a 'hello' command, installing a user-installed plugin with a 'hello' command
  will override the core plugin implementation. This is useful if a user needs to update core plugin functionality in
  the CLI without the need to patch and update the whole CLI.


ALIASES
  $ mynewcli plugins add

EXAMPLES
  $ mynewcli plugins:install myplugin 

  $ mynewcli plugins:install https://github.com/someuser/someplugin

  $ mynewcli plugins:install someuser/someplugin
```

## `mynewcli plugins:link PLUGIN`

Links a plugin into the CLI for development.

```
USAGE
  $ mynewcli plugins:link PLUGIN

ARGUMENTS
  PATH  [default: .] path to plugin

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Links a plugin into the CLI for development.
  Installation of a linked plugin will override a user-installed or core plugin.

  e.g. If you have a user-installed or core plugin that has a 'hello' command, installing a linked plugin with a 'hello'
  command will override the user-installed or core plugin implementation. This is useful for development work.


EXAMPLES
  $ mynewcli plugins:link myplugin
```

## `mynewcli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli plugins unlink
  $ mynewcli plugins remove
```

## `mynewcli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli plugins unlink
  $ mynewcli plugins remove
```

## `mynewcli plugins:uninstall PLUGIN...`

Removes a plugin from the CLI.

```
USAGE
  $ mynewcli plugins:uninstall PLUGIN...

ARGUMENTS
  PLUGIN  plugin to uninstall

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Removes a plugin from the CLI.

ALIASES
  $ mynewcli plugins unlink
  $ mynewcli plugins remove
```

## `mynewcli plugins update`

Update installed plugins.

```
USAGE
  $ mynewcli plugins update [-h] [-v]

FLAGS
  -h, --help     Show CLI help.
  -v, --verbose

DESCRIPTION
  Update installed plugins.
```
<!-- commandsstop -->
