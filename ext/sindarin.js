#!/usr/bin/env node
var kremlin = {m: {}, loaded: {}, debug: false,
    require(k, isDefault) {
        var mod = this.loaded[k];
        if (!mod) {
            if (this.debug) console.log('%cimport', 'color: green', k);
            mod = {exports: {}};
            this.loaded[k] = mod;
            var fun = this.m[k];
            if (fun) fun(mod, mod.exports, this.global);
            else throw new Error('module not found: ' + k);
        }
        var res = mod.hasOwnProperty('exports') ? mod.exports : {};
        if (isDefault && res.default) res = res.default;
        return res;
    },
    requires(ks) {
        if (ks.length === 0) return {};
        var c = this.require(ks[0]);
        for (let k of ks.slice(1))
            Object.assign(c, this.require(k));  // what if c is not an object?
        return c;
    },
    async import(k, isDefault) {
        return this.require(k, isDefault);
    },
    export(m, d, names) {
        m.exports = m.exports || {};
        if (names)
            for (let nm of names) m.exports[nm] = d[nm]
        else
            m.exports = Object.assign(m.exports, d);
    },
    node_require(nm) {
        var m = require(nm);
        this.loaded[`node://${nm}`] = {exports: m};
        return m;
    },
    node_startup(deps) {
        var glob = (typeof global !== 'undefined') ? global : null,
            win  = (typeof window !== 'undefined') ? window : null;
        this.global =  win || glob || {};
        if (typeof process === 'undefined')
            this.global.process = {env: {}, browser: true};
        else if (win) process.browser = true;  /* for NWjs */
        if (typeof require !== 'undefined')
            for (let m of deps) this.node_require(m);
    }
};

kremlin.node_startup([] /** @todo probably deps are not needed anymore? */);

var __filename = '';
kremlin.m['sindarin.compiler@0.1.0:src/cli.ts'] = (module,exports,global) => {let fs = require('fs');
let path = require('path');
let mkdirp = kremlin.require('mkdirp@0.5.5:index.js', true);
let _20 = kremlin.require('sindarin.compiler@0.1.0:src/syntax/c99.ts', false);
let commander = kremlin.require('commander@7.2.0:index.js', true);
let manifest = kremlin.require('sindarin.compiler@0.1.0:package.json', true);
class CLI {
    constructor() {
        this.rc = 0;
    }
    async main() {
        var prog = new commander.Command()
            .name('sindarin.compiler')
            .version(manifest.version);
        prog.command('parse [filenames...]', { isDefault: true })
            .option('-o <FILE>')
            .option('--out-dir <DIR>')
            .action((...a) => this.parse(...a));
        await prog.parseAsync(process.argv);
        return this.rc;
    }
    async parse(filenames, opts) {
        var _a;
        var parser = new _20.C99Parser();
        for (let infn of filenames) {
            try {
                var text = fs.readFileSync(infn, 'utf-8');
            }
            catch (e) {
                console.error(`cannot read ${infn}: ${e}`);
                this.rc = 1;
                continue;
            }
            var outfn = (_a = opts.o) !== null && _a !== void 0 ? _a : infn + '.ast.json';
            if (opts.outDir)
                outfn = path.join(opts.outDir, path.basename(outfn));
            try {
                var ast = parser.parse(text);
            }
            catch (e) {
                console.error(`in ${infn}:\n${e}`);
                this.rc = 1;
                continue;
            }
            var out = JSON.stringify(ast, null, 1);
            if (outfn == '-') {
                await new Promise(resolve => process.stdout.write(out, resolve));
            }
            else {
                console.log(`${infn}  -->  ${outfn}`);
                mkdirp.sync(path.dirname(outfn));
                fs.writeFileSync(outfn, out);
            }
        }
    }
}
new CLI().main().then((rc) => process.exit(rc));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiY2xpLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiY2xpLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sRUFBRSxNQUFNLElBQUksQ0FBQztBQUNwQixPQUFPLElBQUksTUFBTSxNQUFNLENBQUM7QUFDeEIsT0FBTyxNQUFNLE1BQU0sUUFBUSxDQUFDO0FBQzVCLE9BQU8sRUFBRSxTQUFTLEVBQUUsTUFBTSxjQUFjLENBQUM7QUFFekMsT0FBTyxTQUFTLE1BQU0sV0FBVyxDQUFDO0FBQ2xDLE9BQU8sUUFBUSxNQUFNLGlCQUFpQixDQUFDO0FBR3ZDLE1BQU0sR0FBRztJQUFUO1FBRUksT0FBRSxHQUFHLENBQUMsQ0FBQTtJQWlEVixDQUFDO0lBL0NHLEtBQUssQ0FBQyxJQUFJO1FBQ04sSUFBSSxJQUFJLEdBQUcsSUFBSSxTQUFTLENBQUMsT0FBTyxFQUFFO2FBQzdCLElBQUksQ0FBQyxtQkFBbUIsQ0FBQzthQUN6QixPQUFPLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxDQUFDO1FBQy9CLElBQUksQ0FBQyxPQUFPLENBQUMsc0JBQXNCLEVBQUUsRUFBQyxTQUFTLEVBQUUsSUFBSSxFQUFDLENBQUM7YUFDbEQsTUFBTSxDQUFDLFdBQVcsQ0FBQzthQUNuQixNQUFNLENBQUMsaUJBQWlCLENBQUM7YUFDekIsTUFBTSxDQUFDLENBQUMsR0FBRyxDQUFDLEVBQUUsRUFBRSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRXhDLE1BQU0sSUFBSSxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDcEMsT0FBTyxJQUFJLENBQUMsRUFBRSxDQUFDO0lBQ25CLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBSyxDQUFDLFNBQW9CLEVBQUUsSUFBb0M7O1FBQ2xFLElBQUksTUFBTSxHQUFHLElBQUksU0FBUyxFQUFFLENBQUM7UUFDN0IsS0FBSyxJQUFJLElBQUksSUFBSSxTQUFTLEVBQUU7WUFDeEIsSUFBSTtnQkFDQSxJQUFJLElBQUksR0FBRyxFQUFFLENBQUMsWUFBWSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsQ0FBQzthQUM3QztZQUNELE9BQU8sQ0FBQyxFQUFFO2dCQUNOLE9BQU8sQ0FBQyxLQUFLLENBQUMsZUFBZSxJQUFJLEtBQUssQ0FBQyxFQUFFLENBQUMsQ0FBQztnQkFDM0MsSUFBSSxDQUFDLEVBQUUsR0FBRyxDQUFDLENBQUM7Z0JBQUMsU0FBUzthQUN6QjtZQUNELElBQUksS0FBSyxTQUFHLElBQUksQ0FBQyxDQUFDLG1DQUFJLElBQUksR0FBRyxXQUFXLENBQUM7WUFDekMsSUFBSSxJQUFJLENBQUMsTUFBTTtnQkFDWCxLQUFLLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztZQUN6RCxJQUFJO2dCQUNBLElBQUksR0FBRyxHQUFHLE1BQU0sQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7YUFDaEM7WUFDRCxPQUFPLENBQUMsRUFBRTtnQkFDTixPQUFPLENBQUMsS0FBSyxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsRUFBRSxDQUFDLENBQUM7Z0JBQ25DLElBQUksQ0FBQyxFQUFFLEdBQUcsQ0FBQyxDQUFDO2dCQUFDLFNBQVM7YUFDekI7WUFFRCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFFdkMsSUFBSSxLQUFLLElBQUksR0FBRyxFQUFFO2dCQUNkLE1BQU0sSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FDeEIsT0FBTyxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxFQUFFLE9BQU8sQ0FBQyxDQUFDLENBQUM7YUFDM0M7aUJBQ0k7Z0JBQ0QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLElBQUksVUFBVSxLQUFLLEVBQUUsQ0FBQyxDQUFDO2dCQUN0QyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQztnQkFDakMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxLQUFLLEVBQUUsR0FBRyxDQUFDLENBQUM7YUFDaEM7U0FDSjtJQUNMLENBQUM7Q0FDSjtBQUdELElBQUksR0FBRyxFQUFFLENBQUMsSUFBSSxFQUFFLENBQUMsSUFBSSxDQUFDLENBQUMsRUFBRSxFQUFFLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgZnMgZnJvbSAnZnMnO1xuaW1wb3J0IHBhdGggZnJvbSAncGF0aCc7XG5pbXBvcnQgbWtkaXJwIGZyb20gJ21rZGlycCc7XG5pbXBvcnQgeyBDOTlQYXJzZXIgfSBmcm9tIFwiLi9zeW50YXgvYzk5XCI7XG5cbmltcG9ydCBjb21tYW5kZXIgZnJvbSAnY29tbWFuZGVyJztcbmltcG9ydCBtYW5pZmVzdCBmcm9tICcuLi9wYWNrYWdlLmpzb24nO1xuXG5cbmNsYXNzIENMSSB7XG5cbiAgICByYyA9IDBcblxuICAgIGFzeW5jIG1haW4oKSB7XG4gICAgICAgIHZhciBwcm9nID0gbmV3IGNvbW1hbmRlci5Db21tYW5kKClcbiAgICAgICAgICAgIC5uYW1lKCdzaW5kYXJpbi5jb21waWxlcicpXG4gICAgICAgICAgICAudmVyc2lvbihtYW5pZmVzdC52ZXJzaW9uKTtcbiAgICAgICAgcHJvZy5jb21tYW5kKCdwYXJzZSBbZmlsZW5hbWVzLi4uXScsIHtpc0RlZmF1bHQ6IHRydWV9KVxuICAgICAgICAgICAgLm9wdGlvbignLW8gPEZJTEU+JylcbiAgICAgICAgICAgIC5vcHRpb24oJy0tb3V0LWRpciA8RElSPicpXG4gICAgICAgICAgICAuYWN0aW9uKCguLi5hKSA9PiB0aGlzLnBhcnNlKC4uLmEpKTtcblxuICAgICAgICBhd2FpdCBwcm9nLnBhcnNlQXN5bmMocHJvY2Vzcy5hcmd2KTtcbiAgICAgICAgcmV0dXJuIHRoaXMucmM7XG4gICAgfVxuXG4gICAgYXN5bmMgcGFyc2UoZmlsZW5hbWVzPzogc3RyaW5nW10sIG9wdHM/OiB7bz86IHN0cmluZywgb3V0RGlyPzogc3RyaW5nfSkge1xuICAgICAgICB2YXIgcGFyc2VyID0gbmV3IEM5OVBhcnNlcigpO1xuICAgICAgICBmb3IgKGxldCBpbmZuIG9mIGZpbGVuYW1lcykge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICB2YXIgdGV4dCA9IGZzLnJlYWRGaWxlU3luYyhpbmZuLCAndXRmLTgnKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihgY2Fubm90IHJlYWQgJHtpbmZufTogJHtlfWApO1xuICAgICAgICAgICAgICAgIHRoaXMucmMgPSAxOyBjb250aW51ZTsgXG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB2YXIgb3V0Zm4gPSBvcHRzLm8gPz8gaW5mbiArICcuYXN0Lmpzb24nO1xuICAgICAgICAgICAgaWYgKG9wdHMub3V0RGlyKVxuICAgICAgICAgICAgICAgIG91dGZuID0gcGF0aC5qb2luKG9wdHMub3V0RGlyLCBwYXRoLmJhc2VuYW1lKG91dGZuKSk7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHZhciBhc3QgPSBwYXJzZXIucGFyc2UodGV4dCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXRjaCAoZSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoYGluICR7aW5mbn06XFxuJHtlfWApO1xuICAgICAgICAgICAgICAgIHRoaXMucmMgPSAxOyBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIFxuICAgICAgICAgICAgdmFyIG91dCA9IEpTT04uc3RyaW5naWZ5KGFzdCwgbnVsbCwgMSk7XG5cbiAgICAgICAgICAgIGlmIChvdXRmbiA9PSAnLScpIHtcbiAgICAgICAgICAgICAgICBhd2FpdCBuZXcgUHJvbWlzZShyZXNvbHZlID0+XG4gICAgICAgICAgICAgICAgICAgIHByb2Nlc3Muc3Rkb3V0LndyaXRlKG91dCwgcmVzb2x2ZSkpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYCR7aW5mbn0gIC0tPiAgJHtvdXRmbn1gKTtcbiAgICAgICAgICAgICAgICBta2RpcnAuc3luYyhwYXRoLmRpcm5hbWUob3V0Zm4pKTtcbiAgICAgICAgICAgICAgICBmcy53cml0ZUZpbGVTeW5jKG91dGZuLCBvdXQpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuXG5cbm5ldyBDTEkoKS5tYWluKCkudGhlbigocmMpID0+IHByb2Nlc3MuZXhpdChyYykpOyJdfQ==
};
kremlin.m['sindarin.compiler@0.1.0:package.json'] = (module,exports) => (module.exports =
{
    "name": "sindarin.compiler",
    "version": "0.1.0",
    "main": "dist/index.html",
    "scripts": {
        "build": "prettier --write src/; webpack --mode production",
        "format": "prettier --write src/",
        "watch": "webpack serve --mode development",
        "start:nw": "webpack --target nwjs --mode production; nw&",
        "start:dev": "npm run watch",
        "deploy:github": "node gh-pages.js",
        "qa:build-mujs": "kremlin data/typescript/net-server.ts && babel build/kremlin/net-server.js > build/kremlin/net-server.mu.js"
    },
    "dependencies": {
        "commander": "^7.2.0",
        "mkdirp": "^0.5.5",
        "monaco-editor-webpack-plugin": "^3.0.1",
        "nearley": "^2.20.1",
        "react": "^17.0.1",
        "react-dom": "^17.0.1",
        "react-monaco-editor": "^0.42.0",
        "react-spinners": "^0.10.6",
        "uuid": "^8.3.2",
        "vis-data": "^7.1.2",
        "vis-network": "^9.0.3"
    },
    "devDependencies": {
        "@babel/cli": "^7.12.10",
        "@babel/core": "^7.13.8",
        "@babel/preset-env": "^7.13.9",
        "@babel/preset-react": "^7.12.13",
        "@types/lodash.debounce": "^4.0.6",
        "@types/mkdirp": "^1.0.1",
        "@types/moo": "^0.5.4",
        "@types/nearley": "^2.11.1",
        "@types/node": "^13.13.4",
        "@types/react": "^17.0.3",
        "@types/react-dom": "^17.0.2",
        "@types/uuid": "^8.3.0",
        "babel-loader": "^8.2.2",
        "copy-webpack-plugin": "^8.0.0",
        "css-loader": "^5.1.1",
        "gh-pages": "^3.1.0",
        "html-webpack-plugin": "^5.2.0",
        "prettier": "2.2.1",
        "react-hot-loader": "^4.13.0",
        "sass": "^1.32.8",
        "sass-loader": "^11.0.1",
        "style-loader": "^2.0.0",
        "ts-loader": "^8.0.17",
        "typescript": "^4.2.3",
        "webpack": "^5.24.4",
        "webpack-cli": "^4.5.0",
        "webpack-dev-server": "^3.11.2"
    },
    "chromium-args": "--load-extension='./node_modules/nw-vue-devtools-prebuilt/extension'"
}
);
kremlin.m['commander@7.2.0:index.js'] = (module,exports,global) => {/**
 * Module dependencies.
 */

const EventEmitter = require('events').EventEmitter;
const childProcess = require('child_process');
const path = require('path');
const fs = require('fs');

// @ts-check

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help {
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      const args = cmd._helpCommandnameAndArgs.split(/ +/);
      const helpCommand = cmd.createCommand(args.shift())
        .helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      helpCommand._parseExpectedArgs(args);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      const getSortKey = (option) => {
        // WYSIWYG for order displayed in help with short before long, no special handling for negated.
        return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
      };
      visibleOptions.sort((a, b) => {
        return getSortKey(a).localeCompare(getSortKey(b));
      });
    }
    return visibleOptions;
  }

  /**
   * Get an array of the arguments which have descriptions.
   *
   * @param {Command} cmd
   * @returns {{ term: string, description:string }[]}
   */

  visibleArguments(cmd) {
    if (cmd._argsDescription && cmd._args.length) {
      return cmd._args.map((argument) => {
        return { term: argument.name, description: cmd._argsDescription[argument.name] || '' };
      }, 0);
    }
    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '');
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(max, helper.subcommandTerm(command).length);
    }, 0);
  };

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  };

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(max, argument.term.length);
    }, 0);
  };

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
    }
    return parentCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the command description to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    if (option.negate) {
      return option.description;
    }
    const extraInfo = [];
    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      return `${option.description} (${extraInfo.join(', ')})`;
    }
    return option.description;
  };

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    function formatItem(term, description) {
      if (description) {
        const fullText = `${term.padEnd(termWidth + itemSeparatorWidth)}${description}`;
        return helper.wrap(fullText, helpWidth - itemIndentWidth, termWidth + itemSeparatorWidth);
      }
      return term;
    };
    function formatList(textArray) {
      return textArray.join('\n').replace(/^/gm, ' '.repeat(itemIndentWidth));
    }

    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([commandDescription, '']);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(argument.term, argument.description);
    });
    if (argumentList.length > 0) {
      output = output.concat(['Arguments:', formatList(argumentList), '']);
    }

    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => {
      return formatItem(helper.optionTerm(option), helper.optionDescription(option));
    });
    if (optionList.length > 0) {
      output = output.concat(['Options:', formatList(optionList), '']);
    }

    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => {
      return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
    });
    if (commandList.length > 0) {
      output = output.concat(['Commands:', formatList(commandList), '']);
    }

    return output.join('\n');
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  };

  /**
   * Wrap the given string to width characters per line, with lines after the first indented.
   * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
   *
   * @param {string} str
   * @param {number} width
   * @param {number} indent
   * @param {number} [minColumnWidth=40]
   * @return {string}
   *
   */

  wrap(str, width, indent, minColumnWidth = 40) {
    // Detect manually wrapped and indented strings by searching for line breaks
    // followed by multiple spaces/tabs.
    if (str.match(/[\n]\s+/)) return str;
    // Do not wrap if not enough room for a wrapped column of text (as could end up with a word per line).
    const columnWidth = width - indent;
    if (columnWidth < minColumnWidth) return str;

    const leadingStr = str.substr(0, indent);
    const columnText = str.substr(indent);

    const indentString = ' '.repeat(indent);
    const regex = new RegExp('.{1,' + (columnWidth - 1) + '}([\\s\u200B]|$)|[^\\s\u200B]+?([\\s\u200B]|$)', 'g');
    const lines = columnText.match(regex) || [];
    return leadingStr + lines.map((line, i) => {
      if (line.slice(-1) === '\n') {
        line = line.slice(0, line.length - 1);
      }
      return ((i > 0) ? indentString : '') + line.trimRight();
    }).join('\n');
  }
}

class Option {
  /**
   * Initialize a new `Option` with the given `flags` and `description`.
   *
   * @param {string} flags
   * @param {string} [description]
   */

  constructor(flags, description) {
    this.flags = flags;
    this.description = description || '';

    this.required = flags.includes('<'); // A value must be supplied when the option is specified.
    this.optional = flags.includes('['); // A value is optional when the option is specified.
    // variadic test ignores <value,...> et al which might be used to describe custom splitting of single argument
    this.variadic = /\w\.\.\.[>\]]$/.test(flags); // The option can take multiple values.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    const optionFlags = _parseOptionFlags(flags);
    this.short = optionFlags.shortFlag;
    this.long = optionFlags.longFlag;
    this.negate = false;
    if (this.long) {
      this.negate = this.long.startsWith('--no-');
    }
    this.defaultValue = undefined;
    this.defaultValueDescription = undefined;
    this.parseArg = undefined;
    this.hidden = false;
    this.argChoices = undefined;
  }

  /**
   * Set the default value, and optionally supply the description to be displayed in the help.
   *
   * @param {any} value
   * @param {string} [description]
   * @return {Option}
   */

  default(value, description) {
    this.defaultValue = value;
    this.defaultValueDescription = description;
    return this;
  };

  /**
   * Set the custom handler for processing CLI option arguments into option values.
   *
   * @param {Function} [fn]
   * @return {Option}
   */

  argParser(fn) {
    this.parseArg = fn;
    return this;
  };

  /**
   * Whether the option is mandatory and must have a value after parsing.
   *
   * @param {boolean} [mandatory=true]
   * @return {Option}
   */

  makeOptionMandatory(mandatory = true) {
    this.mandatory = !!mandatory;
    return this;
  };

  /**
   * Hide option in help.
   *
   * @param {boolean} [hide=true]
   * @return {Option}
   */

  hideHelp(hide = true) {
    this.hidden = !!hide;
    return this;
  };

  /**
   * @api private
   */

  _concatValue(value, previous) {
    if (previous === this.defaultValue || !Array.isArray(previous)) {
      return [value];
    }

    return previous.concat(value);
  }

  /**
   * Only allow option value to be one of choices.
   *
   * @param {string[]} values
   * @return {Option}
   */

  choices(values) {
    this.argChoices = values;
    this.parseArg = (arg, previous) => {
      if (!values.includes(arg)) {
        throw new InvalidOptionArgumentError(`Allowed choices are ${values.join(', ')}.`);
      }
      if (this.variadic) {
        return this._concatValue(arg, previous);
      }
      return arg;
    };
    return this;
  };

  /**
   * Return option name.
   *
   * @return {string}
   */

  name() {
    if (this.long) {
      return this.long.replace(/^--/, '');
    }
    return this.short.replace(/^-/, '');
  };

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {string}
   * @api private
   */

  attributeName() {
    return camelcase(this.name().replace(/^no-/, ''));
  };

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   * @api private
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  };
}

/**
 * CommanderError class
 * @class
 */
class CommanderError extends Error {
  /**
   * Constructs the CommanderError class
   * @param {number} exitCode suggested exit code which could be used with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @constructor
   */
  constructor(exitCode, code, message) {
    super(message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
    this.code = code;
    this.exitCode = exitCode;
    this.nestedError = undefined;
  }
}

/**
 * InvalidOptionArgumentError class
 * @class
 */
class InvalidOptionArgumentError extends CommanderError {
  /**
   * Constructs the InvalidOptionArgumentError class
   * @param {string} [message] explanation of why argument is invalid
   * @constructor
   */
  constructor(message) {
    super(1, 'commander.invalidOptionArgument', message);
    // properly capture stack trace in Node.js
    Error.captureStackTrace(this, this.constructor);
    this.name = this.constructor.name;
  }
}

class Command extends EventEmitter {
  /**
   * Initialize a new `Command`.
   *
   * @param {string} [name]
   */

  constructor(name) {
    super();
    this.commands = [];
    this.options = [];
    this.parent = null;
    this._allowUnknownOption = false;
    this._allowExcessArguments = true;
    this._args = [];
    this.rawArgs = null;
    this._scriptPath = null;
    this._name = name || '';
    this._optionValues = {};
    this._storeOptionsAsProperties = false;
    this._actionResults = [];
    this._actionHandler = null;
    this._executableHandler = false;
    this._executableFile = null; // custom name for executable
    this._defaultCommandName = null;
    this._exitCallback = null;
    this._aliases = [];
    this._combineFlagAndOptionalValue = true;
    this._description = '';
    this._argsDescription = undefined;
    this._enablePositionalOptions = false;
    this._passThroughOptions = false;

    // see .configureOutput() for docs
    this._outputConfiguration = {
      writeOut: (str) => process.stdout.write(str),
      writeErr: (str) => process.stderr.write(str),
      getOutHelpWidth: () => process.stdout.isTTY ? process.stdout.columns : undefined,
      getErrHelpWidth: () => process.stderr.isTTY ? process.stderr.columns : undefined,
      outputError: (str, write) => write(str)
    };

    this._hidden = false;
    this._hasHelpOption = true;
    this._helpFlags = '-h, --help';
    this._helpDescription = 'display help for command';
    this._helpShortFlag = '-h';
    this._helpLongFlag = '--help';
    this._addImplicitHelpCommand = undefined; // Deliberately undefined, not decided whether true or false
    this._helpCommandName = 'help';
    this._helpCommandnameAndArgs = 'help [command]';
    this._helpCommandDescription = 'display help for command';
    this._helpConfiguration = {};
  }

  /**
   * Define a command.
   *
   * There are two styles of command: pay attention to where to put the description.
   *
   * Examples:
   *
   *      // Command implemented using action handler (description is supplied separately to `.command`)
   *      program
   *        .command('clone <source> [destination]')
   *        .description('clone a repository into a newly created directory')
   *        .action((source, destination) => {
   *          console.log('clone command called');
   *        });
   *
   *      // Command implemented using separate executable file (description is second parameter to `.command`)
   *      program
   *        .command('start <service>', 'start named service')
   *        .command('stop [service]', 'stop named service, or all if no name supplied');
   *
   * @param {string} nameAndArgs - command name and arguments, args are `<required>` or `[optional]` and last may also be `variadic...`
   * @param {Object|string} [actionOptsOrExecDesc] - configuration options (for action), or description (for executable)
   * @param {Object} [execOpts] - configuration options (for executable)
   * @return {Command} returns new command for action handler, or `this` for executable command
   */

  command(nameAndArgs, actionOptsOrExecDesc, execOpts) {
    let desc = actionOptsOrExecDesc;
    let opts = execOpts;
    if (typeof desc === 'object' && desc !== null) {
      opts = desc;
      desc = null;
    }
    opts = opts || {};
    const args = nameAndArgs.split(/ +/);
    const cmd = this.createCommand(args.shift());

    if (desc) {
      cmd.description(desc);
      cmd._executableHandler = true;
    }
    if (opts.isDefault) this._defaultCommandName = cmd._name;

    cmd._outputConfiguration = this._outputConfiguration;

    cmd._hidden = !!(opts.noHelp || opts.hidden); // noHelp is deprecated old name for hidden
    cmd._hasHelpOption = this._hasHelpOption;
    cmd._helpFlags = this._helpFlags;
    cmd._helpDescription = this._helpDescription;
    cmd._helpShortFlag = this._helpShortFlag;
    cmd._helpLongFlag = this._helpLongFlag;
    cmd._helpCommandName = this._helpCommandName;
    cmd._helpCommandnameAndArgs = this._helpCommandnameAndArgs;
    cmd._helpCommandDescription = this._helpCommandDescription;
    cmd._helpConfiguration = this._helpConfiguration;
    cmd._exitCallback = this._exitCallback;
    cmd._storeOptionsAsProperties = this._storeOptionsAsProperties;
    cmd._combineFlagAndOptionalValue = this._combineFlagAndOptionalValue;
    cmd._allowExcessArguments = this._allowExcessArguments;
    cmd._enablePositionalOptions = this._enablePositionalOptions;

    cmd._executableFile = opts.executableFile || null; // Custom name for executable file, set missing to null to match constructor
    this.commands.push(cmd);
    cmd._parseExpectedArgs(args);
    cmd.parent = this;

    if (desc) return this;
    return cmd;
  };

  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new Command(name);
  };

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  };

  /**
   * You can customise the help by overriding Help properties using configureHelp(),
   * or with a subclass of Help by overriding createHelp().
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureHelp(configuration) {
    if (configuration === undefined) return this._helpConfiguration;

    this._helpConfiguration = configuration;
    return this;
  }

  /**
   * The default output goes to stdout and stderr. You can customise this for special
   * applications. You can also customise the display of errors by overriding outputError.
   *
   * The configuration properties are all functions:
   *
   *    // functions to change where being written, stdout and stderr
   *    writeOut(str)
   *    writeErr(str)
   *    // matching functions to specify width for wrapping help
   *    getOutHelpWidth()
   *    getErrHelpWidth()
   *    // functions based on what is being written out
   *    outputError(str, write) // used for displaying errors, and not used for displaying help
   *
   * @param {Object} [configuration] - configuration options
   * @return {Command|Object} `this` command for chaining, or stored configuration
   */

  configureOutput(configuration) {
    if (configuration === undefined) return this._outputConfiguration;

    Object.assign(this._outputConfiguration, configuration);
    return this;
  }

  /**
   * Add a prepared subcommand.
   *
   * See .command() for creating an attached subcommand which inherits settings from its parent.
   *
   * @param {Command} cmd - new subcommand
   * @param {Object} [opts] - configuration options
   * @return {Command} `this` command for chaining
   */

  addCommand(cmd, opts) {
    if (!cmd._name) throw new Error('Command passed to .addCommand() must have a name');

    // To keep things simple, block automatic name generation for deeply nested executables.
    // Fail fast and detect when adding rather than later when parsing.
    function checkExplicitNames(commandArray) {
      commandArray.forEach((cmd) => {
        if (cmd._executableHandler && !cmd._executableFile) {
          throw new Error(`Must specify executableFile for deeply nested executable: ${cmd.name()}`);
        }
        checkExplicitNames(cmd.commands);
      });
    }
    checkExplicitNames(cmd.commands);

    opts = opts || {};
    if (opts.isDefault) this._defaultCommandName = cmd._name;
    if (opts.noHelp || opts.hidden) cmd._hidden = true; // modifying passed command due to existing implementation

    this.commands.push(cmd);
    cmd.parent = this;
    return this;
  };

  /**
   * Define argument syntax for the command.
   */

  arguments(desc) {
    return this._parseExpectedArgs(desc.split(/ +/));
  };

  /**
   * Override default decision whether to add implicit help command.
   *
   *    addHelpCommand() // force on
   *    addHelpCommand(false); // force off
   *    addHelpCommand('help [cmd]', 'display help for [cmd]'); // force on with custom details
   *
   * @return {Command} `this` command for chaining
   */

  addHelpCommand(enableOrNameAndArgs, description) {
    if (enableOrNameAndArgs === false) {
      this._addImplicitHelpCommand = false;
    } else {
      this._addImplicitHelpCommand = true;
      if (typeof enableOrNameAndArgs === 'string') {
        this._helpCommandName = enableOrNameAndArgs.split(' ')[0];
        this._helpCommandnameAndArgs = enableOrNameAndArgs;
      }
      this._helpCommandDescription = description || this._helpCommandDescription;
    }
    return this;
  };

  /**
   * @return {boolean}
   * @api private
   */

  _hasImplicitHelpCommand() {
    if (this._addImplicitHelpCommand === undefined) {
      return this.commands.length && !this._actionHandler && !this._findCommand('help');
    }
    return this._addImplicitHelpCommand;
  };

  /**
   * Parse expected `args`.
   *
   * For example `["[type]"]` becomes `[{ required: false, name: 'type' }]`.
   *
   * @param {Array} args
   * @return {Command} `this` command for chaining
   * @api private
   */

  _parseExpectedArgs(args) {
    if (!args.length) return;
    args.forEach((arg) => {
      const argDetails = {
        required: false,
        name: '',
        variadic: false
      };

      switch (arg[0]) {
        case '<':
          argDetails.required = true;
          argDetails.name = arg.slice(1, -1);
          break;
        case '[':
          argDetails.name = arg.slice(1, -1);
          break;
      }

      if (argDetails.name.length > 3 && argDetails.name.slice(-3) === '...') {
        argDetails.variadic = true;
        argDetails.name = argDetails.name.slice(0, -3);
      }
      if (argDetails.name) {
        this._args.push(argDetails);
      }
    });
    this._args.forEach((arg, i) => {
      if (arg.variadic && i < this._args.length - 1) {
        throw new Error(`only the last argument can be variadic '${arg.name}'`);
      }
    });
    return this;
  };

  /**
   * Register callback to use as replacement for calling process.exit.
   *
   * @param {Function} [fn] optional callback which will be passed a CommanderError, defaults to throwing
   * @return {Command} `this` command for chaining
   */

  exitOverride(fn) {
    if (fn) {
      this._exitCallback = fn;
    } else {
      this._exitCallback = (err) => {
        if (err.code !== 'commander.executeSubCommandAsync') {
          throw err;
        } else {
          // Async callback from spawn events, not useful to throw.
        }
      };
    }
    return this;
  };

  /**
   * Call process.exit, and _exitCallback if defined.
   *
   * @param {number} exitCode exit code for using with process.exit
   * @param {string} code an id string representing the error
   * @param {string} message human-readable description of the error
   * @return never
   * @api private
   */

  _exit(exitCode, code, message) {
    if (this._exitCallback) {
      this._exitCallback(new CommanderError(exitCode, code, message));
      // Expecting this line is not reached.
    }
    process.exit(exitCode);
  };

  /**
   * Register callback `fn` for the command.
   *
   * Examples:
   *
   *      program
   *        .command('help')
   *        .description('display verbose help')
   *        .action(function() {
   *           // output help here
   *        });
   *
   * @param {Function} fn
   * @return {Command} `this` command for chaining
   */

  action(fn) {
    const listener = (args) => {
      // The .action callback takes an extra parameter which is the command or options.
      const expectedArgsCount = this._args.length;
      const actionArgs = args.slice(0, expectedArgsCount);
      if (this._storeOptionsAsProperties) {
        actionArgs[expectedArgsCount] = this; // backwards compatible "options"
      } else {
        actionArgs[expectedArgsCount] = this.opts();
      }
      actionArgs.push(this);

      const actionResult = fn.apply(this, actionArgs);
      // Remember result in case it is async. Assume parseAsync getting called on root.
      let rootCommand = this;
      while (rootCommand.parent) {
        rootCommand = rootCommand.parent;
      }
      rootCommand._actionResults.push(actionResult);
    };
    this._actionHandler = listener;
    return this;
  };

  /**
   * Factory routine to create a new unattached option.
   *
   * See .option() for creating an attached option, which uses this routine to
   * create the option. You can override createOption to return a custom option.
   *
   * @param {string} flags
   * @param {string} [description]
   * @return {Option} new option
   */

  createOption(flags, description) {
    return new Option(flags, description);
  };

  /**
   * Add an option.
   *
   * @param {Option} option
   * @return {Command} `this` command for chaining
   */
  addOption(option) {
    const oname = option.name();
    const name = option.attributeName();

    let defaultValue = option.defaultValue;

    // preassign default value for --no-*, [optional], <required>, or plain flag if boolean value
    if (option.negate || option.optional || option.required || typeof defaultValue === 'boolean') {
      // when --no-foo we make sure default is true, unless a --foo option is already defined
      if (option.negate) {
        const positiveLongFlag = option.long.replace(/^--no-/, '--');
        defaultValue = this._findOption(positiveLongFlag) ? this._getOptionValue(name) : true;
      }
      // preassign only if we have a default
      if (defaultValue !== undefined) {
        this._setOptionValue(name, defaultValue);
      }
    }

    // register the option
    this.options.push(option);

    // when it's passed assign the value
    // and conditionally invoke the callback
    this.on('option:' + oname, (val) => {
      const oldValue = this._getOptionValue(name);

      // custom processing
      if (val !== null && option.parseArg) {
        try {
          val = option.parseArg(val, oldValue === undefined ? defaultValue : oldValue);
        } catch (err) {
          if (err.code === 'commander.invalidOptionArgument') {
            const message = `error: option '${option.flags}' argument '${val}' is invalid. ${err.message}`;
            this._displayError(err.exitCode, err.code, message);
          }
          throw err;
        }
      } else if (val !== null && option.variadic) {
        val = option._concatValue(val, oldValue);
      }

      // unassigned or boolean value
      if (typeof oldValue === 'boolean' || typeof oldValue === 'undefined') {
        // if no value, negate false, and we have a default, then use it!
        if (val == null) {
          this._setOptionValue(name, option.negate
            ? false
            : defaultValue || true);
        } else {
          this._setOptionValue(name, val);
        }
      } else if (val !== null) {
        // reassign
        this._setOptionValue(name, option.negate ? false : val);
      }
    });

    return this;
  }

  /**
   * Internal implementation shared by .option() and .requiredOption()
   *
   * @api private
   */
  _optionEx(config, flags, description, fn, defaultValue) {
    const option = this.createOption(flags, description);
    option.makeOptionMandatory(!!config.mandatory);
    if (typeof fn === 'function') {
      option.default(defaultValue).argParser(fn);
    } else if (fn instanceof RegExp) {
      // deprecated
      const regex = fn;
      fn = (val, def) => {
        const m = regex.exec(val);
        return m ? m[0] : def;
      };
      option.default(defaultValue).argParser(fn);
    } else {
      option.default(fn);
    }

    return this.addOption(option);
  }

  /**
   * Define option with `flags`, `description` and optional
   * coercion `fn`.
   *
   * The `flags` string contains the short and/or long flags,
   * separated by comma, a pipe or space. The following are all valid
   * all will output this way when `--help` is used.
   *
   *    "-p, --pepper"
   *    "-p|--pepper"
   *    "-p --pepper"
   *
   * Examples:
   *
   *     // simple boolean defaulting to undefined
   *     program.option('-p, --pepper', 'add pepper');
   *
   *     program.pepper
   *     // => undefined
   *
   *     --pepper
   *     program.pepper
   *     // => true
   *
   *     // simple boolean defaulting to true (unless non-negated option is also defined)
   *     program.option('-C, --no-cheese', 'remove cheese');
   *
   *     program.cheese
   *     // => true
   *
   *     --no-cheese
   *     program.cheese
   *     // => false
   *
   *     // required argument
   *     program.option('-C, --chdir <path>', 'change the working directory');
   *
   *     --chdir /tmp
   *     program.chdir
   *     // => "/tmp"
   *
   *     // optional argument
   *     program.option('-c, --cheese [type]', 'add cheese [marble]');
   *
   * @param {string} flags
   * @param {string} [description]
   * @param {Function|*} [fn] - custom option processing function or default value
   * @param {*} [defaultValue]
   * @return {Command} `this` command for chaining
   */

  option(flags, description, fn, defaultValue) {
    return this._optionEx({}, flags, description, fn, defaultValue);
  };

  /**
  * Add a required option which must have a value after parsing. This usually means
  * the option must be specified on the command line. (Otherwise the same as .option().)
  *
  * The `flags` string contains the short and/or long flags, separated by comma, a pipe or space.
  *
  * @param {string} flags
  * @param {string} [description]
  * @param {Function|*} [fn] - custom option processing function or default value
  * @param {*} [defaultValue]
  * @return {Command} `this` command for chaining
  */

  requiredOption(flags, description, fn, defaultValue) {
    return this._optionEx({ mandatory: true }, flags, description, fn, defaultValue);
  };

  /**
   * Alter parsing of short flags with optional values.
   *
   * Examples:
   *
   *    // for `.option('-f,--flag [value]'):
   *    .combineFlagAndOptionalValue(true)  // `-f80` is treated like `--flag=80`, this is the default behaviour
   *    .combineFlagAndOptionalValue(false) // `-fb` is treated like `-f -b`
   *
   * @param {Boolean} [combine=true] - if `true` or omitted, an optional value can be specified directly after the flag.
   */
  combineFlagAndOptionalValue(combine = true) {
    this._combineFlagAndOptionalValue = !!combine;
    return this;
  };

  /**
   * Allow unknown options on the command line.
   *
   * @param {Boolean} [allowUnknown=true] - if `true` or omitted, no error will be thrown
   * for unknown options.
   */
  allowUnknownOption(allowUnknown = true) {
    this._allowUnknownOption = !!allowUnknown;
    return this;
  };

  /**
   * Allow excess command-arguments on the command line. Pass false to make excess arguments an error.
   *
   * @param {Boolean} [allowExcess=true] - if `true` or omitted, no error will be thrown
   * for excess arguments.
   */
  allowExcessArguments(allowExcess = true) {
    this._allowExcessArguments = !!allowExcess;
    return this;
  };

  /**
   * Enable positional options. Positional means global options are specified before subcommands which lets
   * subcommands reuse the same option names, and also enables subcommands to turn on passThroughOptions.
   * The default behaviour is non-positional and global options may appear anywhere on the command line.
   *
   * @param {Boolean} [positional=true]
   */
  enablePositionalOptions(positional = true) {
    this._enablePositionalOptions = !!positional;
    return this;
  };

  /**
   * Pass through options that come after command-arguments rather than treat them as command-options,
   * so actual command-options come before command-arguments. Turning this on for a subcommand requires
   * positional options to have been enabled on the program (parent commands).
   * The default behaviour is non-positional and options may appear before or after command-arguments.
   *
   * @param {Boolean} [passThrough=true]
   * for unknown options.
   */
  passThroughOptions(passThrough = true) {
    this._passThroughOptions = !!passThrough;
    if (!!this.parent && passThrough && !this.parent._enablePositionalOptions) {
      throw new Error('passThroughOptions can not be used without turning on enablePositionalOptions for parent command(s)');
    }
    return this;
  };

  /**
    * Whether to store option values as properties on command object,
    * or store separately (specify false). In both cases the option values can be accessed using .opts().
    *
    * @param {boolean} [storeAsProperties=true]
    * @return {Command} `this` command for chaining
    */

  storeOptionsAsProperties(storeAsProperties = true) {
    this._storeOptionsAsProperties = !!storeAsProperties;
    if (this.options.length) {
      throw new Error('call .storeOptionsAsProperties() before adding options');
    }
    return this;
  };

  /**
   * Store option value
   *
   * @param {string} key
   * @param {Object} value
   * @api private
   */

  _setOptionValue(key, value) {
    if (this._storeOptionsAsProperties) {
      this[key] = value;
    } else {
      this._optionValues[key] = value;
    }
  };

  /**
   * Retrieve option value
   *
   * @param {string} key
   * @return {Object} value
   * @api private
   */

  _getOptionValue(key) {
    if (this._storeOptionsAsProperties) {
      return this[key];
    }
    return this._optionValues[key];
  };

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * Examples:
   *
   *      program.parse(process.argv);
   *      program.parse(); // implicitly use process.argv and auto-detect node vs electron conventions
   *      program.parse(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv] - optional, defaults to process.argv
   * @param {Object} [parseOptions] - optionally specify style of options with from: node/user/electron
   * @param {string} [parseOptions.from] - where the args are from: 'node', 'user', 'electron'
   * @return {Command} `this` command for chaining
   */

  parse(argv, parseOptions) {
    if (argv !== undefined && !Array.isArray(argv)) {
      throw new Error('first parameter to parse must be array or undefined');
    }
    parseOptions = parseOptions || {};

    // Default to using process.argv
    if (argv === undefined) {
      argv = process.argv;
      // @ts-ignore: unknown property
      if (process.versions && process.versions.electron) {
        parseOptions.from = 'electron';
      }
    }
    this.rawArgs = argv.slice();

    // make it a little easier for callers by supporting various argv conventions
    let userArgs;
    switch (parseOptions.from) {
      case undefined:
      case 'node':
        this._scriptPath = argv[1];
        userArgs = argv.slice(2);
        break;
      case 'electron':
        // @ts-ignore: unknown property
        if (process.defaultApp) {
          this._scriptPath = argv[1];
          userArgs = argv.slice(2);
        } else {
          userArgs = argv.slice(1);
        }
        break;
      case 'user':
        userArgs = argv.slice(0);
        break;
      default:
        throw new Error(`unexpected parse option { from: '${parseOptions.from}' }`);
    }
    if (!this._scriptPath && require.main) {
      this._scriptPath = require.main.filename;
    }

    // Guess name, used in usage in help.
    this._name = this._name || (this._scriptPath && path.basename(this._scriptPath, path.extname(this._scriptPath)));

    // Let's go!
    this._parseCommand([], userArgs);

    return this;
  };

  /**
   * Parse `argv`, setting options and invoking commands when defined.
   *
   * Use parseAsync instead of parse if any of your action handlers are async. Returns a Promise.
   *
   * The default expectation is that the arguments are from node and have the application as argv[0]
   * and the script being run in argv[1], with user parameters after that.
   *
   * Examples:
   *
   *      program.parseAsync(process.argv);
   *      program.parseAsync(); // implicitly use process.argv and auto-detect node vs electron conventions
   *      program.parseAsync(my-args, { from: 'user' }); // just user supplied arguments, nothing special about argv[0]
   *
   * @param {string[]} [argv]
   * @param {Object} [parseOptions]
   * @param {string} parseOptions.from - where the args are from: 'node', 'user', 'electron'
   * @return {Promise}
   */

  parseAsync(argv, parseOptions) {
    this.parse(argv, parseOptions);
    return Promise.all(this._actionResults).then(() => this);
  };

  /**
   * Execute a sub-command executable.
   *
   * @api private
   */

  _executeSubCommand(subcommand, args) {
    args = args.slice();
    let launchWithNode = false; // Use node for source targets so do not need to get permissions correct, and on Windows.
    const sourceExt = ['.js', '.ts', '.tsx', '.mjs', '.cjs'];

    // Not checking for help first. Unlikely to have mandatory and executable, and can't robustly test for help flags in external command.
    this._checkForMissingMandatoryOptions();

    // Want the entry script as the reference for command name and directory for searching for other files.
    let scriptPath = this._scriptPath;
    // Fallback in case not set, due to how Command created or called.
    if (!scriptPath && require.main) {
      scriptPath = require.main.filename;
    }

    let baseDir;
    try {
      const resolvedLink = fs.realpathSync(scriptPath);
      baseDir = path.dirname(resolvedLink);
    } catch (e) {
      baseDir = '.'; // dummy, probably not going to find executable!
    }

    // name of the subcommand, like `pm-install`
    let bin = path.basename(scriptPath, path.extname(scriptPath)) + '-' + subcommand._name;
    if (subcommand._executableFile) {
      bin = subcommand._executableFile;
    }

    const localBin = path.join(baseDir, bin);
    if (fs.existsSync(localBin)) {
      // prefer local `./<bin>` to bin in the $PATH
      bin = localBin;
    } else {
      // Look for source files.
      sourceExt.forEach((ext) => {
        if (fs.existsSync(`${localBin}${ext}`)) {
          bin = `${localBin}${ext}`;
        }
      });
    }
    launchWithNode = sourceExt.includes(path.extname(bin));

    let proc;
    if (process.platform !== 'win32') {
      if (launchWithNode) {
        args.unshift(bin);
        // add executable arguments to spawn
        args = incrementNodeInspectorPort(process.execArgv).concat(args);

        proc = childProcess.spawn(process.argv[0], args, { stdio: 'inherit' });
      } else {
        proc = childProcess.spawn(bin, args, { stdio: 'inherit' });
      }
    } else {
      args.unshift(bin);
      // add executable arguments to spawn
      args = incrementNodeInspectorPort(process.execArgv).concat(args);
      proc = childProcess.spawn(process.execPath, args, { stdio: 'inherit' });
    }

    const signals = ['SIGUSR1', 'SIGUSR2', 'SIGTERM', 'SIGINT', 'SIGHUP'];
    signals.forEach((signal) => {
      // @ts-ignore
      process.on(signal, () => {
        if (proc.killed === false && proc.exitCode === null) {
          proc.kill(signal);
        }
      });
    });

    // By default terminate process when spawned process terminates.
    // Suppressing the exit if exitCallback defined is a bit messy and of limited use, but does allow process to stay running!
    const exitCallback = this._exitCallback;
    if (!exitCallback) {
      proc.on('close', process.exit.bind(process));
    } else {
      proc.on('close', () => {
        exitCallback(new CommanderError(process.exitCode || 0, 'commander.executeSubCommandAsync', '(close)'));
      });
    }
    proc.on('error', (err) => {
      // @ts-ignore
      if (err.code === 'ENOENT') {
        const executableMissing = `'${bin}' does not exist
 - if '${subcommand._name}' is not meant to be an executable command, remove description parameter from '.command()' and use '.description()' instead
 - if the default executable name is not suitable, use the executableFile option to supply a custom name`;
        throw new Error(executableMissing);
      // @ts-ignore
      } else if (err.code === 'EACCES') {
        throw new Error(`'${bin}' not executable`);
      }
      if (!exitCallback) {
        process.exit(1);
      } else {
        const wrappedError = new CommanderError(1, 'commander.executeSubCommandAsync', '(error)');
        wrappedError.nestedError = err;
        exitCallback(wrappedError);
      }
    });

    // Store the reference to the child process
    this.runningCommand = proc;
  };

  /**
   * @api private
   */
  _dispatchSubcommand(commandName, operands, unknown) {
    const subCommand = this._findCommand(commandName);
    if (!subCommand) this.help({ error: true });

    if (subCommand._executableHandler) {
      this._executeSubCommand(subCommand, operands.concat(unknown));
    } else {
      subCommand._parseCommand(operands, unknown);
    }
  };

  /**
   * Process arguments in context of this command.
   *
   * @api private
   */

  _parseCommand(operands, unknown) {
    const parsed = this.parseOptions(unknown);
    operands = operands.concat(parsed.operands);
    unknown = parsed.unknown;
    this.args = operands.concat(unknown);

    if (operands && this._findCommand(operands[0])) {
      this._dispatchSubcommand(operands[0], operands.slice(1), unknown);
    } else if (this._hasImplicitHelpCommand() && operands[0] === this._helpCommandName) {
      if (operands.length === 1) {
        this.help();
      } else {
        this._dispatchSubcommand(operands[1], [], [this._helpLongFlag]);
      }
    } else if (this._defaultCommandName) {
      outputHelpIfRequested(this, unknown); // Run the help for default command from parent rather than passing to default command
      this._dispatchSubcommand(this._defaultCommandName, operands, unknown);
    } else {
      if (this.commands.length && this.args.length === 0 && !this._actionHandler && !this._defaultCommandName) {
        // probably missing subcommand and no handler, user needs help
        this.help({ error: true });
      }

      outputHelpIfRequested(this, parsed.unknown);
      this._checkForMissingMandatoryOptions();

      // We do not always call this check to avoid masking a "better" error, like unknown command.
      const checkForUnknownOptions = () => {
        if (parsed.unknown.length > 0) {
          this.unknownOption(parsed.unknown[0]);
        }
      };

      const commandEvent = `command:${this.name()}`;
      if (this._actionHandler) {
        checkForUnknownOptions();
        // Check expected arguments and collect variadic together.
        const args = this.args.slice();
        this._args.forEach((arg, i) => {
          if (arg.required && args[i] == null) {
            this.missingArgument(arg.name);
          } else if (arg.variadic) {
            args[i] = args.splice(i);
            args.length = Math.min(i + 1, args.length);
          }
        });
        if (args.length > this._args.length) {
          this._excessArguments(args);
        }

        this._actionHandler(args);
        if (this.parent) this.parent.emit(commandEvent, operands, unknown); // legacy
      } else if (this.parent && this.parent.listenerCount(commandEvent)) {
        checkForUnknownOptions();
        this.parent.emit(commandEvent, operands, unknown); // legacy
      } else if (operands.length) {
        if (this._findCommand('*')) { // legacy default command
          this._dispatchSubcommand('*', operands, unknown);
        } else if (this.listenerCount('command:*')) {
          // skip option check, emit event for possible misspelling suggestion
          this.emit('command:*', operands, unknown);
        } else if (this.commands.length) {
          this.unknownCommand();
        } else {
          checkForUnknownOptions();
        }
      } else if (this.commands.length) {
        // This command has subcommands and nothing hooked up at this level, so display help.
        this.help({ error: true });
      } else {
        checkForUnknownOptions();
        // fall through for caller to handle after calling .parse()
      }
    }
  };

  /**
   * Find matching command.
   *
   * @api private
   */
  _findCommand(name) {
    if (!name) return undefined;
    return this.commands.find(cmd => cmd._name === name || cmd._aliases.includes(name));
  };

  /**
   * Return an option matching `arg` if any.
   *
   * @param {string} arg
   * @return {Option}
   * @api private
   */

  _findOption(arg) {
    return this.options.find(option => option.is(arg));
  };

  /**
   * Display an error message if a mandatory option does not have a value.
   * Lazy calling after checking for help flags from leaf subcommand.
   *
   * @api private
   */

  _checkForMissingMandatoryOptions() {
    // Walk up hierarchy so can call in subcommand after checking for displaying help.
    for (let cmd = this; cmd; cmd = cmd.parent) {
      cmd.options.forEach((anOption) => {
        if (anOption.mandatory && (cmd._getOptionValue(anOption.attributeName()) === undefined)) {
          cmd.missingMandatoryOptionValue(anOption);
        }
      });
    }
  };

  /**
   * Parse options from `argv` removing known options,
   * and return argv split into operands and unknown arguments.
   *
   * Examples:
   *
   *    argv => operands, unknown
   *    --known kkk op => [op], []
   *    op --known kkk => [op], []
   *    sub --unknown uuu op => [sub], [--unknown uuu op]
   *    sub -- --unknown uuu op => [sub --unknown uuu op], []
   *
   * @param {String[]} argv
   * @return {{operands: String[], unknown: String[]}}
   */

  parseOptions(argv) {
    const operands = []; // operands, not options or values
    const unknown = []; // first unknown option and remaining unknown args
    let dest = operands;
    const args = argv.slice();

    function maybeOption(arg) {
      return arg.length > 1 && arg[0] === '-';
    }

    // parse options
    let activeVariadicOption = null;
    while (args.length) {
      const arg = args.shift();

      // literal
      if (arg === '--') {
        if (dest === unknown) dest.push(arg);
        dest.push(...args);
        break;
      }

      if (activeVariadicOption && !maybeOption(arg)) {
        this.emit(`option:${activeVariadicOption.name()}`, arg);
        continue;
      }
      activeVariadicOption = null;

      if (maybeOption(arg)) {
        const option = this._findOption(arg);
        // recognised option, call listener to assign value with possible custom processing
        if (option) {
          if (option.required) {
            const value = args.shift();
            if (value === undefined) this.optionMissingArgument(option);
            this.emit(`option:${option.name()}`, value);
          } else if (option.optional) {
            let value = null;
            // historical behaviour is optional value is following arg unless an option
            if (args.length > 0 && !maybeOption(args[0])) {
              value = args.shift();
            }
            this.emit(`option:${option.name()}`, value);
          } else { // boolean flag
            this.emit(`option:${option.name()}`);
          }
          activeVariadicOption = option.variadic ? option : null;
          continue;
        }
      }

      // Look for combo options following single dash, eat first one if known.
      if (arg.length > 2 && arg[0] === '-' && arg[1] !== '-') {
        const option = this._findOption(`-${arg[1]}`);
        if (option) {
          if (option.required || (option.optional && this._combineFlagAndOptionalValue)) {
            // option with value following in same argument
            this.emit(`option:${option.name()}`, arg.slice(2));
          } else {
            // boolean option, emit and put back remainder of arg for further processing
            this.emit(`option:${option.name()}`);
            args.unshift(`-${arg.slice(2)}`);
          }
          continue;
        }
      }

      // Look for known long flag with value, like --foo=bar
      if (/^--[^=]+=/.test(arg)) {
        const index = arg.indexOf('=');
        const option = this._findOption(arg.slice(0, index));
        if (option && (option.required || option.optional)) {
          this.emit(`option:${option.name()}`, arg.slice(index + 1));
          continue;
        }
      }

      // Not a recognised option by this command.
      // Might be a command-argument, or subcommand option, or unknown option, or help command or option.

      // An unknown option means further arguments also classified as unknown so can be reprocessed by subcommands.
      if (maybeOption(arg)) {
        dest = unknown;
      }

      // If using positionalOptions, stop processing our options at subcommand.
      if ((this._enablePositionalOptions || this._passThroughOptions) && operands.length === 0 && unknown.length === 0) {
        if (this._findCommand(arg)) {
          operands.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        } else if (arg === this._helpCommandName && this._hasImplicitHelpCommand()) {
          operands.push(arg);
          if (args.length > 0) operands.push(...args);
          break;
        } else if (this._defaultCommandName) {
          unknown.push(arg);
          if (args.length > 0) unknown.push(...args);
          break;
        }
      }

      // If using passThroughOptions, stop processing options at first command-argument.
      if (this._passThroughOptions) {
        dest.push(arg);
        if (args.length > 0) dest.push(...args);
        break;
      }

      // add arg
      dest.push(arg);
    }

    return { operands, unknown };
  };

  /**
   * Return an object containing options as key-value pairs
   *
   * @return {Object}
   */
  opts() {
    if (this._storeOptionsAsProperties) {
      // Preserve original behaviour so backwards compatible when still using properties
      const result = {};
      const len = this.options.length;

      for (let i = 0; i < len; i++) {
        const key = this.options[i].attributeName();
        result[key] = key === this._versionOptionName ? this._version : this[key];
      }
      return result;
    }

    return this._optionValues;
  };

  /**
   * Internal bottleneck for handling of parsing errors.
   *
   * @api private
   */
  _displayError(exitCode, code, message) {
    this._outputConfiguration.outputError(`${message}\n`, this._outputConfiguration.writeErr);
    this._exit(exitCode, code, message);
  }

  /**
   * Argument `name` is missing.
   *
   * @param {string} name
   * @api private
   */

  missingArgument(name) {
    const message = `error: missing required argument '${name}'`;
    this._displayError(1, 'commander.missingArgument', message);
  };

  /**
   * `Option` is missing an argument.
   *
   * @param {Option} option
   * @api private
   */

  optionMissingArgument(option) {
    const message = `error: option '${option.flags}' argument missing`;
    this._displayError(1, 'commander.optionMissingArgument', message);
  };

  /**
   * `Option` does not have a value, and is a mandatory option.
   *
   * @param {Option} option
   * @api private
   */

  missingMandatoryOptionValue(option) {
    const message = `error: required option '${option.flags}' not specified`;
    this._displayError(1, 'commander.missingMandatoryOptionValue', message);
  };

  /**
   * Unknown option `flag`.
   *
   * @param {string} flag
   * @api private
   */

  unknownOption(flag) {
    if (this._allowUnknownOption) return;
    const message = `error: unknown option '${flag}'`;
    this._displayError(1, 'commander.unknownOption', message);
  };

  /**
   * Excess arguments, more than expected.
   *
   * @param {string[]} receivedArgs
   * @api private
   */

  _excessArguments(receivedArgs) {
    if (this._allowExcessArguments) return;

    const expected = this._args.length;
    const s = (expected === 1) ? '' : 's';
    const forSubcommand = this.parent ? ` for '${this.name()}'` : '';
    const message = `error: too many arguments${forSubcommand}. Expected ${expected} argument${s} but got ${receivedArgs.length}.`;
    this._displayError(1, 'commander.excessArguments', message);
  };

  /**
   * Unknown command.
   *
   * @api private
   */

  unknownCommand() {
    const partCommands = [this.name()];
    for (let parentCmd = this.parent; parentCmd; parentCmd = parentCmd.parent) {
      partCommands.unshift(parentCmd.name());
    }
    const fullCommand = partCommands.join(' ');
    const message = `error: unknown command '${this.args[0]}'.` +
      (this._hasHelpOption ? ` See '${fullCommand} ${this._helpLongFlag}'.` : '');
    this._displayError(1, 'commander.unknownCommand', message);
  };

  /**
   * Set the program version to `str`.
   *
   * This method auto-registers the "-V, --version" flag
   * which will print the version number when passed.
   *
   * You can optionally supply the  flags and description to override the defaults.
   *
   * @param {string} str
   * @param {string} [flags]
   * @param {string} [description]
   * @return {this | string} `this` command for chaining, or version string if no arguments
   */

  version(str, flags, description) {
    if (str === undefined) return this._version;
    this._version = str;
    flags = flags || '-V, --version';
    description = description || 'output the version number';
    const versionOption = this.createOption(flags, description);
    this._versionOptionName = versionOption.attributeName();
    this.options.push(versionOption);
    this.on('option:' + versionOption.name(), () => {
      this._outputConfiguration.writeOut(`${str}\n`);
      this._exit(0, 'commander.version', str);
    });
    return this;
  };

  /**
   * Set the description to `str`.
   *
   * @param {string} [str]
   * @param {Object} [argsDescription]
   * @return {string|Command}
   */
  description(str, argsDescription) {
    if (str === undefined && argsDescription === undefined) return this._description;
    this._description = str;
    this._argsDescription = argsDescription;
    return this;
  };

  /**
   * Set an alias for the command.
   *
   * You may call more than once to add multiple aliases. Only the first alias is shown in the auto-generated help.
   *
   * @param {string} [alias]
   * @return {string|Command}
   */

  alias(alias) {
    if (alias === undefined) return this._aliases[0]; // just return first, for backwards compatibility

    let command = this;
    if (this.commands.length !== 0 && this.commands[this.commands.length - 1]._executableHandler) {
      // assume adding alias for last added executable subcommand, rather than this
      command = this.commands[this.commands.length - 1];
    }

    if (alias === command._name) throw new Error('Command alias can\'t be the same as its name');

    command._aliases.push(alias);
    return this;
  };

  /**
   * Set aliases for the command.
   *
   * Only the first alias is shown in the auto-generated help.
   *
   * @param {string[]} [aliases]
   * @return {string[]|Command}
   */

  aliases(aliases) {
    // Getter for the array of aliases is the main reason for having aliases() in addition to alias().
    if (aliases === undefined) return this._aliases;

    aliases.forEach((alias) => this.alias(alias));
    return this;
  };

  /**
   * Set / get the command usage `str`.
   *
   * @param {string} [str]
   * @return {String|Command}
   */

  usage(str) {
    if (str === undefined) {
      if (this._usage) return this._usage;

      const args = this._args.map((arg) => {
        return humanReadableArgName(arg);
      });
      return [].concat(
        (this.options.length || this._hasHelpOption ? '[options]' : []),
        (this.commands.length ? '[command]' : []),
        (this._args.length ? args : [])
      ).join(' ');
    }

    this._usage = str;
    return this;
  };

  /**
   * Get or set the name of the command
   *
   * @param {string} [str]
   * @return {string|Command}
   */

  name(str) {
    if (str === undefined) return this._name;
    this._name = str;
    return this;
  };

  /**
   * Return program help documentation.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to wrap for stderr instead of stdout
   * @return {string}
   */

  helpInformation(contextOptions) {
    const helper = this.createHelp();
    if (helper.helpWidth === undefined) {
      helper.helpWidth = (contextOptions && contextOptions.error) ? this._outputConfiguration.getErrHelpWidth() : this._outputConfiguration.getOutHelpWidth();
    }
    return helper.formatHelp(this, helper);
  };

  /**
   * @api private
   */

  _getHelpContext(contextOptions) {
    contextOptions = contextOptions || {};
    const context = { error: !!contextOptions.error };
    let write;
    if (context.error) {
      write = (arg) => this._outputConfiguration.writeErr(arg);
    } else {
      write = (arg) => this._outputConfiguration.writeOut(arg);
    }
    context.write = contextOptions.write || write;
    context.command = this;
    return context;
  }

  /**
   * Output help information for this command.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean } | Function} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  outputHelp(contextOptions) {
    let deprecatedCallback;
    if (typeof contextOptions === 'function') {
      deprecatedCallback = contextOptions;
      contextOptions = undefined;
    }
    const context = this._getHelpContext(contextOptions);

    const groupListeners = [];
    let command = this;
    while (command) {
      groupListeners.push(command); // ordered from current command to root
      command = command.parent;
    }

    groupListeners.slice().reverse().forEach(command => command.emit('beforeAllHelp', context));
    this.emit('beforeHelp', context);

    let helpInformation = this.helpInformation(context);
    if (deprecatedCallback) {
      helpInformation = deprecatedCallback(helpInformation);
      if (typeof helpInformation !== 'string' && !Buffer.isBuffer(helpInformation)) {
        throw new Error('outputHelp callback must return a string or a Buffer');
      }
    }
    context.write(helpInformation);

    this.emit(this._helpLongFlag); // deprecated
    this.emit('afterHelp', context);
    groupListeners.forEach(command => command.emit('afterAllHelp', context));
  };

  /**
   * You can pass in flags and a description to override the help
   * flags and help description for your command. Pass in false to
   * disable the built-in help option.
   *
   * @param {string | boolean} [flags]
   * @param {string} [description]
   * @return {Command} `this` command for chaining
   */

  helpOption(flags, description) {
    if (typeof flags === 'boolean') {
      this._hasHelpOption = flags;
      return this;
    }
    this._helpFlags = flags || this._helpFlags;
    this._helpDescription = description || this._helpDescription;

    const helpFlags = _parseOptionFlags(this._helpFlags);
    this._helpShortFlag = helpFlags.shortFlag;
    this._helpLongFlag = helpFlags.longFlag;

    return this;
  };

  /**
   * Output help information and exit.
   *
   * Outputs built-in help, and custom text added using `.addHelpText()`.
   *
   * @param {{ error: boolean }} [contextOptions] - pass {error:true} to write to stderr instead of stdout
   */

  help(contextOptions) {
    this.outputHelp(contextOptions);
    let exitCode = process.exitCode || 0;
    if (exitCode === 0 && contextOptions && typeof contextOptions !== 'function' && contextOptions.error) {
      exitCode = 1;
    }
    // message: do not have all displayed text available so only passing placeholder.
    this._exit(exitCode, 'commander.help', '(outputHelp)');
  };

  /**
   * Add additional text to be displayed with the built-in help.
   *
   * Position is 'before' or 'after' to affect just this command,
   * and 'beforeAll' or 'afterAll' to affect this command and all its subcommands.
   *
   * @param {string} position - before or after built-in help
   * @param {string | Function} text - string to add, or a function returning a string
   * @return {Command} `this` command for chaining
   */
  addHelpText(position, text) {
    const allowedValues = ['beforeAll', 'before', 'after', 'afterAll'];
    if (!allowedValues.includes(position)) {
      throw new Error(`Unexpected value for position to addHelpText.
Expecting one of '${allowedValues.join("', '")}'`);
    }
    const helpEvent = `${position}Help`;
    this.on(helpEvent, (context) => {
      let helpStr;
      if (typeof text === 'function') {
        helpStr = text({ error: context.error, command: context.command });
      } else {
        helpStr = text;
      }
      // Ignore falsy value when nothing to output.
      if (helpStr) {
        context.write(`${helpStr}\n`);
      }
    });
    return this;
  }
};

/**
 * Expose the root command.
 */

exports = module.exports = new Command();
exports.program = exports; // More explicit access to global command.

/**
 * Expose classes
 */

exports.Command = Command;
exports.Option = Option;
exports.CommanderError = CommanderError;
exports.InvalidOptionArgumentError = InvalidOptionArgumentError;
exports.Help = Help;

/**
 * Camel-case the given `flag`
 *
 * @param {string} flag
 * @return {string}
 * @api private
 */

function camelcase(flag) {
  return flag.split('-').reduce((str, word) => {
    return str + word[0].toUpperCase() + word.slice(1);
  });
}

/**
 * Output help information if help flags specified
 *
 * @param {Command} cmd - command to output help for
 * @param {Array} args - array of options to search for help flags
 * @api private
 */

function outputHelpIfRequested(cmd, args) {
  const helpOption = cmd._hasHelpOption && args.find(arg => arg === cmd._helpLongFlag || arg === cmd._helpShortFlag);
  if (helpOption) {
    cmd.outputHelp();
    // (Do not have all displayed text available so only passing placeholder.)
    cmd._exit(0, 'commander.helpDisplayed', '(outputHelp)');
  }
}

/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Object} arg
 * @return {string}
 * @api private
 */

function humanReadableArgName(arg) {
  const nameOutput = arg.name + (arg.variadic === true ? '...' : '');

  return arg.required
    ? '<' + nameOutput + '>'
    : '[' + nameOutput + ']';
}

/**
 * Parse the short and long flag out of something like '-m,--mixed <value>'
 *
 * @api private
 */

function _parseOptionFlags(flags) {
  let shortFlag;
  let longFlag;
  // Use original very loose parsing to maintain backwards compatibility for now,
  // which allowed for example unintended `-sw, --short-word` [sic].
  const flagParts = flags.split(/[ |,]+/);
  if (flagParts.length > 1 && !/^[[<]/.test(flagParts[1])) shortFlag = flagParts.shift();
  longFlag = flagParts.shift();
  // Add support for lone short flag without significantly changing parsing!
  if (!shortFlag && /^-[^-]$/.test(longFlag)) {
    shortFlag = longFlag;
    longFlag = undefined;
  }
  return { shortFlag, longFlag };
}

/**
 * Scan arguments and increment port number for inspect calls (to avoid conflicts when spawning new command).
 *
 * @param {string[]} args - array of arguments from node.execArgv
 * @returns {string[]}
 * @api private
 */

function incrementNodeInspectorPort(args) {
  // Testing for these options:
  //  --inspect[=[host:]port]
  //  --inspect-brk[=[host:]port]
  //  --inspect-port=[host:]port
  return args.map((arg) => {
    if (!arg.startsWith('--inspect')) {
      return arg;
    }
    let debugOption;
    let debugHost = '127.0.0.1';
    let debugPort = '9229';
    let match;
    if ((match = arg.match(/^(--inspect(-brk)?)$/)) !== null) {
      // e.g. --inspect
      debugOption = match[1];
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+)$/)) !== null) {
      debugOption = match[1];
      if (/^\d+$/.test(match[3])) {
        // e.g. --inspect=1234
        debugPort = match[3];
      } else {
        // e.g. --inspect=localhost
        debugHost = match[3];
      }
    } else if ((match = arg.match(/^(--inspect(-brk|-port)?)=([^:]+):(\d+)$/)) !== null) {
      // e.g. --inspect=localhost:1234
      debugOption = match[1];
      debugHost = match[3];
      debugPort = match[4];
    }

    if (debugOption && debugPort !== '0') {
      return `${debugOption}=${debugHost}:${parseInt(debugPort) + 1}`;
    }
    return arg;
  });
}

};
kremlin.m['sindarin.compiler@0.1.0:src/syntax/c99.ts'] = (module,exports,global) => {let moo = kremlin.require('moo@0.5.1:moo.js', true);
let _39 = kremlin.require('sindarin.compiler@0.1.0:src/syntax/parser.ts', false);
const IDENTIFIER = /[_a-zA-Z][_a-zA-Z0-9]*/;
const CONSTANT = /(?:0[xX][0-9a-fA-F]+|0[0-7]*|[1-9][0-9]*)(?:[uU](?:ll?|LL?)?|(?:ll?|LL?)[uU]?)?/;
const COMMENT = /\/\/.*|\/\*[^]*?\*\//;
const { GRAMMAR, KEYWORDS, OPERATORS } = kremlin.require('sindarin.compiler@0.1.0:src/syntax/c99.json', false);
KEYWORDS.BOOL = "bool";
const TOKEN_DEFS = {
    WS: { match: /\s+/, lineBreaks: true },
    COMMENT: { match: COMMENT, lineBreaks: true },
    IDENTIFIER: { match: IDENTIFIER, type: moo.keywords(KEYWORDS) },
    CONSTANT,
    ...OPERATORS,
};
class C99Parser extends _39.Parser {
    constructor() {
        super({
            ...GRAMMAR,
            Lexer: new _39.SkippingLexer(moo.compile(TOKEN_DEFS)),
            Rigid: [
                "translation_unit",
                "parameter_list",
                "parameter_declaration",
                "block_item_list",
            ],
        });
    }
}
kremlin.export(module, {C99Parser});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYzk5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiYzk5LnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBLE9BQU8sR0FBRyxNQUFNLEtBQUssQ0FBQztBQUN0QixPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxNQUFNLFVBQVUsQ0FBQztBQUVqRCxNQUFNLFVBQVUsR0FBRyx3QkFBd0IsQ0FBQztBQUM1QyxNQUFNLFFBQVEsR0FBRyxpRkFBaUYsQ0FBQztBQUNuRyxNQUFNLE9BQU8sR0FBRyxzQkFBc0IsQ0FBQztBQUN2QyxNQUFNLEVBQUUsT0FBTyxFQUFFLFFBQVEsRUFBRSxTQUFTLEVBQUUsR0FBRyxPQUFPLENBQUMsWUFBWSxDQUFDLENBQUM7QUFFL0QsUUFBUSxDQUFDLElBQUksR0FBRyxNQUFNLENBQUM7QUFFdkIsTUFBTSxVQUFVLEdBQUc7SUFDakIsRUFBRSxFQUFFLEVBQUUsS0FBSyxFQUFFLEtBQUssRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFO0lBQ3RDLE9BQU8sRUFBRSxFQUFFLEtBQUssRUFBRSxPQUFPLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRTtJQUM3QyxVQUFVLEVBQUUsRUFBRSxLQUFLLEVBQUUsVUFBVSxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxFQUFFO0lBQy9ELFFBQVE7SUFDUixHQUFHLFNBQVM7Q0FDYixDQUFDO0FBRUYsTUFBTSxTQUFVLFNBQVEsTUFBTTtJQUM1QjtRQUNFLEtBQUssQ0FBQztZQUNKLEdBQUcsT0FBTztZQUNWLEtBQUssRUFBRSxJQUFJLGFBQWEsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxDQUFDO1lBQ2pELEtBQUssRUFBRTtnQkFDTCxrQkFBa0I7Z0JBQ2xCLGdCQUFnQjtnQkFDaEIsdUJBQXVCO2dCQUN2QixpQkFBaUI7YUFDbEI7U0FDRixDQUFDLENBQUM7SUFDTCxDQUFDO0NBQ0Y7QUFFRCxPQUFPLEVBQUUsU0FBUyxFQUFFLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9vIGZyb20gXCJtb29cIjtcbmltcG9ydCB7IFBhcnNlciwgU2tpcHBpbmdMZXhlciB9IGZyb20gXCIuL3BhcnNlclwiO1xuXG5jb25zdCBJREVOVElGSUVSID0gL1tfYS16QS1aXVtfYS16QS1aMC05XSovO1xuY29uc3QgQ09OU1RBTlQgPSAvKD86MFt4WF1bMC05YS1mQS1GXSt8MFswLTddKnxbMS05XVswLTldKikoPzpbdVVdKD86bGw/fExMPyk/fCg/OmxsP3xMTD8pW3VVXT8pPy87XG5jb25zdCBDT01NRU5UID0gL1xcL1xcLy4qfFxcL1xcKlteXSo/XFwqXFwvLztcbmNvbnN0IHsgR1JBTU1BUiwgS0VZV09SRFMsIE9QRVJBVE9SUyB9ID0gcmVxdWlyZShcIi4vYzk5Lmpzb25cIik7XG5cbktFWVdPUkRTLkJPT0wgPSBcImJvb2xcIjtcblxuY29uc3QgVE9LRU5fREVGUyA9IHtcbiAgV1M6IHsgbWF0Y2g6IC9cXHMrLywgbGluZUJyZWFrczogdHJ1ZSB9LFxuICBDT01NRU5UOiB7IG1hdGNoOiBDT01NRU5ULCBsaW5lQnJlYWtzOiB0cnVlIH0sXG4gIElERU5USUZJRVI6IHsgbWF0Y2g6IElERU5USUZJRVIsIHR5cGU6IG1vby5rZXl3b3JkcyhLRVlXT1JEUykgfSxcbiAgQ09OU1RBTlQsXG4gIC4uLk9QRVJBVE9SUyxcbn07XG5cbmNsYXNzIEM5OVBhcnNlciBleHRlbmRzIFBhcnNlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKHtcbiAgICAgIC4uLkdSQU1NQVIsXG4gICAgICBMZXhlcjogbmV3IFNraXBwaW5nTGV4ZXIobW9vLmNvbXBpbGUoVE9LRU5fREVGUykpLFxuICAgICAgUmlnaWQ6IFtcbiAgICAgICAgXCJ0cmFuc2xhdGlvbl91bml0XCIsXG4gICAgICAgIFwicGFyYW1ldGVyX2xpc3RcIixcbiAgICAgICAgXCJwYXJhbWV0ZXJfZGVjbGFyYXRpb25cIixcbiAgICAgICAgXCJibG9ja19pdGVtX2xpc3RcIixcbiAgICAgIF0sXG4gICAgfSk7XG4gIH1cbn1cblxuZXhwb3J0IHsgQzk5UGFyc2VyIH07XG4iXX0=
};
kremlin.m['sindarin.compiler@0.1.0:src/syntax/c99.json'] = (module,exports) => (module.exports =
{
  "OPERATORS": {
    "ELLIPSIS": "...",
    "RIGHT_ASSIGN": ">>=",
    "LEFT_ASSIGN": "<<=",
    "ADD_ASSIGN": "+=",
    "SUB_ASSIGN": "-=",
    "MUL_ASSIGN": "*=",
    "DIV_ASSIGN": "/=",
    "MOD_ASSIGN": "%=",
    "AND_ASSIGN": "&=",
    "XOR_ASSIGN": "^=",
    "OR_ASSIGN": "|=",
    "RIGHT_OP": ">>",
    "LEFT_OP": "<<",
    "INC_OP": "++",
    "DEC_OP": "--",
    "PTR_OP": "->",
    "AND_OP": "&&",
    "OR_OP": "||",
    "LE_OP": "<=",
    "GE_OP": ">=",
    "EQ_OP": "==",
    "NE_OP": "!=",
    ";": ";",
    "{": "{",
    "}": "}",
    ",": ",",
    ":": ":",
    "=": "=",
    "(": "(",
    ")": ")",
    "[": "[",
    "]": "]",
    ".": ".",
    "&": "&",
    "!": "!",
    "~": "~",
    "-": "-",
    "+": "+",
    "*": "*",
    "/": "/",
    "%": "%",
    "<": "<",
    ">": ">",
    "^": "^",
    "|": "|",
    "?": "?"
  },
  "KEYWORDS": {
    "AUTO": "auto",
    "BOOL": "_Bool",
    "BREAK": "break",
    "CASE": "case",
    "CHAR": "char",
    "COMPLEX": "_Complex",
    "CONST": "const",
    "CONTINUE": "continue",
    "DEFAULT": "default",
    "DO": "do",
    "DOUBLE": "double",
    "ELSE": "else",
    "ENUM": "enum",
    "EXTERN": "extern",
    "FLOAT": "float",
    "FOR": "for",
    "GOTO": "goto",
    "IF": "if",
    "IMAGINARY": "_Imaginary",
    "INLINE": "inline",
    "INT": "int",
    "LONG": "long",
    "REGISTER": "register",
    "RESTRICT": "restrict",
    "RETURN": "return",
    "SHORT": "short",
    "SIGNED": "signed",
    "SIZEOF": "sizeof",
    "STATIC": "static",
    "STRUCT": "struct",
    "SWITCH": "switch",
    "TYPEDEF": "typedef",
    "UNION": "union",
    "UNSIGNED": "unsigned",
    "VOID": "void",
    "VOLATILE": "volatile",
    "WHILE": "while"
  },
  "GRAMMAR": {
    "ParserRules": [
      {
        "name": "primary_expression",
        "symbols": [
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "primary_expression",
        "symbols": [
          {
            "type": "CONSTANT"
          }
        ]
      },
      {
        "name": "primary_expression",
        "symbols": ["STRING_LITERAL"]
      },
      {
        "name": "primary_expression",
        "symbols": [
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": ["primary_expression"]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "literal": "["
          },
          "expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "literal": "("
          },
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "literal": "("
          },
          "argument_expression_list",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "literal": "."
          },
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "type": "PTR_OP"
          },
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "type": "INC_OP"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          "postfix_expression",
          {
            "type": "DEC_OP"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          {
            "literal": "("
          },
          "type_name",
          {
            "literal": ")"
          },
          {
            "literal": "{"
          },
          "initializer_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "postfix_expression",
        "symbols": [
          {
            "literal": "("
          },
          "type_name",
          {
            "literal": ")"
          },
          {
            "literal": "{"
          },
          "initializer_list",
          {
            "literal": ","
          },
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "argument_expression_list",
        "symbols": ["assignment_expression"]
      },
      {
        "name": "argument_expression_list",
        "symbols": [
          "argument_expression_list",
          {
            "literal": ","
          },
          "assignment_expression"
        ]
      },
      {
        "name": "unary_expression",
        "symbols": ["postfix_expression"]
      },
      {
        "name": "unary_expression",
        "symbols": [
          {
            "type": "INC_OP"
          },
          "unary_expression"
        ]
      },
      {
        "name": "unary_expression",
        "symbols": [
          {
            "type": "DEC_OP"
          },
          "unary_expression"
        ]
      },
      {
        "name": "unary_expression",
        "symbols": ["unary_operator", "cast_expression"]
      },
      {
        "name": "unary_expression",
        "symbols": [
          {
            "type": "SIZEOF"
          },
          "unary_expression"
        ]
      },
      {
        "name": "unary_expression",
        "symbols": [
          {
            "type": "SIZEOF"
          },
          {
            "literal": "("
          },
          "type_name",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "&"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "*"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "+"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "-"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "~"
          }
        ]
      },
      {
        "name": "unary_operator",
        "symbols": [
          {
            "literal": "!"
          }
        ]
      },
      {
        "name": "cast_expression",
        "symbols": ["unary_expression"]
      },
      {
        "name": "cast_expression",
        "symbols": [
          {
            "literal": "("
          },
          "type_name",
          {
            "literal": ")"
          },
          "cast_expression"
        ]
      },
      {
        "name": "multiplicative_expression",
        "symbols": ["cast_expression"]
      },
      {
        "name": "multiplicative_expression",
        "symbols": [
          "multiplicative_expression",
          {
            "literal": "*"
          },
          "cast_expression"
        ]
      },
      {
        "name": "multiplicative_expression",
        "symbols": [
          "multiplicative_expression",
          {
            "literal": "/"
          },
          "cast_expression"
        ]
      },
      {
        "name": "multiplicative_expression",
        "symbols": [
          "multiplicative_expression",
          {
            "literal": "%"
          },
          "cast_expression"
        ]
      },
      {
        "name": "additive_expression",
        "symbols": ["multiplicative_expression"]
      },
      {
        "name": "additive_expression",
        "symbols": [
          "additive_expression",
          {
            "literal": "+"
          },
          "multiplicative_expression"
        ]
      },
      {
        "name": "additive_expression",
        "symbols": [
          "additive_expression",
          {
            "literal": "-"
          },
          "multiplicative_expression"
        ]
      },
      {
        "name": "shift_expression",
        "symbols": ["additive_expression"]
      },
      {
        "name": "shift_expression",
        "symbols": [
          "shift_expression",
          {
            "type": "LEFT_OP"
          },
          "additive_expression"
        ]
      },
      {
        "name": "shift_expression",
        "symbols": [
          "shift_expression",
          {
            "type": "RIGHT_OP"
          },
          "additive_expression"
        ]
      },
      {
        "name": "relational_expression",
        "symbols": ["shift_expression"]
      },
      {
        "name": "relational_expression",
        "symbols": [
          "relational_expression",
          {
            "literal": "<"
          },
          "shift_expression"
        ]
      },
      {
        "name": "relational_expression",
        "symbols": [
          "relational_expression",
          {
            "literal": ">"
          },
          "shift_expression"
        ]
      },
      {
        "name": "relational_expression",
        "symbols": [
          "relational_expression",
          {
            "type": "LE_OP"
          },
          "shift_expression"
        ]
      },
      {
        "name": "relational_expression",
        "symbols": [
          "relational_expression",
          {
            "type": "GE_OP"
          },
          "shift_expression"
        ]
      },
      {
        "name": "equality_expression",
        "symbols": ["relational_expression"]
      },
      {
        "name": "equality_expression",
        "symbols": [
          "equality_expression",
          {
            "type": "EQ_OP"
          },
          "relational_expression"
        ]
      },
      {
        "name": "equality_expression",
        "symbols": [
          "equality_expression",
          {
            "type": "NE_OP"
          },
          "relational_expression"
        ]
      },
      {
        "name": "and_expression",
        "symbols": ["equality_expression"]
      },
      {
        "name": "and_expression",
        "symbols": [
          "and_expression",
          {
            "literal": "&"
          },
          "equality_expression"
        ]
      },
      {
        "name": "exclusive_or_expression",
        "symbols": ["and_expression"]
      },
      {
        "name": "exclusive_or_expression",
        "symbols": [
          "exclusive_or_expression",
          {
            "literal": "^"
          },
          "and_expression"
        ]
      },
      {
        "name": "inclusive_or_expression",
        "symbols": ["exclusive_or_expression"]
      },
      {
        "name": "inclusive_or_expression",
        "symbols": [
          "inclusive_or_expression",
          {
            "literal": ""
          }
        ]
      },
      {
        "name": "inclusive_or_expression",
        "symbols": [
          {
            "literal": ""
          },
          "exclusive_or_expression"
        ]
      },
      {
        "name": "logical_and_expression",
        "symbols": ["inclusive_or_expression"]
      },
      {
        "name": "logical_and_expression",
        "symbols": [
          "logical_and_expression",
          {
            "type": "AND_OP"
          },
          "inclusive_or_expression"
        ]
      },
      {
        "name": "logical_or_expression",
        "symbols": ["logical_and_expression"]
      },
      {
        "name": "logical_or_expression",
        "symbols": [
          "logical_or_expression",
          {
            "type": "OR_OP"
          },
          "logical_and_expression"
        ]
      },
      {
        "name": "conditional_expression",
        "symbols": ["logical_or_expression"]
      },
      {
        "name": "conditional_expression",
        "symbols": [
          "logical_or_expression",
          {
            "literal": "?"
          },
          "expression",
          {
            "literal": ":"
          },
          "conditional_expression"
        ]
      },
      {
        "name": "assignment_expression",
        "symbols": ["conditional_expression"]
      },
      {
        "name": "assignment_expression",
        "symbols": [
          "unary_expression",
          "assignment_operator",
          "assignment_expression"
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "literal": "="
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "MUL_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "DIV_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "MOD_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "ADD_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "SUB_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "LEFT_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "RIGHT_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "AND_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "XOR_ASSIGN"
          }
        ]
      },
      {
        "name": "assignment_operator",
        "symbols": [
          {
            "type": "OR_ASSIGN"
          }
        ]
      },
      {
        "name": "expression",
        "symbols": ["assignment_expression"]
      },
      {
        "name": "expression",
        "symbols": [
          "expression",
          {
            "literal": ","
          },
          "assignment_expression"
        ]
      },
      {
        "name": "constant_expression",
        "symbols": ["conditional_expression"]
      },
      {
        "name": "declaration",
        "symbols": [
          "declaration_specifiers",
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "declaration",
        "symbols": [
          "declaration_specifiers",
          "init_declarator_list",
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["storage_class_specifier"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["storage_class_specifier", "declaration_specifiers"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["type_specifier"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["type_specifier", "declaration_specifiers"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["type_qualifier"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["type_qualifier", "declaration_specifiers"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["function_specifier"]
      },
      {
        "name": "declaration_specifiers",
        "symbols": ["function_specifier", "declaration_specifiers"]
      },
      {
        "name": "init_declarator_list",
        "symbols": ["init_declarator"]
      },
      {
        "name": "init_declarator_list",
        "symbols": [
          "init_declarator_list",
          {
            "literal": ","
          },
          "init_declarator"
        ]
      },
      {
        "name": "init_declarator",
        "symbols": ["declarator"]
      },
      {
        "name": "init_declarator",
        "symbols": [
          "declarator",
          {
            "literal": "="
          },
          "initializer"
        ]
      },
      {
        "name": "storage_class_specifier",
        "symbols": [
          {
            "type": "TYPEDEF"
          }
        ]
      },
      {
        "name": "storage_class_specifier",
        "symbols": [
          {
            "type": "EXTERN"
          }
        ]
      },
      {
        "name": "storage_class_specifier",
        "symbols": [
          {
            "type": "STATIC"
          }
        ]
      },
      {
        "name": "storage_class_specifier",
        "symbols": [
          {
            "type": "AUTO"
          }
        ]
      },
      {
        "name": "storage_class_specifier",
        "symbols": [
          {
            "type": "REGISTER"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "VOID"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "CHAR"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "SHORT"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "INT"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "LONG"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "FLOAT"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "DOUBLE"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "SIGNED"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "UNSIGNED"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "BOOL"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "COMPLEX"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": [
          {
            "type": "IMAGINARY"
          }
        ]
      },
      {
        "name": "type_specifier",
        "symbols": ["struct_or_union_specifier"]
      },
      {
        "name": "type_specifier",
        "symbols": ["enum_specifier"]
      },
      {
        "name": "type_specifier",
        "symbols": ["TYPE_NAME"]
      },
      {
        "name": "struct_or_union_specifier",
        "symbols": [
          "struct_or_union",
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": "{"
          },
          "struct_declaration_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "struct_or_union_specifier",
        "symbols": [
          "struct_or_union",
          {
            "literal": "{"
          },
          "struct_declaration_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "struct_or_union_specifier",
        "symbols": [
          "struct_or_union",
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "struct_or_union",
        "symbols": [
          {
            "type": "STRUCT"
          }
        ]
      },
      {
        "name": "struct_or_union",
        "symbols": [
          {
            "type": "UNION"
          }
        ]
      },
      {
        "name": "struct_declaration_list",
        "symbols": ["struct_declaration"]
      },
      {
        "name": "struct_declaration_list",
        "symbols": ["struct_declaration_list", "struct_declaration"]
      },
      {
        "name": "struct_declaration",
        "symbols": [
          "specifier_qualifier_list",
          "struct_declarator_list",
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "specifier_qualifier_list",
        "symbols": ["type_specifier", "specifier_qualifier_list"]
      },
      {
        "name": "specifier_qualifier_list",
        "symbols": ["type_specifier"]
      },
      {
        "name": "specifier_qualifier_list",
        "symbols": ["type_qualifier", "specifier_qualifier_list"]
      },
      {
        "name": "specifier_qualifier_list",
        "symbols": ["type_qualifier"]
      },
      {
        "name": "struct_declarator_list",
        "symbols": ["struct_declarator"]
      },
      {
        "name": "struct_declarator_list",
        "symbols": [
          "struct_declarator_list",
          {
            "literal": ","
          },
          "struct_declarator"
        ]
      },
      {
        "name": "struct_declarator",
        "symbols": ["declarator"]
      },
      {
        "name": "struct_declarator",
        "symbols": [
          {
            "literal": ":"
          },
          "constant_expression"
        ]
      },
      {
        "name": "struct_declarator",
        "symbols": [
          "declarator",
          {
            "literal": ":"
          },
          "constant_expression"
        ]
      },
      {
        "name": "enum_specifier",
        "symbols": [
          {
            "type": "ENUM"
          },
          {
            "literal": "{"
          },
          "enumerator_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "enum_specifier",
        "symbols": [
          {
            "type": "ENUM"
          },
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": "{"
          },
          "enumerator_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "enum_specifier",
        "symbols": [
          {
            "type": "ENUM"
          },
          {
            "literal": "{"
          },
          "enumerator_list",
          {
            "literal": ","
          },
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "enum_specifier",
        "symbols": [
          {
            "type": "ENUM"
          },
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": "{"
          },
          "enumerator_list",
          {
            "literal": ","
          },
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "enum_specifier",
        "symbols": [
          {
            "type": "ENUM"
          },
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "enumerator_list",
        "symbols": ["enumerator"]
      },
      {
        "name": "enumerator_list",
        "symbols": [
          "enumerator_list",
          {
            "literal": ","
          },
          "enumerator"
        ]
      },
      {
        "name": "enumerator",
        "symbols": [
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "enumerator",
        "symbols": [
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": "="
          },
          "constant_expression"
        ]
      },
      {
        "name": "type_qualifier",
        "symbols": [
          {
            "type": "CONST"
          }
        ]
      },
      {
        "name": "type_qualifier",
        "symbols": [
          {
            "type": "RESTRICT"
          }
        ]
      },
      {
        "name": "type_qualifier",
        "symbols": [
          {
            "type": "VOLATILE"
          }
        ]
      },
      {
        "name": "function_specifier",
        "symbols": [
          {
            "type": "INLINE"
          }
        ]
      },
      {
        "name": "declarator",
        "symbols": ["pointer", "direct_declarator"]
      },
      {
        "name": "declarator",
        "symbols": ["direct_declarator"]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          {
            "literal": "("
          },
          "declarator",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          "type_qualifier_list",
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          "type_qualifier_list",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          {
            "type": "STATIC"
          },
          "type_qualifier_list",
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          "type_qualifier_list",
          {
            "type": "STATIC"
          },
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          "type_qualifier_list",
          {
            "literal": "*"
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          {
            "literal": "*"
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "["
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "("
          },
          "parameter_type_list",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "("
          },
          "identifier_list",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_declarator",
        "symbols": [
          "direct_declarator",
          {
            "literal": "("
          },
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "pointer",
        "symbols": [
          {
            "literal": "*"
          }
        ]
      },
      {
        "name": "pointer",
        "symbols": [
          {
            "literal": "*"
          },
          "type_qualifier_list"
        ]
      },
      {
        "name": "pointer",
        "symbols": [
          {
            "literal": "*"
          },
          "pointer"
        ]
      },
      {
        "name": "pointer",
        "symbols": [
          {
            "literal": "*"
          },
          "type_qualifier_list",
          "pointer"
        ]
      },
      {
        "name": "type_qualifier_list",
        "symbols": ["type_qualifier"]
      },
      {
        "name": "type_qualifier_list",
        "symbols": ["type_qualifier_list", "type_qualifier"]
      },
      {
        "name": "parameter_type_list",
        "symbols": ["parameter_list"]
      },
      {
        "name": "parameter_type_list",
        "symbols": [
          "parameter_list",
          {
            "literal": ","
          },
          {
            "type": "ELLIPSIS"
          }
        ]
      },
      {
        "name": "parameter_list",
        "symbols": ["parameter_declaration"]
      },
      {
        "name": "parameter_list",
        "symbols": [
          "parameter_list",
          {
            "literal": ","
          },
          "parameter_declaration"
        ]
      },
      {
        "name": "parameter_declaration",
        "symbols": ["declaration_specifiers", "declarator"]
      },
      {
        "name": "parameter_declaration",
        "symbols": ["declaration_specifiers", "abstract_declarator"]
      },
      {
        "name": "parameter_declaration",
        "symbols": ["declaration_specifiers"]
      },
      {
        "name": "identifier_list",
        "symbols": [
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "identifier_list",
        "symbols": [
          "identifier_list",
          {
            "literal": ","
          },
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "type_name",
        "symbols": ["specifier_qualifier_list"]
      },
      {
        "name": "type_name",
        "symbols": ["specifier_qualifier_list", "abstract_declarator"]
      },
      {
        "name": "abstract_declarator",
        "symbols": ["pointer"]
      },
      {
        "name": "abstract_declarator",
        "symbols": ["direct_abstract_declarator"]
      },
      {
        "name": "abstract_declarator",
        "symbols": ["pointer", "direct_abstract_declarator"]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "("
          },
          "abstract_declarator",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "["
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "["
          },
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          "direct_abstract_declarator",
          {
            "literal": "["
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          "direct_abstract_declarator",
          {
            "literal": "["
          },
          "assignment_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "["
          },
          {
            "literal": "*"
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          "direct_abstract_declarator",
          {
            "literal": "["
          },
          {
            "literal": "*"
          },
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "("
          },
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          {
            "literal": "("
          },
          "parameter_type_list",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          "direct_abstract_declarator",
          {
            "literal": "("
          },
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "direct_abstract_declarator",
        "symbols": [
          "direct_abstract_declarator",
          {
            "literal": "("
          },
          "parameter_type_list",
          {
            "literal": ")"
          }
        ]
      },
      {
        "name": "initializer",
        "symbols": ["assignment_expression"]
      },
      {
        "name": "initializer",
        "symbols": [
          {
            "literal": "{"
          },
          "initializer_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "initializer",
        "symbols": [
          {
            "literal": "{"
          },
          "initializer_list",
          {
            "literal": ","
          },
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "initializer_list",
        "symbols": ["initializer"]
      },
      {
        "name": "initializer_list",
        "symbols": ["designation", "initializer"]
      },
      {
        "name": "initializer_list",
        "symbols": [
          "initializer_list",
          {
            "literal": ","
          },
          "initializer"
        ]
      },
      {
        "name": "initializer_list",
        "symbols": [
          "initializer_list",
          {
            "literal": ","
          },
          "designation",
          "initializer"
        ]
      },
      {
        "name": "designation",
        "symbols": [
          "designator_list",
          {
            "literal": "="
          }
        ]
      },
      {
        "name": "designator_list",
        "symbols": ["designator"]
      },
      {
        "name": "designator_list",
        "symbols": ["designator_list", "designator"]
      },
      {
        "name": "designator",
        "symbols": [
          {
            "literal": "["
          },
          "constant_expression",
          {
            "literal": "]"
          }
        ]
      },
      {
        "name": "designator",
        "symbols": [
          {
            "literal": "."
          },
          {
            "type": "IDENTIFIER"
          }
        ]
      },
      {
        "name": "statement",
        "symbols": ["labeled_statement"]
      },
      {
        "name": "statement",
        "symbols": ["compound_statement"]
      },
      {
        "name": "statement",
        "symbols": ["expression_statement"]
      },
      {
        "name": "statement",
        "symbols": ["selection_statement"]
      },
      {
        "name": "statement",
        "symbols": ["iteration_statement"]
      },
      {
        "name": "statement",
        "symbols": ["jump_statement"]
      },
      {
        "name": "labeled_statement",
        "symbols": [
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": ":"
          },
          "statement"
        ]
      },
      {
        "name": "labeled_statement",
        "symbols": [
          {
            "type": "CASE"
          },
          "constant_expression",
          {
            "literal": ":"
          },
          "statement"
        ]
      },
      {
        "name": "labeled_statement",
        "symbols": [
          {
            "type": "DEFAULT"
          },
          {
            "literal": ":"
          },
          "statement"
        ]
      },
      {
        "name": "compound_statement",
        "symbols": [
          {
            "literal": "{"
          },
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "compound_statement",
        "symbols": [
          {
            "literal": "{"
          },
          "block_item_list",
          {
            "literal": "}"
          }
        ]
      },
      {
        "name": "block_item_list",
        "symbols": ["block_item"]
      },
      {
        "name": "block_item_list",
        "symbols": ["block_item_list", "block_item"]
      },
      {
        "name": "block_item",
        "symbols": ["declaration"]
      },
      {
        "name": "block_item",
        "symbols": ["statement"]
      },
      {
        "name": "expression_statement",
        "symbols": [
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "expression_statement",
        "symbols": [
          "expression",
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "selection_statement",
        "symbols": [
          {
            "type": "IF"
          },
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "selection_statement",
        "symbols": [
          {
            "type": "IF"
          },
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          },
          "statement",
          {
            "type": "ELSE"
          },
          "statement"
        ]
      },
      {
        "name": "selection_statement",
        "symbols": [
          {
            "type": "SWITCH"
          },
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "WHILE"
          },
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "DO"
          },
          "statement",
          {
            "type": "WHILE"
          },
          {
            "literal": "("
          },
          "expression",
          {
            "literal": ")"
          },
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "FOR"
          },
          {
            "literal": "("
          },
          "expression_statement",
          "expression_statement",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "FOR"
          },
          {
            "literal": "("
          },
          "expression_statement",
          "expression_statement",
          "expression",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "FOR"
          },
          {
            "literal": "("
          },
          "declaration",
          "expression_statement",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "iteration_statement",
        "symbols": [
          {
            "type": "FOR"
          },
          {
            "literal": "("
          },
          "declaration",
          "expression_statement",
          "expression",
          {
            "literal": ")"
          },
          "statement"
        ]
      },
      {
        "name": "jump_statement",
        "symbols": [
          {
            "type": "GOTO"
          },
          {
            "type": "IDENTIFIER"
          },
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "jump_statement",
        "symbols": [
          {
            "type": "CONTINUE"
          },
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "jump_statement",
        "symbols": [
          {
            "type": "BREAK"
          },
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "jump_statement",
        "symbols": [
          {
            "type": "RETURN"
          },
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "jump_statement",
        "symbols": [
          {
            "type": "RETURN"
          },
          "expression",
          {
            "literal": ";"
          }
        ]
      },
      {
        "name": "translation_unit",
        "symbols": ["external_declaration"]
      },
      {
        "name": "translation_unit",
        "symbols": ["translation_unit", "external_declaration"]
      },
      {
        "name": "external_declaration",
        "symbols": ["function_definition"]
      },
      {
        "name": "external_declaration",
        "symbols": ["declaration"]
      },
      {
        "name": "function_definition",
        "symbols": [
          "declaration_specifiers",
          "declarator",
          "declaration_list",
          "compound_statement"
        ]
      },
      {
        "name": "function_definition",
        "symbols": [
          "declaration_specifiers",
          "declarator",
          "compound_statement"
        ]
      },
      {
        "name": "declaration_list",
        "symbols": ["declaration"]
      },
      {
        "name": "declaration_list",
        "symbols": ["declaration_list", "declaration"]
      }
    ],
    "ParserStart": "translation_unit"
  }
}
);
kremlin.m['sindarin.compiler@0.1.0:src/syntax/parser.ts'] = (module,exports,global) => {var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _codeRangeComputer;
let nearley = kremlin.require('nearley@2.20.1:lib/nearley.js', true);
class SkippingLexer {
    constructor(lexer) {
        this.lexer = lexer;
        this.skip = new Set(["WS", "COMMENT"]);
    }
    next() {
        do {
            var token = this.lexer.next();
            if (!(token != null && this.skip.has(token.type)))
                return token;
        } while (true);
    }
    reset(chunk, info) {
        this.lexer.reset(chunk, info);
    }
    formatError(token, message) {
        return this.lexer.formatError(token, message);
    }
    save() {
        return this.lexer.save();
    }
    has(name) {
        return this.lexer.has(name);
    }
}
class Parser extends nearley.Parser {
    constructor(grammar) {
        super(Parser.prepare(grammar));
        _codeRangeComputer.set(this, void 0);
        this.initial = this.save();
    }
    static prepare(grammar) {
        var rigid = grammar.Rigid || [];
        for (const rule of grammar.ParserRules) {
            rule.postprocess = rigid.includes(rule.name)
                ? (data) => this.unfold(data, rule.name)
                : rule.symbols.length === 1
                    ? (data) => data[0]
                    : (data) => Object.assign(data, { type: rule.name });
        }
        return grammar;
    }
    parse(program) {
        __classPrivateFieldSet(this, _codeRangeComputer, new codeRangeComputer(program));
        this.restart();
        this.feed(program);
        // For non-ambigious grammar, this is what we what
        // See: https://nearley.js.org/docs/parser#a-note-on-ambiguity
        const ast = this.results[0];
        this.setRange(ast);
        return this.toTree(ast);
    }
    restart() {
        this.restore(this.initial);
    }
    reportError(token) {
        return this.lexer.formatError(token, "Syntax error");
    }
    toTree(ast) {
        if (ast.text) {
            return {
                type: ast.type,
                text: ast.text,
                children: null,
                range: ast.range,
            };
        }
        else {
            let tree = { type: ast.type, range: ast.range, children: [] };
            for (let i = 0; i < ast.length; i++)
                tree.children.push(this.toTree(ast[i]));
            return tree;
        }
    }
    setRange(ast) {
        if (ast.text) {
            const start = __classPrivateFieldGet(this, _codeRangeComputer).getNumberAndColumnFromPos(ast.offset);
            const end = __classPrivateFieldGet(this, _codeRangeComputer).getNumberAndColumnFromPos(ast.offset + ast.text.length);
            ast.range = {
                startLineNumber: start.lineNumber,
                startColumn: start.column,
                endLineNumber: end.lineNumber,
                endColumn: end.column,
            };
        }
        else {
            for (let i = 0; i < ast.length; i++)
                this.setRange(ast[i]);
            const firstChild = ast[0], lastChild = ast[ast.length - 1];
            ast.range = {
                startLineNumber: firstChild.range.startLineNumber,
                startColumn: firstChild.range.startColumn,
                endLineNumber: lastChild.range.endLineNumber,
                endColumn: lastChild.range.endColumn,
            };
        }
    }
    static unfold(data, type) {
        function* iter() {
            for (const d of data) {
                if (d.type === type)
                    yield* d;
                else
                    yield d;
            }
        }
        return Object.assign([...iter()], { type });
    }
}
_codeRangeComputer = new WeakMap();
// Code below is copied from https://github.com/dsherret/ts-ast-viewer/blob/master/src/utils/LineAndColumnComputer.ts
class ArrayUtils {
    static from(iterator) {
        const array = [];
        while (true) {
            const next = iterator.next();
            if (next.done) {
                return array;
            }
            array.push(next.value);
        }
    }
    static binarySearch(items, compareTo) {
        let top = items.length - 1;
        let bottom = 0;
        while (bottom <= top) {
            const mid = Math.floor((top + bottom) / 2);
            const comparisonResult = compareTo(items[mid]);
            if (comparisonResult === 0) {
                return mid;
            }
            else if (comparisonResult < 0) {
                top = mid - 1;
            }
            else {
                bottom = mid + 1;
            }
        }
        return -1;
    }
    constructor() { }
}
function createLineNumberAndColumns(text) {
    const lineInfos = [];
    let lastPos = 0;
    for (let i = 0; i < text.length; i++) {
        if (text[i] === "\n") {
            pushLineInfo(i);
        }
    }
    pushLineInfo(text.length);
    return lineInfos;
    function pushLineInfo(pos) {
        lineInfos.push({
            pos: lastPos,
            length: pos - lastPos,
            number: lineInfos.length + 1,
        });
        lastPos = pos + 1;
    }
}
/** An efficient way to compute the line and column of a position in a string. */
class codeRangeComputer {
    constructor(text) {
        this.text = text;
        this.lineInfos = createLineNumberAndColumns(text);
    }
    getNumberAndColumnFromPos(pos) {
        if (pos < 0) {
            return { lineNumber: 1, column: 1 };
        }
        const index = ArrayUtils.binarySearch(this.lineInfos, (info) => {
            if (pos < info.pos) {
                return -1;
            }
            if (pos >= info.pos && pos < info.pos + info.length + 1) {
                // `+ 1` is for newline char
                return 0;
            }
            return 1;
        });
        const lineInfo = index >= 0
            ? this.lineInfos[index]
            : this.lineInfos[this.lineInfos.length - 1];
        if (lineInfo == null) {
            return { lineNumber: 1, column: 1 };
        }
        return {
            lineNumber: lineInfo.number,
            column: Math.min(pos - lineInfo.pos + 1, lineInfo.length + 1),
        };
    }
    getPosFromLineAndColumn(line, column) {
        if (this.lineInfos.length === 0 || line < 1) {
            return 0;
        }
        const lineInfo = this.lineInfos[line - 1];
        if (lineInfo == null) {
            const lastLineInfo = this.lineInfos[this.lineInfos.length - 1];
            return lastLineInfo.pos + lastLineInfo.length;
        }
        return lineInfo.pos + Math.min(lineInfo.length, column - 1);
    }
}
kremlin.export(module, {Parser,SkippingLexer});
kremlin.export(module, {default:codeRangeComputer});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicGFyc2VyLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsicGFyc2VyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7O0FBQ0EsT0FBTyxPQUFPLE1BQU0sU0FBUyxDQUFDO0FBRTlCLE1BQU0sYUFBYTtJQUlqQixZQUFZLEtBQWdCO1FBQzFCLElBQUksQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDO1FBQ25CLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsU0FBUyxDQUFDLENBQUMsQ0FBQztJQUN6QyxDQUFDO0lBRUQsSUFBSTtRQUNGLEdBQUc7WUFDRCxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO1lBQzlCLElBQUksQ0FBQyxDQUFDLEtBQUssSUFBSSxJQUFJLElBQUksSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLElBQUssQ0FBQyxDQUFDO2dCQUFFLE9BQU8sS0FBSyxDQUFDO1NBQ2xFLFFBQVEsSUFBSSxFQUFFO0lBQ2pCLENBQUM7SUFFRCxLQUFLLENBQUMsS0FBVSxFQUFFLElBQVM7UUFDekIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxDQUFDO0lBQ2hDLENBQUM7SUFDRCxXQUFXLENBQUMsS0FBVSxFQUFFLE9BQWdCO1FBQ3RDLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsS0FBSyxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ2hELENBQUM7SUFDRCxJQUFJO1FBQ0YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQzNCLENBQUM7SUFDRCxHQUFHLENBQUMsSUFBWTtRQUNkLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUM7SUFDOUIsQ0FBQztDQUNGO0FBZ0JELE1BQU0sTUFBTyxTQUFRLE9BQU8sQ0FBQyxNQUFNO0lBSWpDLFlBQVksT0FBWTtRQUN0QixLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO1FBSGpDLHFDQUFzQztRQUlwQyxJQUFJLENBQUMsT0FBTyxHQUFHLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUM3QixDQUFDO0lBRUQsTUFBTSxDQUFDLE9BQU8sQ0FBQyxPQUFZO1FBQ3pCLElBQUksS0FBSyxHQUFHLE9BQU8sQ0FBQyxLQUFLLElBQUksRUFBRSxDQUFDO1FBQ2hDLEtBQUssTUFBTSxJQUFJLElBQUksT0FBTyxDQUFDLFdBQVcsRUFBRTtZQUN0QyxJQUFJLENBQUMsV0FBVyxHQUFHLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQztnQkFDMUMsQ0FBQyxDQUFDLENBQUMsSUFBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDO2dCQUMvQyxDQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEtBQUssQ0FBQztvQkFDM0IsQ0FBQyxDQUFDLENBQUMsSUFBVyxFQUFFLEVBQUUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO29CQUMxQixDQUFDLENBQUMsQ0FBQyxJQUFXLEVBQUUsRUFBRSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1NBQy9EO1FBQ0QsT0FBTyxPQUFPLENBQUM7SUFDakIsQ0FBQztJQUVELEtBQUssQ0FBQyxPQUFlO1FBQ25CLHVCQUFBLElBQUksc0JBQXNCLElBQUksaUJBQWlCLENBQUMsT0FBTyxDQUFDLEVBQUM7UUFDekQsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO1FBQ2YsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztRQUNuQixrREFBa0Q7UUFDbEQsOERBQThEO1FBQzlELE1BQU0sR0FBRyxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDNUIsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUNuQixPQUFPLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDMUIsQ0FBQztJQUVELE9BQU87UUFDTCxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUM3QixDQUFDO0lBRUQsV0FBVyxDQUFDLEtBQVU7UUFDcEIsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLEVBQUUsY0FBYyxDQUFDLENBQUM7SUFDdkQsQ0FBQztJQUVPLE1BQU0sQ0FBQyxHQUFRO1FBQ3JCLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtZQUNaLE9BQU87Z0JBQ0wsSUFBSSxFQUFFLEdBQUcsQ0FBQyxJQUFJO2dCQUNkLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSTtnQkFDZCxRQUFRLEVBQUUsSUFBSTtnQkFDZCxLQUFLLEVBQUUsR0FBRyxDQUFDLEtBQUs7YUFDakIsQ0FBQztTQUNIO2FBQU07WUFDTCxJQUFJLElBQUksR0FBRyxFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEtBQUssRUFBRSxHQUFHLENBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxFQUFFLEVBQUUsQ0FBQztZQUM5RCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQ2pDLElBQUksQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUxQyxPQUFPLElBQUksQ0FBQztTQUNiO0lBQ0gsQ0FBQztJQUVPLFFBQVEsQ0FBQyxHQUFHO1FBQ2xCLElBQUksR0FBRyxDQUFDLElBQUksRUFBRTtZQUNaLE1BQU0sS0FBSyxHQUFHLGlEQUF3Qix5QkFBeUIsQ0FDN0QsR0FBRyxDQUFDLE1BQU0sQ0FDWCxDQUFDO1lBQ0YsTUFBTSxHQUFHLEdBQUcsaURBQXdCLHlCQUF5QixDQUMzRCxHQUFHLENBQUMsTUFBTSxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsTUFBTSxDQUM3QixDQUFDO1lBQ0YsR0FBRyxDQUFDLEtBQUssR0FBRztnQkFDVixlQUFlLEVBQUUsS0FBSyxDQUFDLFVBQVU7Z0JBQ2pDLFdBQVcsRUFBRSxLQUFLLENBQUMsTUFBTTtnQkFDekIsYUFBYSxFQUFFLEdBQUcsQ0FBQyxVQUFVO2dCQUM3QixTQUFTLEVBQUUsR0FBRyxDQUFDLE1BQU07YUFDdEIsQ0FBQztTQUNIO2FBQU07WUFDTCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsR0FBRyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUU7Z0JBQUUsSUFBSSxDQUFDLFFBQVEsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUUzRCxNQUFNLFVBQVUsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLEVBQ3ZCLFNBQVMsR0FBRyxHQUFHLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztZQUNsQyxHQUFHLENBQUMsS0FBSyxHQUFHO2dCQUNWLGVBQWUsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLGVBQWU7Z0JBQ2pELFdBQVcsRUFBRSxVQUFVLENBQUMsS0FBSyxDQUFDLFdBQVc7Z0JBQ3pDLGFBQWEsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLGFBQWE7Z0JBQzVDLFNBQVMsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLFNBQVM7YUFDckMsQ0FBQztTQUNIO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxNQUFNLENBQUMsSUFBVyxFQUFFLElBQVk7UUFDckMsUUFBUSxDQUFDLENBQUMsSUFBSTtZQUNaLEtBQUssTUFBTSxDQUFDLElBQUksSUFBSSxFQUFFO2dCQUNwQixJQUFJLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSTtvQkFBRSxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7O29CQUN6QixNQUFNLENBQUMsQ0FBQzthQUNkO1FBQ0gsQ0FBQztRQUNELE9BQU8sTUFBTSxDQUFDLE1BQU0sQ0FBQyxDQUFDLEdBQUcsSUFBSSxFQUFFLENBQUMsRUFBRSxFQUFFLElBQUksRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQztDQUNGOztBQUVELHFIQUFxSDtBQUVySCxNQUFNLFVBQVU7SUFDZCxNQUFNLENBQUMsSUFBSSxDQUFJLFFBQXFCO1FBQ2xDLE1BQU0sS0FBSyxHQUFRLEVBQUUsQ0FBQztRQUN0QixPQUFPLElBQUksRUFBRTtZQUNYLE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztZQUM3QixJQUFJLElBQUksQ0FBQyxJQUFJLEVBQUU7Z0JBQ2IsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO1NBQ3hCO0lBQ0gsQ0FBQztJQUVELE1BQU0sQ0FBQyxZQUFZLENBQUksS0FBbUIsRUFBRSxTQUErQjtRQUN6RSxJQUFJLEdBQUcsR0FBRyxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQztRQUMzQixJQUFJLE1BQU0sR0FBRyxDQUFDLENBQUM7UUFFZixPQUFPLE1BQU0sSUFBSSxHQUFHLEVBQUU7WUFDcEIsTUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEdBQUcsR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMzQyxNQUFNLGdCQUFnQixHQUFHLFNBQVMsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUMvQyxJQUFJLGdCQUFnQixLQUFLLENBQUMsRUFBRTtnQkFDMUIsT0FBTyxHQUFHLENBQUM7YUFDWjtpQkFBTSxJQUFJLGdCQUFnQixHQUFHLENBQUMsRUFBRTtnQkFDL0IsR0FBRyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7YUFDZjtpQkFBTTtnQkFDTCxNQUFNLEdBQUcsR0FBRyxHQUFHLENBQUMsQ0FBQzthQUNsQjtTQUNGO1FBRUQsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUNaLENBQUM7SUFFRCxnQkFBdUIsQ0FBQztDQUN6QjtBQVFELFNBQVMsMEJBQTBCLENBQUMsSUFBWTtJQUM5QyxNQUFNLFNBQVMsR0FBMEIsRUFBRSxDQUFDO0lBQzVDLElBQUksT0FBTyxHQUFHLENBQUMsQ0FBQztJQUVoQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtRQUNwQyxJQUFJLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxJQUFJLEVBQUU7WUFDcEIsWUFBWSxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQ2pCO0tBQ0Y7SUFFRCxZQUFZLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBRTFCLE9BQU8sU0FBUyxDQUFDO0lBRWpCLFNBQVMsWUFBWSxDQUFDLEdBQVc7UUFDL0IsU0FBUyxDQUFDLElBQUksQ0FBQztZQUNiLEdBQUcsRUFBRSxPQUFPO1lBQ1osTUFBTSxFQUFFLEdBQUcsR0FBRyxPQUFPO1lBQ3JCLE1BQU0sRUFBRSxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUM7U0FDN0IsQ0FBQyxDQUFDO1FBQ0gsT0FBTyxHQUFHLEdBQUcsR0FBRyxDQUFDLENBQUM7SUFDcEIsQ0FBQztBQUNILENBQUM7QUFFRCxpRkFBaUY7QUFDakYsTUFBTSxpQkFBaUI7SUFHckIsWUFBNEIsSUFBWTtRQUFaLFNBQUksR0FBSixJQUFJLENBQVE7UUFDdEMsSUFBSSxDQUFDLFNBQVMsR0FBRywwQkFBMEIsQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUNwRCxDQUFDO0lBRUQseUJBQXlCLENBQUMsR0FBVztRQUNuQyxJQUFJLEdBQUcsR0FBRyxDQUFDLEVBQUU7WUFDWCxPQUFPLEVBQUUsVUFBVSxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsQ0FBQyxFQUFFLENBQUM7U0FDckM7UUFFRCxNQUFNLEtBQUssR0FBRyxVQUFVLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxTQUFTLEVBQUUsQ0FBQyxJQUFJLEVBQUUsRUFBRTtZQUM3RCxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxFQUFFO2dCQUNsQixPQUFPLENBQUMsQ0FBQyxDQUFDO2FBQ1g7WUFDRCxJQUFJLEdBQUcsSUFBSSxJQUFJLENBQUMsR0FBRyxJQUFJLEdBQUcsR0FBRyxJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO2dCQUN2RCw0QkFBNEI7Z0JBQzVCLE9BQU8sQ0FBQyxDQUFDO2FBQ1Y7WUFDRCxPQUFPLENBQUMsQ0FBQztRQUNYLENBQUMsQ0FBQyxDQUFDO1FBQ0gsTUFBTSxRQUFRLEdBQ1osS0FBSyxJQUFJLENBQUM7WUFDUixDQUFDLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUM7WUFDdkIsQ0FBQyxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFFaEQsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLE9BQU8sRUFBRSxVQUFVLEVBQUUsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLEVBQUUsQ0FBQztTQUNyQztRQUVELE9BQU87WUFDTCxVQUFVLEVBQUUsUUFBUSxDQUFDLE1BQU07WUFDM0IsTUFBTSxFQUFFLElBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxHQUFHLFFBQVEsQ0FBQyxHQUFHLEdBQUcsQ0FBQyxFQUFFLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO1NBQzlELENBQUM7SUFDSixDQUFDO0lBRUQsdUJBQXVCLENBQUMsSUFBWSxFQUFFLE1BQWM7UUFDbEQsSUFBSSxJQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sS0FBSyxDQUFDLElBQUksSUFBSSxHQUFHLENBQUMsRUFBRTtZQUMzQyxPQUFPLENBQUMsQ0FBQztTQUNWO1FBRUQsTUFBTSxRQUFRLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDMUMsSUFBSSxRQUFRLElBQUksSUFBSSxFQUFFO1lBQ3BCLE1BQU0sWUFBWSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7WUFDL0QsT0FBTyxZQUFZLENBQUMsR0FBRyxHQUFHLFlBQVksQ0FBQyxNQUFNLENBQUM7U0FDL0M7UUFDRCxPQUFPLFFBQVEsQ0FBQyxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsTUFBTSxFQUFFLE1BQU0sR0FBRyxDQUFDLENBQUMsQ0FBQztJQUM5RCxDQUFDO0NBQ0Y7QUFFRCxPQUFPLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxDQUFDO0FBRWpDLGVBQWUsaUJBQWlCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9vIGZyb20gXCJtb29cIjtcbmltcG9ydCBuZWFybGV5IGZyb20gXCJuZWFybGV5XCI7XG5cbmNsYXNzIFNraXBwaW5nTGV4ZXIgaW1wbGVtZW50cyBuZWFybGV5LkxleGVyIHtcbiAgbGV4ZXI6IG1vby5MZXhlcjtcbiAgc2tpcDogU2V0PHN0cmluZz47XG5cbiAgY29uc3RydWN0b3IobGV4ZXI6IG1vby5MZXhlcikge1xuICAgIHRoaXMubGV4ZXIgPSBsZXhlcjtcbiAgICB0aGlzLnNraXAgPSBuZXcgU2V0KFtcIldTXCIsIFwiQ09NTUVOVFwiXSk7XG4gIH1cblxuICBuZXh0KCkge1xuICAgIGRvIHtcbiAgICAgIHZhciB0b2tlbiA9IHRoaXMubGV4ZXIubmV4dCgpO1xuICAgICAgaWYgKCEodG9rZW4gIT0gbnVsbCAmJiB0aGlzLnNraXAuaGFzKHRva2VuLnR5cGUhKSkpIHJldHVybiB0b2tlbjtcbiAgICB9IHdoaWxlICh0cnVlKTtcbiAgfVxuXG4gIHJlc2V0KGNodW5rOiBhbnksIGluZm86IGFueSkge1xuICAgIHRoaXMubGV4ZXIucmVzZXQoY2h1bmssIGluZm8pO1xuICB9XG4gIGZvcm1hdEVycm9yKHRva2VuOiBhbnksIG1lc3NhZ2U/OiBzdHJpbmcpIHtcbiAgICByZXR1cm4gdGhpcy5sZXhlci5mb3JtYXRFcnJvcih0b2tlbiwgbWVzc2FnZSk7XG4gIH1cbiAgc2F2ZSgpIHtcbiAgICByZXR1cm4gdGhpcy5sZXhlci5zYXZlKCk7XG4gIH1cbiAgaGFzKG5hbWU6IHN0cmluZykge1xuICAgIHJldHVybiB0aGlzLmxleGVyLmhhcyhuYW1lKTtcbiAgfVxufVxuXG5pbnRlcmZhY2UgQXN0IHtcbiAgdHlwZTogc3RyaW5nO1xuICBjaGlsZHJlbjogQXN0W107XG4gIHJhbmdlPzogQ29kZVJhbmdlO1xuICB0ZXh0Pzogc3RyaW5nO1xufVxuXG5pbnRlcmZhY2UgQ29kZVJhbmdlIHtcbiAgc3RhcnRMaW5lTnVtYmVyOiBudW1iZXI7XG4gIHN0YXJ0Q29sdW1uOiBudW1iZXI7XG4gIGVuZExpbmVOdW1iZXI6IG51bWJlcjtcbiAgZW5kQ29sdW1uOiBudW1iZXI7XG59XG5cbmNsYXNzIFBhcnNlciBleHRlbmRzIG5lYXJsZXkuUGFyc2VyIHtcbiAgaW5pdGlhbDogYW55O1xuICAjY29kZVJhbmdlQ29tcHV0ZXI6IGNvZGVSYW5nZUNvbXB1dGVyO1xuXG4gIGNvbnN0cnVjdG9yKGdyYW1tYXI6IGFueSkge1xuICAgIHN1cGVyKFBhcnNlci5wcmVwYXJlKGdyYW1tYXIpKTtcbiAgICB0aGlzLmluaXRpYWwgPSB0aGlzLnNhdmUoKTtcbiAgfVxuXG4gIHN0YXRpYyBwcmVwYXJlKGdyYW1tYXI6IGFueSkge1xuICAgIHZhciByaWdpZCA9IGdyYW1tYXIuUmlnaWQgfHwgW107XG4gICAgZm9yIChjb25zdCBydWxlIG9mIGdyYW1tYXIuUGFyc2VyUnVsZXMpIHtcbiAgICAgIHJ1bGUucG9zdHByb2Nlc3MgPSByaWdpZC5pbmNsdWRlcyhydWxlLm5hbWUpXG4gICAgICAgID8gKGRhdGE6IGFueVtdKSA9PiB0aGlzLnVuZm9sZChkYXRhLCBydWxlLm5hbWUpXG4gICAgICAgIDogcnVsZS5zeW1ib2xzLmxlbmd0aCA9PT0gMVxuICAgICAgICA/IChkYXRhOiBhbnlbXSkgPT4gZGF0YVswXVxuICAgICAgICA6IChkYXRhOiBhbnlbXSkgPT4gT2JqZWN0LmFzc2lnbihkYXRhLCB7IHR5cGU6IHJ1bGUubmFtZSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIGdyYW1tYXI7XG4gIH1cblxuICBwYXJzZShwcm9ncmFtOiBzdHJpbmcpIHtcbiAgICB0aGlzLiNjb2RlUmFuZ2VDb21wdXRlciA9IG5ldyBjb2RlUmFuZ2VDb21wdXRlcihwcm9ncmFtKTtcbiAgICB0aGlzLnJlc3RhcnQoKTtcbiAgICB0aGlzLmZlZWQocHJvZ3JhbSk7XG4gICAgLy8gRm9yIG5vbi1hbWJpZ2lvdXMgZ3JhbW1hciwgdGhpcyBpcyB3aGF0IHdlIHdoYXRcbiAgICAvLyBTZWU6IGh0dHBzOi8vbmVhcmxleS5qcy5vcmcvZG9jcy9wYXJzZXIjYS1ub3RlLW9uLWFtYmlndWl0eVxuICAgIGNvbnN0IGFzdCA9IHRoaXMucmVzdWx0c1swXTtcbiAgICB0aGlzLnNldFJhbmdlKGFzdCk7XG4gICAgcmV0dXJuIHRoaXMudG9UcmVlKGFzdCk7XG4gIH1cblxuICByZXN0YXJ0KCkge1xuICAgIHRoaXMucmVzdG9yZSh0aGlzLmluaXRpYWwpO1xuICB9XG5cbiAgcmVwb3J0RXJyb3IodG9rZW46IGFueSkge1xuICAgIHJldHVybiB0aGlzLmxleGVyLmZvcm1hdEVycm9yKHRva2VuLCBcIlN5bnRheCBlcnJvclwiKTtcbiAgfVxuXG4gIHByaXZhdGUgdG9UcmVlKGFzdDogYW55KSB7XG4gICAgaWYgKGFzdC50ZXh0KSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICB0eXBlOiBhc3QudHlwZSxcbiAgICAgICAgdGV4dDogYXN0LnRleHQsXG4gICAgICAgIGNoaWxkcmVuOiBudWxsLFxuICAgICAgICByYW5nZTogYXN0LnJhbmdlLFxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbGV0IHRyZWUgPSB7IHR5cGU6IGFzdC50eXBlLCByYW5nZTogYXN0LnJhbmdlLCBjaGlsZHJlbjogW10gfTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgYXN0Lmxlbmd0aDsgaSsrKVxuICAgICAgICB0cmVlLmNoaWxkcmVuLnB1c2godGhpcy50b1RyZWUoYXN0W2ldKSk7XG5cbiAgICAgIHJldHVybiB0cmVlO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0UmFuZ2UoYXN0KTogdm9pZCB7XG4gICAgaWYgKGFzdC50ZXh0KSB7XG4gICAgICBjb25zdCBzdGFydCA9IHRoaXMuI2NvZGVSYW5nZUNvbXB1dGVyLmdldE51bWJlckFuZENvbHVtbkZyb21Qb3MoXG4gICAgICAgIGFzdC5vZmZzZXRcbiAgICAgICk7XG4gICAgICBjb25zdCBlbmQgPSB0aGlzLiNjb2RlUmFuZ2VDb21wdXRlci5nZXROdW1iZXJBbmRDb2x1bW5Gcm9tUG9zKFxuICAgICAgICBhc3Qub2Zmc2V0ICsgYXN0LnRleHQubGVuZ3RoXG4gICAgICApO1xuICAgICAgYXN0LnJhbmdlID0ge1xuICAgICAgICBzdGFydExpbmVOdW1iZXI6IHN0YXJ0LmxpbmVOdW1iZXIsXG4gICAgICAgIHN0YXJ0Q29sdW1uOiBzdGFydC5jb2x1bW4sXG4gICAgICAgIGVuZExpbmVOdW1iZXI6IGVuZC5saW5lTnVtYmVyLFxuICAgICAgICBlbmRDb2x1bW46IGVuZC5jb2x1bW4sXG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFzdC5sZW5ndGg7IGkrKykgdGhpcy5zZXRSYW5nZShhc3RbaV0pO1xuXG4gICAgICBjb25zdCBmaXJzdENoaWxkID0gYXN0WzBdLFxuICAgICAgICBsYXN0Q2hpbGQgPSBhc3RbYXN0Lmxlbmd0aCAtIDFdO1xuICAgICAgYXN0LnJhbmdlID0ge1xuICAgICAgICBzdGFydExpbmVOdW1iZXI6IGZpcnN0Q2hpbGQucmFuZ2Uuc3RhcnRMaW5lTnVtYmVyLFxuICAgICAgICBzdGFydENvbHVtbjogZmlyc3RDaGlsZC5yYW5nZS5zdGFydENvbHVtbixcbiAgICAgICAgZW5kTGluZU51bWJlcjogbGFzdENoaWxkLnJhbmdlLmVuZExpbmVOdW1iZXIsXG4gICAgICAgIGVuZENvbHVtbjogbGFzdENoaWxkLnJhbmdlLmVuZENvbHVtbixcbiAgICAgIH07XG4gICAgfVxuICB9XG5cbiAgc3RhdGljIHVuZm9sZChkYXRhOiBhbnlbXSwgdHlwZTogc3RyaW5nKSB7XG4gICAgZnVuY3Rpb24qIGl0ZXIoKSB7XG4gICAgICBmb3IgKGNvbnN0IGQgb2YgZGF0YSkge1xuICAgICAgICBpZiAoZC50eXBlID09PSB0eXBlKSB5aWVsZCogZDtcbiAgICAgICAgZWxzZSB5aWVsZCBkO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gT2JqZWN0LmFzc2lnbihbLi4uaXRlcigpXSwgeyB0eXBlIH0pO1xuICB9XG59XG5cbi8vIENvZGUgYmVsb3cgaXMgY29waWVkIGZyb20gaHR0cHM6Ly9naXRodWIuY29tL2RzaGVycmV0L3RzLWFzdC12aWV3ZXIvYmxvYi9tYXN0ZXIvc3JjL3V0aWxzL0xpbmVBbmRDb2x1bW5Db21wdXRlci50c1xuXG5jbGFzcyBBcnJheVV0aWxzIHtcbiAgc3RhdGljIGZyb208VD4oaXRlcmF0b3I6IEl0ZXJhdG9yPFQ+KSB7XG4gICAgY29uc3QgYXJyYXk6IFRbXSA9IFtdO1xuICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICBjb25zdCBuZXh0ID0gaXRlcmF0b3IubmV4dCgpO1xuICAgICAgaWYgKG5leHQuZG9uZSkge1xuICAgICAgICByZXR1cm4gYXJyYXk7XG4gICAgICB9XG4gICAgICBhcnJheS5wdXNoKG5leHQudmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIHN0YXRpYyBiaW5hcnlTZWFyY2g8VD4oaXRlbXM6IHJlYWRvbmx5IFRbXSwgY29tcGFyZVRvOiAodmFsdWU6IFQpID0+IG51bWJlcikge1xuICAgIGxldCB0b3AgPSBpdGVtcy5sZW5ndGggLSAxO1xuICAgIGxldCBib3R0b20gPSAwO1xuXG4gICAgd2hpbGUgKGJvdHRvbSA8PSB0b3ApIHtcbiAgICAgIGNvbnN0IG1pZCA9IE1hdGguZmxvb3IoKHRvcCArIGJvdHRvbSkgLyAyKTtcbiAgICAgIGNvbnN0IGNvbXBhcmlzb25SZXN1bHQgPSBjb21wYXJlVG8oaXRlbXNbbWlkXSk7XG4gICAgICBpZiAoY29tcGFyaXNvblJlc3VsdCA9PT0gMCkge1xuICAgICAgICByZXR1cm4gbWlkO1xuICAgICAgfSBlbHNlIGlmIChjb21wYXJpc29uUmVzdWx0IDwgMCkge1xuICAgICAgICB0b3AgPSBtaWQgLSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgYm90dG9tID0gbWlkICsgMTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gLTE7XG4gIH1cblxuICBwcml2YXRlIGNvbnN0cnVjdG9yKCkge31cbn1cblxuaW50ZXJmYWNlIExpbmVOdW1iZXJBbmRDb2x1bW4ge1xuICBwb3M6IG51bWJlcjtcbiAgbnVtYmVyOiBudW1iZXI7XG4gIGxlbmd0aDogbnVtYmVyO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5lTnVtYmVyQW5kQ29sdW1ucyh0ZXh0OiBzdHJpbmcpIHtcbiAgY29uc3QgbGluZUluZm9zOiBMaW5lTnVtYmVyQW5kQ29sdW1uW10gPSBbXTtcbiAgbGV0IGxhc3RQb3MgPSAwO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgdGV4dC5sZW5ndGg7IGkrKykge1xuICAgIGlmICh0ZXh0W2ldID09PSBcIlxcblwiKSB7XG4gICAgICBwdXNoTGluZUluZm8oaSk7XG4gICAgfVxuICB9XG5cbiAgcHVzaExpbmVJbmZvKHRleHQubGVuZ3RoKTtcblxuICByZXR1cm4gbGluZUluZm9zO1xuXG4gIGZ1bmN0aW9uIHB1c2hMaW5lSW5mbyhwb3M6IG51bWJlcikge1xuICAgIGxpbmVJbmZvcy5wdXNoKHtcbiAgICAgIHBvczogbGFzdFBvcyxcbiAgICAgIGxlbmd0aDogcG9zIC0gbGFzdFBvcyxcbiAgICAgIG51bWJlcjogbGluZUluZm9zLmxlbmd0aCArIDEsXG4gICAgfSk7XG4gICAgbGFzdFBvcyA9IHBvcyArIDE7XG4gIH1cbn1cblxuLyoqIEFuIGVmZmljaWVudCB3YXkgdG8gY29tcHV0ZSB0aGUgbGluZSBhbmQgY29sdW1uIG9mIGEgcG9zaXRpb24gaW4gYSBzdHJpbmcuICovXG5jbGFzcyBjb2RlUmFuZ2VDb21wdXRlciB7XG4gIHByaXZhdGUgcmVhZG9ubHkgbGluZUluZm9zOiBMaW5lTnVtYmVyQW5kQ29sdW1uW107XG5cbiAgY29uc3RydWN0b3IocHVibGljIHJlYWRvbmx5IHRleHQ6IHN0cmluZykge1xuICAgIHRoaXMubGluZUluZm9zID0gY3JlYXRlTGluZU51bWJlckFuZENvbHVtbnModGV4dCk7XG4gIH1cblxuICBnZXROdW1iZXJBbmRDb2x1bW5Gcm9tUG9zKHBvczogbnVtYmVyKSB7XG4gICAgaWYgKHBvcyA8IDApIHtcbiAgICAgIHJldHVybiB7IGxpbmVOdW1iZXI6IDEsIGNvbHVtbjogMSB9O1xuICAgIH1cblxuICAgIGNvbnN0IGluZGV4ID0gQXJyYXlVdGlscy5iaW5hcnlTZWFyY2godGhpcy5saW5lSW5mb3MsIChpbmZvKSA9PiB7XG4gICAgICBpZiAocG9zIDwgaW5mby5wb3MpIHtcbiAgICAgICAgcmV0dXJuIC0xO1xuICAgICAgfVxuICAgICAgaWYgKHBvcyA+PSBpbmZvLnBvcyAmJiBwb3MgPCBpbmZvLnBvcyArIGluZm8ubGVuZ3RoICsgMSkge1xuICAgICAgICAvLyBgKyAxYCBpcyBmb3IgbmV3bGluZSBjaGFyXG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfVxuICAgICAgcmV0dXJuIDE7XG4gICAgfSk7XG4gICAgY29uc3QgbGluZUluZm8gPVxuICAgICAgaW5kZXggPj0gMFxuICAgICAgICA/IHRoaXMubGluZUluZm9zW2luZGV4XVxuICAgICAgICA6IHRoaXMubGluZUluZm9zW3RoaXMubGluZUluZm9zLmxlbmd0aCAtIDFdO1xuXG4gICAgaWYgKGxpbmVJbmZvID09IG51bGwpIHtcbiAgICAgIHJldHVybiB7IGxpbmVOdW1iZXI6IDEsIGNvbHVtbjogMSB9O1xuICAgIH1cblxuICAgIHJldHVybiB7XG4gICAgICBsaW5lTnVtYmVyOiBsaW5lSW5mby5udW1iZXIsXG4gICAgICBjb2x1bW46IE1hdGgubWluKHBvcyAtIGxpbmVJbmZvLnBvcyArIDEsIGxpbmVJbmZvLmxlbmd0aCArIDEpLFxuICAgIH07XG4gIH1cblxuICBnZXRQb3NGcm9tTGluZUFuZENvbHVtbihsaW5lOiBudW1iZXIsIGNvbHVtbjogbnVtYmVyKSB7XG4gICAgaWYgKHRoaXMubGluZUluZm9zLmxlbmd0aCA9PT0gMCB8fCBsaW5lIDwgMSkge1xuICAgICAgcmV0dXJuIDA7XG4gICAgfVxuXG4gICAgY29uc3QgbGluZUluZm8gPSB0aGlzLmxpbmVJbmZvc1tsaW5lIC0gMV07XG4gICAgaWYgKGxpbmVJbmZvID09IG51bGwpIHtcbiAgICAgIGNvbnN0IGxhc3RMaW5lSW5mbyA9IHRoaXMubGluZUluZm9zW3RoaXMubGluZUluZm9zLmxlbmd0aCAtIDFdO1xuICAgICAgcmV0dXJuIGxhc3RMaW5lSW5mby5wb3MgKyBsYXN0TGluZUluZm8ubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gbGluZUluZm8ucG9zICsgTWF0aC5taW4obGluZUluZm8ubGVuZ3RoLCBjb2x1bW4gLSAxKTtcbiAgfVxufVxuXG5leHBvcnQgeyBQYXJzZXIsIFNraXBwaW5nTGV4ZXIgfTtcbmV4cG9ydCB0eXBlIHsgQXN0LCBDb2RlUmFuZ2UgfTtcbmV4cG9ydCBkZWZhdWx0IGNvZGVSYW5nZUNvbXB1dGVyO1xuIl19
};
kremlin.m['nearley@2.20.1:lib/nearley.js'] = (module,exports,global) => {(function(root, factory) {
    if (typeof module === 'object' && module.exports) {
        module.exports = factory();
    } else {
        root.nearley = factory();
    }
}(this, function() {

    function Rule(name, symbols, postprocess) {
        this.id = ++Rule.highestId;
        this.name = name;
        this.symbols = symbols;        // a list of literal | regex class | nonterminal
        this.postprocess = postprocess;
        return this;
    }
    Rule.highestId = 0;

    Rule.prototype.toString = function(withCursorAt) {
        var symbolSequence = (typeof withCursorAt === "undefined")
                             ? this.symbols.map(getSymbolShortDisplay).join(' ')
                             : (   this.symbols.slice(0, withCursorAt).map(getSymbolShortDisplay).join(' ')
                                 + " ● "
                                 + this.symbols.slice(withCursorAt).map(getSymbolShortDisplay).join(' ')     );
        return this.name + " → " + symbolSequence;
    }


    // a State is a rule at a position from a given starting point in the input stream (reference)
    function State(rule, dot, reference, wantedBy) {
        this.rule = rule;
        this.dot = dot;
        this.reference = reference;
        this.data = [];
        this.wantedBy = wantedBy;
        this.isComplete = this.dot === rule.symbols.length;
    }

    State.prototype.toString = function() {
        return "{" + this.rule.toString(this.dot) + "}, from: " + (this.reference || 0);
    };

    State.prototype.nextState = function(child) {
        var state = new State(this.rule, this.dot + 1, this.reference, this.wantedBy);
        state.left = this;
        state.right = child;
        if (state.isComplete) {
            state.data = state.build();
            // Having right set here will prevent the right state and its children
            // form being garbage collected
            state.right = undefined;
        }
        return state;
    };

    State.prototype.build = function() {
        var children = [];
        var node = this;
        do {
            children.push(node.right.data);
            node = node.left;
        } while (node.left);
        children.reverse();
        return children;
    };

    State.prototype.finish = function() {
        if (this.rule.postprocess) {
            this.data = this.rule.postprocess(this.data, this.reference, Parser.fail);
        }
    };


    function Column(grammar, index) {
        this.grammar = grammar;
        this.index = index;
        this.states = [];
        this.wants = {}; // states indexed by the non-terminal they expect
        this.scannable = []; // list of states that expect a token
        this.completed = {}; // states that are nullable
    }


    Column.prototype.process = function(nextColumn) {
        var states = this.states;
        var wants = this.wants;
        var completed = this.completed;

        for (var w = 0; w < states.length; w++) { // nb. we push() during iteration
            var state = states[w];

            if (state.isComplete) {
                state.finish();
                if (state.data !== Parser.fail) {
                    // complete
                    var wantedBy = state.wantedBy;
                    for (var i = wantedBy.length; i--; ) { // this line is hot
                        var left = wantedBy[i];
                        this.complete(left, state);
                    }

                    // special-case nullables
                    if (state.reference === this.index) {
                        // make sure future predictors of this rule get completed.
                        var exp = state.rule.name;
                        (this.completed[exp] = this.completed[exp] || []).push(state);
                    }
                }

            } else {
                // queue scannable states
                var exp = state.rule.symbols[state.dot];
                if (typeof exp !== 'string') {
                    this.scannable.push(state);
                    continue;
                }

                // predict
                if (wants[exp]) {
                    wants[exp].push(state);

                    if (completed.hasOwnProperty(exp)) {
                        var nulls = completed[exp];
                        for (var i = 0; i < nulls.length; i++) {
                            var right = nulls[i];
                            this.complete(state, right);
                        }
                    }
                } else {
                    wants[exp] = [state];
                    this.predict(exp);
                }
            }
        }
    }

    Column.prototype.predict = function(exp) {
        var rules = this.grammar.byName[exp] || [];

        for (var i = 0; i < rules.length; i++) {
            var r = rules[i];
            var wantedBy = this.wants[exp];
            var s = new State(r, 0, this.index, wantedBy);
            this.states.push(s);
        }
    }

    Column.prototype.complete = function(left, right) {
        var copy = left.nextState(right);
        this.states.push(copy);
    }


    function Grammar(rules, start) {
        this.rules = rules;
        this.start = start || this.rules[0].name;
        var byName = this.byName = {};
        this.rules.forEach(function(rule) {
            if (!byName.hasOwnProperty(rule.name)) {
                byName[rule.name] = [];
            }
            byName[rule.name].push(rule);
        });
    }

    // So we can allow passing (rules, start) directly to Parser for backwards compatibility
    Grammar.fromCompiled = function(rules, start) {
        var lexer = rules.Lexer;
        if (rules.ParserStart) {
          start = rules.ParserStart;
          rules = rules.ParserRules;
        }
        var rules = rules.map(function (r) { return (new Rule(r.name, r.symbols, r.postprocess)); });
        var g = new Grammar(rules, start);
        g.lexer = lexer; // nb. storing lexer on Grammar is iffy, but unavoidable
        return g;
    }


    function StreamLexer() {
      this.reset("");
    }

    StreamLexer.prototype.reset = function(data, state) {
        this.buffer = data;
        this.index = 0;
        this.line = state ? state.line : 1;
        this.lastLineBreak = state ? -state.col : 0;
    }

    StreamLexer.prototype.next = function() {
        if (this.index < this.buffer.length) {
            var ch = this.buffer[this.index++];
            if (ch === '\n') {
              this.line += 1;
              this.lastLineBreak = this.index;
            }
            return {value: ch};
        }
    }

    StreamLexer.prototype.save = function() {
      return {
        line: this.line,
        col: this.index - this.lastLineBreak,
      }
    }

    StreamLexer.prototype.formatError = function(token, message) {
        // nb. this gets called after consuming the offending token,
        // so the culprit is index-1
        var buffer = this.buffer;
        if (typeof buffer === 'string') {
            var lines = buffer
                .split("\n")
                .slice(
                    Math.max(0, this.line - 5), 
                    this.line
                );

            var nextLineBreak = buffer.indexOf('\n', this.index);
            if (nextLineBreak === -1) nextLineBreak = buffer.length;
            var col = this.index - this.lastLineBreak;
            var lastLineDigits = String(this.line).length;
            message += " at line " + this.line + " col " + col + ":\n\n";
            message += lines
                .map(function(line, i) {
                    return pad(this.line - lines.length + i + 1, lastLineDigits) + " " + line;
                }, this)
                .join("\n");
            message += "\n" + pad("", lastLineDigits + col) + "^\n";
            return message;
        } else {
            return message + " at index " + (this.index - 1);
        }

        function pad(n, length) {
            var s = String(n);
            return Array(length - s.length + 1).join(" ") + s;
        }
    }

    function Parser(rules, start, options) {
        if (rules instanceof Grammar) {
            var grammar = rules;
            var options = start;
        } else {
            var grammar = Grammar.fromCompiled(rules, start);
        }
        this.grammar = grammar;

        // Read options
        this.options = {
            keepHistory: false,
            lexer: grammar.lexer || new StreamLexer,
        };
        for (var key in (options || {})) {
            this.options[key] = options[key];
        }

        // Setup lexer
        this.lexer = this.options.lexer;
        this.lexerState = undefined;

        // Setup a table
        var column = new Column(grammar, 0);
        var table = this.table = [column];

        // I could be expecting anything.
        column.wants[grammar.start] = [];
        column.predict(grammar.start);
        // TODO what if start rule is nullable?
        column.process();
        this.current = 0; // token index
    }

    // create a reserved token for indicating a parse fail
    Parser.fail = {};

    Parser.prototype.feed = function(chunk) {
        var lexer = this.lexer;
        lexer.reset(chunk, this.lexerState);

        var token;
        while (true) {
            try {
                token = lexer.next();
                if (!token) {
                    break;
                }
            } catch (e) {
                // Create the next column so that the error reporter
                // can display the correctly predicted states.
                var nextColumn = new Column(this.grammar, this.current + 1);
                this.table.push(nextColumn);
                var err = new Error(this.reportLexerError(e));
                err.offset = this.current;
                err.token = e.token;
                throw err;
            }
            // We add new states to table[current+1]
            var column = this.table[this.current];

            // GC unused states
            if (!this.options.keepHistory) {
                delete this.table[this.current - 1];
            }

            var n = this.current + 1;
            var nextColumn = new Column(this.grammar, n);
            this.table.push(nextColumn);

            // Advance all tokens that expect the symbol
            var literal = token.text !== undefined ? token.text : token.value;
            var value = lexer.constructor === StreamLexer ? token.value : token;
            var scannable = column.scannable;
            for (var w = scannable.length; w--; ) {
                var state = scannable[w];
                var expect = state.rule.symbols[state.dot];
                // Try to consume the token
                // either regex or literal
                if (expect.test ? expect.test(value) :
                    expect.type ? expect.type === token.type
                                : expect.literal === literal) {
                    // Add it
                    var next = state.nextState({data: value, token: token, isToken: true, reference: n - 1});
                    nextColumn.states.push(next);
                }
            }

            // Next, for each of the rules, we either
            // (a) complete it, and try to see if the reference row expected that
            //     rule
            // (b) predict the next nonterminal it expects by adding that
            //     nonterminal's start state
            // To prevent duplication, we also keep track of rules we have already
            // added

            nextColumn.process();

            // If needed, throw an error:
            if (nextColumn.states.length === 0) {
                // No states at all! This is not good.
                var err = new Error(this.reportError(token));
                err.offset = this.current;
                err.token = token;
                throw err;
            }

            // maybe save lexer state
            if (this.options.keepHistory) {
              column.lexerState = lexer.save()
            }

            this.current++;
        }
        if (column) {
          this.lexerState = lexer.save()
        }

        // Incrementally keep track of results
        this.results = this.finish();

        // Allow chaining, for whatever it's worth
        return this;
    };

    Parser.prototype.reportLexerError = function(lexerError) {
        var tokenDisplay, lexerMessage;
        // Planning to add a token property to moo's thrown error
        // even on erroring tokens to be used in error display below
        var token = lexerError.token;
        if (token) {
            tokenDisplay = "input " + JSON.stringify(token.text[0]) + " (lexer error)";
            lexerMessage = this.lexer.formatError(token, "Syntax error");
        } else {
            tokenDisplay = "input (lexer error)";
            lexerMessage = lexerError.message;
        }
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportError = function(token) {
        var tokenDisplay = (token.type ? token.type + " token: " : "") + JSON.stringify(token.value !== undefined ? token.value : token);
        var lexerMessage = this.lexer.formatError(token, "Syntax error");
        return this.reportErrorCommon(lexerMessage, tokenDisplay);
    };

    Parser.prototype.reportErrorCommon = function(lexerMessage, tokenDisplay) {
        var lines = [];
        lines.push(lexerMessage);
        var lastColumnIndex = this.table.length - 2;
        var lastColumn = this.table[lastColumnIndex];
        var expectantStates = lastColumn.states
            .filter(function(state) {
                var nextSymbol = state.rule.symbols[state.dot];
                return nextSymbol && typeof nextSymbol !== "string";
            });

        if (expectantStates.length === 0) {
            lines.push('Unexpected ' + tokenDisplay + '. I did not expect any more input. Here is the state of my parse table:\n');
            this.displayStateStack(lastColumn.states, lines);
        } else {
            lines.push('Unexpected ' + tokenDisplay + '. Instead, I was expecting to see one of the following:\n');
            // Display a "state stack" for each expectant state
            // - which shows you how this state came to be, step by step.
            // If there is more than one derivation, we only display the first one.
            var stateStacks = expectantStates
                .map(function(state) {
                    return this.buildFirstStateStack(state, []) || [state];
                }, this);
            // Display each state that is expecting a terminal symbol next.
            stateStacks.forEach(function(stateStack) {
                var state = stateStack[0];
                var nextSymbol = state.rule.symbols[state.dot];
                var symbolDisplay = this.getSymbolDisplay(nextSymbol);
                lines.push('A ' + symbolDisplay + ' based on:');
                this.displayStateStack(stateStack, lines);
            }, this);
        }
        lines.push("");
        return lines.join("\n");
    }
    
    Parser.prototype.displayStateStack = function(stateStack, lines) {
        var lastDisplay;
        var sameDisplayCount = 0;
        for (var j = 0; j < stateStack.length; j++) {
            var state = stateStack[j];
            var display = state.rule.toString(state.dot);
            if (display === lastDisplay) {
                sameDisplayCount++;
            } else {
                if (sameDisplayCount > 0) {
                    lines.push('    ^ ' + sameDisplayCount + ' more lines identical to this');
                }
                sameDisplayCount = 0;
                lines.push('    ' + display);
            }
            lastDisplay = display;
        }
    };

    Parser.prototype.getSymbolDisplay = function(symbol) {
        return getSymbolLongDisplay(symbol);
    };

    /*
    Builds a the first state stack. You can think of a state stack as the call stack
    of the recursive-descent parser which the Nearley parse algorithm simulates.
    A state stack is represented as an array of state objects. Within a
    state stack, the first item of the array will be the starting
    state, with each successive item in the array going further back into history.

    This function needs to be given a starting state and an empty array representing
    the visited states, and it returns an single state stack.

    */
    Parser.prototype.buildFirstStateStack = function(state, visited) {
        if (visited.indexOf(state) !== -1) {
            // Found cycle, return null
            // to eliminate this path from the results, because
            // we don't know how to display it meaningfully
            return null;
        }
        if (state.wantedBy.length === 0) {
            return [state];
        }
        var prevState = state.wantedBy[0];
        var childVisited = [state].concat(visited);
        var childResult = this.buildFirstStateStack(prevState, childVisited);
        if (childResult === null) {
            return null;
        }
        return [state].concat(childResult);
    };

    Parser.prototype.save = function() {
        var column = this.table[this.current];
        column.lexerState = this.lexerState;
        return column;
    };

    Parser.prototype.restore = function(column) {
        var index = column.index;
        this.current = index;
        this.table[index] = column;
        this.table.splice(index + 1);
        this.lexerState = column.lexerState;

        // Incrementally keep track of results
        this.results = this.finish();
    };

    // nb. deprecated: use save/restore instead!
    Parser.prototype.rewind = function(index) {
        if (!this.options.keepHistory) {
            throw new Error('set option `keepHistory` to enable rewinding')
        }
        // nb. recall column (table) indicies fall between token indicies.
        //        col 0   --   token 0   --   col 1
        this.restore(this.table[index]);
    };

    Parser.prototype.finish = function() {
        // Return the possible parsings
        var considerations = [];
        var start = this.grammar.start;
        var column = this.table[this.table.length - 1]
        column.states.forEach(function (t) {
            if (t.rule.name === start
                    && t.dot === t.rule.symbols.length
                    && t.reference === 0
                    && t.data !== Parser.fail) {
                considerations.push(t);
            }
        });
        return considerations.map(function(c) {return c.data; });
    };

    function getSymbolLongDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return 'character matching ' + symbol;
            } else if (symbol.type) {
                return symbol.type + ' token';
            } else if (symbol.test) {
                return 'token matching ' + String(symbol.test);
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    function getSymbolShortDisplay(symbol) {
        var type = typeof symbol;
        if (type === "string") {
            return symbol;
        } else if (type === "object") {
            if (symbol.literal) {
                return JSON.stringify(symbol.literal);
            } else if (symbol instanceof RegExp) {
                return symbol.toString();
            } else if (symbol.type) {
                return '%' + symbol.type;
            } else if (symbol.test) {
                return '<' + String(symbol.test) + '>';
            } else {
                throw new Error('Unknown symbol type: ' + symbol);
            }
        }
    }

    return {
        Parser: Parser,
        Grammar: Grammar,
        Rule: Rule,
    };

}));

};
kremlin.m['moo@0.5.1:moo.js'] = (module,exports,global) => {(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory) /* global define */
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory()
  } else {
    root.moo = factory()
  }
}(this, function() {
  'use strict';

  var hasOwnProperty = Object.prototype.hasOwnProperty
  var toString = Object.prototype.toString
  var hasSticky = typeof new RegExp().sticky === 'boolean'

  /***************************************************************************/

  function isRegExp(o) { return o && toString.call(o) === '[object RegExp]' }
  function isObject(o) { return o && typeof o === 'object' && !isRegExp(o) && !Array.isArray(o) }

  function reEscape(s) {
    return s.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&')
  }
  function reGroups(s) {
    var re = new RegExp('|' + s)
    return re.exec('').length - 1
  }
  function reCapture(s) {
    return '(' + s + ')'
  }
  function reUnion(regexps) {
    if (!regexps.length) return '(?!)'
    var source =  regexps.map(function(s) {
      return "(?:" + s + ")"
    }).join('|')
    return "(?:" + source + ")"
  }

  function regexpOrLiteral(obj) {
    if (typeof obj === 'string') {
      return '(?:' + reEscape(obj) + ')'

    } else if (isRegExp(obj)) {
      // TODO: consider /u support
      if (obj.ignoreCase) throw new Error('RegExp /i flag not allowed')
      if (obj.global) throw new Error('RegExp /g flag is implied')
      if (obj.sticky) throw new Error('RegExp /y flag is implied')
      if (obj.multiline) throw new Error('RegExp /m flag is implied')
      return obj.source

    } else {
      throw new Error('Not a pattern: ' + obj)
    }
  }

  function objectToRules(object) {
    var keys = Object.getOwnPropertyNames(object)
    var result = []
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var thing = object[key]
      var rules = [].concat(thing)
      if (key === 'include') {
        for (var j = 0; j < rules.length; j++) {
          result.push({include: rules[j]})
        }
        continue
      }
      var match = []
      rules.forEach(function(rule) {
        if (isObject(rule)) {
          if (match.length) result.push(ruleOptions(key, match))
          result.push(ruleOptions(key, rule))
          match = []
        } else {
          match.push(rule)
        }
      })
      if (match.length) result.push(ruleOptions(key, match))
    }
    return result
  }

  function arrayToRules(array) {
    var result = []
    for (var i = 0; i < array.length; i++) {
      var obj = array[i]
      if (obj.include) {
        var include = [].concat(obj.include)
        for (var j = 0; j < include.length; j++) {
          result.push({include: include[j]})
        }
        continue
      }
      if (!obj.type) {
        throw new Error('Rule has no type: ' + JSON.stringify(obj))
      }
      result.push(ruleOptions(obj.type, obj))
    }
    return result
  }

  function ruleOptions(type, obj) {
    if (!isObject(obj)) {
      obj = { match: obj }
    }
    if (obj.include) {
      throw new Error('Matching rules cannot also include states')
    }

    // nb. error and fallback imply lineBreaks
    var options = {
      defaultType: type,
      lineBreaks: !!obj.error || !!obj.fallback,
      pop: false,
      next: null,
      push: null,
      error: false,
      fallback: false,
      value: null,
      type: null,
      shouldThrow: false,
    }

    // Avoid Object.assign(), so we support IE9+
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) {
        options[key] = obj[key]
      }
    }

    // type transform cannot be a string
    if (typeof options.type === 'string' && type !== options.type) {
      throw new Error("Type transform cannot be a string (type '" + options.type + "' for token '" + type + "')")
    }

    // convert to array
    var match = options.match
    options.match = Array.isArray(match) ? match : match ? [match] : []
    options.match.sort(function(a, b) {
      return isRegExp(a) && isRegExp(b) ? 0
           : isRegExp(b) ? -1 : isRegExp(a) ? +1 : b.length - a.length
    })
    return options
  }

  function toRules(spec) {
    return Array.isArray(spec) ? arrayToRules(spec) : objectToRules(spec)
  }

  var defaultErrorRule = ruleOptions('error', {lineBreaks: true, shouldThrow: true})
  function compileRules(rules, hasStates) {
    var errorRule = null
    var fast = Object.create(null)
    var fastAllowed = true
    var unicodeFlag = null
    var groups = []
    var parts = []

    // If there is a fallback rule, then disable fast matching
    for (var i = 0; i < rules.length; i++) {
      if (rules[i].fallback) {
        fastAllowed = false
      }
    }

    for (var i = 0; i < rules.length; i++) {
      var options = rules[i]

      if (options.include) {
        // all valid inclusions are removed by states() preprocessor
        throw new Error('Inheritance is not allowed in stateless lexers')
      }

      if (options.error || options.fallback) {
        // errorRule can only be set once
        if (errorRule) {
          if (!options.fallback === !errorRule.fallback) {
            throw new Error("Multiple " + (options.fallback ? "fallback" : "error") + " rules not allowed (for token '" + options.defaultType + "')")
          } else {
            throw new Error("fallback and error are mutually exclusive (for token '" + options.defaultType + "')")
          }
        }
        errorRule = options
      }

      var match = options.match.slice()
      if (fastAllowed) {
        while (match.length && typeof match[0] === 'string' && match[0].length === 1) {
          var word = match.shift()
          fast[word.charCodeAt(0)] = options
        }
      }

      // Warn about inappropriate state-switching options
      if (options.pop || options.push || options.next) {
        if (!hasStates) {
          throw new Error("State-switching options are not allowed in stateless lexers (for token '" + options.defaultType + "')")
        }
        if (options.fallback) {
          throw new Error("State-switching options are not allowed on fallback tokens (for token '" + options.defaultType + "')")
        }
      }

      // Only rules with a .match are included in the RegExp
      if (match.length === 0) {
        continue
      }
      fastAllowed = false

      groups.push(options)

      // Check unicode flag is used everywhere or nowhere
      for (var j = 0; j < match.length; j++) {
        var obj = match[j]
        if (!isRegExp(obj)) {
          continue
        }

        if (unicodeFlag === null) {
          unicodeFlag = obj.unicode
        } else if (unicodeFlag !== obj.unicode && options.fallback === false) {
          throw new Error('If one rule is /u then all must be')
        }
      }

      // convert to RegExp
      var pat = reUnion(match.map(regexpOrLiteral))

      // validate
      var regexp = new RegExp(pat)
      if (regexp.test("")) {
        throw new Error("RegExp matches empty string: " + regexp)
      }
      var groupCount = reGroups(pat)
      if (groupCount > 0) {
        throw new Error("RegExp has capture groups: " + regexp + "\nUse (?: … ) instead")
      }

      // try and detect rules matching newlines
      if (!options.lineBreaks && regexp.test('\n')) {
        throw new Error('Rule should declare lineBreaks: ' + regexp)
      }

      // store regex
      parts.push(reCapture(pat))
    }


    // If there's no fallback rule, use the sticky flag so we only look for
    // matches at the current index.
    //
    // If we don't support the sticky flag, then fake it using an irrefutable
    // match (i.e. an empty pattern).
    var fallbackRule = errorRule && errorRule.fallback
    var flags = hasSticky && !fallbackRule ? 'ym' : 'gm'
    var suffix = hasSticky || fallbackRule ? '' : '|'

    if (unicodeFlag === true) flags += "u"
    var combined = new RegExp(reUnion(parts) + suffix, flags)
    return {regexp: combined, groups: groups, fast: fast, error: errorRule || defaultErrorRule}
  }

  function compile(rules) {
    var result = compileRules(toRules(rules))
    return new Lexer({start: result}, 'start')
  }

  function checkStateGroup(g, name, map) {
    var state = g && (g.push || g.next)
    if (state && !map[state]) {
      throw new Error("Missing state '" + state + "' (in token '" + g.defaultType + "' of state '" + name + "')")
    }
    if (g && g.pop && +g.pop !== 1) {
      throw new Error("pop must be 1 (in token '" + g.defaultType + "' of state '" + name + "')")
    }
  }
  function compileStates(states, start) {
    var all = states.$all ? toRules(states.$all) : []
    delete states.$all

    var keys = Object.getOwnPropertyNames(states)
    if (!start) start = keys[0]

    var ruleMap = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      ruleMap[key] = toRules(states[key]).concat(all)
    }
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      var rules = ruleMap[key]
      var included = Object.create(null)
      for (var j = 0; j < rules.length; j++) {
        var rule = rules[j]
        if (!rule.include) continue
        var splice = [j, 1]
        if (rule.include !== key && !included[rule.include]) {
          included[rule.include] = true
          var newRules = ruleMap[rule.include]
          if (!newRules) {
            throw new Error("Cannot include nonexistent state '" + rule.include + "' (in state '" + key + "')")
          }
          for (var k = 0; k < newRules.length; k++) {
            var newRule = newRules[k]
            if (rules.indexOf(newRule) !== -1) continue
            splice.push(newRule)
          }
        }
        rules.splice.apply(rules, splice)
        j--
      }
    }

    var map = Object.create(null)
    for (var i = 0; i < keys.length; i++) {
      var key = keys[i]
      map[key] = compileRules(ruleMap[key], true)
    }

    for (var i = 0; i < keys.length; i++) {
      var name = keys[i]
      var state = map[name]
      var groups = state.groups
      for (var j = 0; j < groups.length; j++) {
        checkStateGroup(groups[j], name, map)
      }
      var fastKeys = Object.getOwnPropertyNames(state.fast)
      for (var j = 0; j < fastKeys.length; j++) {
        checkStateGroup(state.fast[fastKeys[j]], name, map)
      }
    }

    return new Lexer(map, start)
  }

  function keywordTransform(map) {
    var reverseMap = Object.create(null)
    var byLength = Object.create(null)
    var types = Object.getOwnPropertyNames(map)
    for (var i = 0; i < types.length; i++) {
      var tokenType = types[i]
      var item = map[tokenType]
      var keywordList = Array.isArray(item) ? item : [item]
      keywordList.forEach(function(keyword) {
        (byLength[keyword.length] = byLength[keyword.length] || []).push(keyword)
        if (typeof keyword !== 'string') {
          throw new Error("keyword must be string (in keyword '" + tokenType + "')")
        }
        reverseMap[keyword] = tokenType
      })
    }

    // fast string lookup
    // https://jsperf.com/string-lookups
    function str(x) { return JSON.stringify(x) }
    var source = ''
    source += 'switch (value.length) {\n'
    for (var length in byLength) {
      var keywords = byLength[length]
      source += 'case ' + length + ':\n'
      source += 'switch (value) {\n'
      keywords.forEach(function(keyword) {
        var tokenType = reverseMap[keyword]
        source += 'case ' + str(keyword) + ': return ' + str(tokenType) + '\n'
      })
      source += '}\n'
    }
    source += '}\n'
    return Function('value', source) // type
  }

  /***************************************************************************/

  var Lexer = function(states, state) {
    this.startState = state
    this.states = states
    this.buffer = ''
    this.stack = []
    this.reset()
  }

  Lexer.prototype.reset = function(data, info) {
    this.buffer = data || ''
    this.index = 0
    this.line = info ? info.line : 1
    this.col = info ? info.col : 1
    this.queuedToken = info ? info.queuedToken : null
    this.queuedThrow = info ? info.queuedThrow : null
    this.setState(info ? info.state : this.startState)
    this.stack = info && info.stack ? info.stack.slice() : []
    return this
  }

  Lexer.prototype.save = function() {
    return {
      line: this.line,
      col: this.col,
      state: this.state,
      stack: this.stack.slice(),
      queuedToken: this.queuedToken,
      queuedThrow: this.queuedThrow,
    }
  }

  Lexer.prototype.setState = function(state) {
    if (!state || this.state === state) return
    this.state = state
    var info = this.states[state]
    this.groups = info.groups
    this.error = info.error
    this.re = info.regexp
    this.fast = info.fast
  }

  Lexer.prototype.popState = function() {
    this.setState(this.stack.pop())
  }

  Lexer.prototype.pushState = function(state) {
    this.stack.push(this.state)
    this.setState(state)
  }

  var eat = hasSticky ? function(re, buffer) { // assume re is /y
    return re.exec(buffer)
  } : function(re, buffer) { // assume re is /g
    var match = re.exec(buffer)
    // will always match, since we used the |(?:) trick
    if (match[0].length === 0) {
      return null
    }
    return match
  }

  Lexer.prototype._getGroup = function(match) {
    var groupCount = this.groups.length
    for (var i = 0; i < groupCount; i++) {
      if (match[i + 1] !== undefined) {
        return this.groups[i]
      }
    }
    throw new Error('Cannot find token type for matched text')
  }

  function tokenToString() {
    return this.value
  }

  Lexer.prototype.next = function() {
    var index = this.index

    // If a fallback token matched, we don't need to re-run the RegExp
    if (this.queuedGroup) {
      var token = this._token(this.queuedGroup, this.queuedText, index)
      this.queuedGroup = null
      this.queuedText = ""
      return token
    }

    var buffer = this.buffer
    if (index === buffer.length) {
      return // EOF
    }

    // Fast matching for single characters
    var group = this.fast[buffer.charCodeAt(index)]
    if (group) {
      return this._token(group, buffer.charAt(index), index)
    }

    // Execute RegExp
    var re = this.re
    re.lastIndex = index
    var match = eat(re, buffer)

    // Error tokens match the remaining buffer
    var error = this.error
    if (match == null) {
      return this._token(error, buffer.slice(index, buffer.length), index)
    }

    var group = this._getGroup(match)
    var text = match[0]

    if (error.fallback && match.index !== index) {
      this.queuedGroup = group
      this.queuedText = text

      // Fallback tokens contain the unmatched portion of the buffer
      return this._token(error, buffer.slice(index, match.index), index)
    }

    return this._token(group, text, index)
  }

  Lexer.prototype._token = function(group, text, offset) {
    // count line breaks
    var lineBreaks = 0
    if (group.lineBreaks) {
      var matchNL = /\n/g
      var nl = 1
      if (text === '\n') {
        lineBreaks = 1
      } else {
        while (matchNL.exec(text)) { lineBreaks++; nl = matchNL.lastIndex }
      }
    }

    var token = {
      type: (typeof group.type === 'function' && group.type(text)) || group.defaultType,
      value: typeof group.value === 'function' ? group.value(text) : text,
      text: text,
      toString: tokenToString,
      offset: offset,
      lineBreaks: lineBreaks,
      line: this.line,
      col: this.col,
    }
    // nb. adding more props to token object will make V8 sad!

    var size = text.length
    this.index += size
    this.line += lineBreaks
    if (lineBreaks !== 0) {
      this.col = size - nl + 1
    } else {
      this.col += size
    }

    // throw, if no rule with {error: true}
    if (group.shouldThrow) {
      throw new Error(this.formatError(token, "invalid syntax"))
    }

    if (group.pop) this.popState()
    else if (group.push) this.pushState(group.push)
    else if (group.next) this.setState(group.next)

    return token
  }

  if (typeof Symbol !== 'undefined' && Symbol.iterator) {
    var LexerIterator = function(lexer) {
      this.lexer = lexer
    }

    LexerIterator.prototype.next = function() {
      var token = this.lexer.next()
      return {value: token, done: !token}
    }

    LexerIterator.prototype[Symbol.iterator] = function() {
      return this
    }

    Lexer.prototype[Symbol.iterator] = function() {
      return new LexerIterator(this)
    }
  }

  Lexer.prototype.formatError = function(token, message) {
    if (token == null) {
      // An undefined token indicates EOF
      var text = this.buffer.slice(this.index)
      var token = {
        text: text,
        offset: this.index,
        lineBreaks: text.indexOf('\n') === -1 ? 0 : 1,
        line: this.line,
        col: this.col,
      }
    }
    var start = Math.max(0, token.offset - token.col + 1)
    var eol = token.lineBreaks ? token.text.indexOf('\n') : token.text.length
    var firstLine = this.buffer.substring(start, token.offset + eol)
    message += " at line " + token.line + " col " + token.col + ":\n\n"
    message += "  " + firstLine + "\n"
    message += "  " + Array(token.col).join(" ") + "^"
    return message
  }

  Lexer.prototype.clone = function() {
    return new Lexer(this.states, this.state)
  }

  Lexer.prototype.has = function(tokenType) {
    return true
  }


  return {
    compile: compile,
    states: compileStates,
    error: Object.freeze({error: true}),
    fallback: Object.freeze({fallback: true}),
    keywords: keywordTransform,
  }

}));

};
kremlin.m['mkdirp@0.5.5:index.js'] = (module,exports,global) => {var path = require('path');
var fs = require('fs');
var _0777 = parseInt('0777', 8);

module.exports = mkdirP.mkdirp = mkdirP.mkdirP = mkdirP;

function mkdirP (p, opts, f, made) {
    if (typeof opts === 'function') {
        f = opts;
        opts = {};
    }
    else if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;
    
    var cb = f || function () {};
    p = path.resolve(p);
    
    xfs.mkdir(p, mode, function (er) {
        if (!er) {
            made = made || p;
            return cb(null, made);
        }
        switch (er.code) {
            case 'ENOENT':
                if (path.dirname(p) === p) return cb(er);
                mkdirP(path.dirname(p), opts, function (er, made) {
                    if (er) cb(er, made);
                    else mkdirP(p, opts, cb, made);
                });
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                xfs.stat(p, function (er2, stat) {
                    // if the stat fails, then that's super weird.
                    // let the original error be the failure reason.
                    if (er2 || !stat.isDirectory()) cb(er, made)
                    else cb(null, made);
                });
                break;
        }
    });
}

mkdirP.sync = function sync (p, opts, made) {
    if (!opts || typeof opts !== 'object') {
        opts = { mode: opts };
    }
    
    var mode = opts.mode;
    var xfs = opts.fs || fs;
    
    if (mode === undefined) {
        mode = _0777
    }
    if (!made) made = null;

    p = path.resolve(p);

    try {
        xfs.mkdirSync(p, mode);
        made = made || p;
    }
    catch (err0) {
        switch (err0.code) {
            case 'ENOENT' :
                made = sync(path.dirname(p), opts, made);
                sync(p, opts, made);
                break;

            // In the case of any other error, just see if there's a dir
            // there already.  If so, then hooray!  If not, then something
            // is borked.
            default:
                var stat;
                try {
                    stat = xfs.statSync(p);
                }
                catch (err1) {
                    throw err0;
                }
                if (!stat.isDirectory()) throw err0;
                break;
        }
    }

    return made;
};

};
{ let c = kremlin.requires(["sindarin.compiler@0.1.0:src/cli.ts"]); if (typeof module !== 'undefined') module.exports = c; }