const chalk = require('chalk');

const CONSOLE_METHODS = ['log', 'info', 'debug', 'warn', 'error'];

const CLIENT_PREFIX = '[CLIENT (VITE)]: ';
const SERVER_PREFIX = '[SERVER (EXPRESS)]: ';

const NODE_METHODS = {};

const strStartsWithLineBreak = (str) => {
  return typeof str === 'string' && str.charAt(0) === '\n';
};

const sliceFirstChar = (str) => {
  return str.slice(1, str.length);
};

/**
 * This should be replaced with our logger class (in a cash+ future lol)
 * @param {'client' | 'server'} [env] - assumes 'server' if nullish
 */
function patchLogger(env = 'sever') {
  const isClient = env === 'client';
  const basePrefix = isClient ? CLIENT_PREFIX : SERVER_PREFIX;
  const prefixColor = isClient ? 'cyan' : 'magenta';

  CONSOLE_METHODS.forEach((method) => {
    // stash the originals
    NODE_METHODS[method] = console[method];
    // overwrite with ours
    console[method] = (...args) => {
      let prefixToUse = basePrefix;

      // we want to move the line break to the start of the line...
      if (strStartsWithLineBreak(args[0])) {
        prefixToUse = `\n${CLIENT_PREFIX}`;
        args[0] = sliceFirstChar(args[0]);
      }

      NODE_METHODS[method](chalk[prefixColor](prefixToUse), ...args);
    };
  });
}

module.exports = { patchLogger };
