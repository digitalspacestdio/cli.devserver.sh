/* eslint-disable prefer-spread */
/* eslint-disable max-len */
import * as chalk from 'chalk';
import commander from 'commander';
import Table from 'cli-table3';
import { description } from '../../package.json';

const cliConfig = {
  verbose: false,
  json: false,
};

export const parse = (data: { [x: string]: any }) => {
  if (cliConfig.json) {
    drawJSON(data);
    return;
  }

  for (const key in data) {
    if (Array.isArray(data[key])) {
      console.log(`${chalk.yellow.bold.underline(key)}`);
      if (typeof data[key][0] === 'object') {
        drawTable(data[key]);
      } else {
        drawJSON(data[key]);
      }
    } else if (typeof data[key] === 'object') {
      if (data[key]?.constructor?.name === 'BigNumber') {
        console.log(`${chalk.yellow.bold(key)} : ${data[key]}`);
      } else {
        console.log(`${chalk.yellow.bold.underline(key)}`);
        drawTable([data[key]]);
      }
    } else {
      console.log(`${chalk.yellow.bold(key)} : ${data[key]}`);
    }
  }
};

export const drawTable = (data: any[]) => {
  if (data.length == 0) {
    console.log('[]');
    return;
  }

  // Create an object with all the keys in it
  const obj = data.reduce((res: any, item: any) => ({ ...res, ...item }));
  // Get those keys as an array
  const keys = Object.keys(obj);
  // Create an object with all keys set to the default value ''
  const def = keys.reduce((result, key) => {
    result[key] = '-';
    return result;
  }, {});
  // Use object destrucuring to replace all default values with the ones we have
  data = data.map((item: any) => ({ ...def, ...item }));

  const columns = Object.keys(data[0]);

  const table = new Table({
    head: columns.map((c) => chalk.cyan.italic.bold(c)),
    chars: {
      top: ' ',
      'top-mid': ' ',
      'top-left': ' ',
      'top-right': ' ',
      bottom: ' ',
      'bottom-mid': ' ',
      'bottom-left': ' ',
      'bottom-right': ' ',
      left: ' ',
      'left-mid': ' ',
      mid: chalk.cyan('─'),
      'mid-mid': chalk.cyan('┼'),
      right: ' ',
      'right-mid': ' ',
      middle: chalk.cyan('│'),
    },
  });

  data.forEach((row: { [x: string]: any }) => {
    const rowValues = [];
    for (const key in row) {
      if (row[key] === null) {
        rowValues.push('-');
      } else if (Array.isArray(row[key])) {
        switch (row[key].length) {
          case 1:
            if (typeof row[key][0] === 'object') {
              rowValues.push(`array(${row[key].length})`);
            } else {
              rowValues.push(row[key][0]);
            }
            break;
          default:
            rowValues.push(`array(${row[key].length})`);
            break;
        }
      } else if (typeof row[key] === 'object') {
        rowValues.push('object');
      } else {
        rowValues.push(row[key]);
      }
    }
    table.push(rowValues);
  });
  console.log(table.toString());
};

export const drawJSON = (data: any) => {
  console.log(JSON.stringify(data, null, 2));
};

export const parseError = (err: { message: any }) => {
  if (cliConfig.verbose) {
    console.error(err);
  }

  error(err.message);

  process.exit(1);
};

export const actionRunner = (fn: (arg0: any) => Promise<any>) => {
  return (...args: any) => fn.apply(null, args).catch(parseError);
};

export const parseInteger = (value: string) => {
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
};

export const parseBool = (value: string) => {
  if (value === 'true') return true;
  if (value === 'false') return false;
  throw new commander.InvalidArgumentError('Not a boolean.');
};

export const log = (message: any) => {
  console.log(`${chalk.cyan.bold('ℹ Info')} ${chalk.cyan(message ?? '')}`);
};

export const success = (message: any) => {
  console.log(`${chalk.green.bold('✓ Success')} ${chalk.green(message ?? '')}`);
};

export const error = (message: any) => {
  console.error(`${chalk.red.bold('✗ Error')} ${chalk.red(message ?? '')}`);
};

export const logo =
  "\n    _                            _ _           ___   __   _____ \n   /_\\  _ __  _ ____      ___ __(_) |_ ___    / __\\ / /   \\_   \\\n  //_\\\\| '_ \\| '_ \\ \\ /\\ / / '__| | __/ _ \\  / /   / /     / /\\/\n /  _  \\ |_) | |_) \\ V  V /| |  | | ||  __/ / /___/ /___/\\/ /_  \n \\_/ \\_/ .__/| .__/ \\_/\\_/ |_|  |_|\\__\\___| \\____/\\____/\\____/  \n       |_|   |_|                                                \n\n";

export const commandDescriptions = {
  account: `The account command allows you to authenticate and manage a user account.`,
  graphql: `The graphql command allows you to query and mutate any resource type on your Appwrite server.`,
  avatars: `The avatars command aims to help you complete everyday tasks related to your app image, icons, and avatars.`,
  databases: `The databases command allows you to create structured collections of documents, query and filter lists of documents.`,
  deploy: `The deploy command provides a convenient wrapper for deploying your functions and collections.`,
  functions: `The functions command allows you view, create and manage your Cloud Functions.`,
  health: `The health command allows you to both validate and monitor your Appwrite server's health.`,
  init: `The init command helps you initialize your Appwrite project, functions and collections`,
  locale: `The locale command allows you to customize your app based on your users' location.`,
  projects: `The projects command allows you to view, create and manage your Appwrite projects.`,
  storage: `The storage command allows you to manage your project files.`,
  teams: `The teams command allows you to group users of your project and to enable them to share read and write access to your project resources`,
  users: `The users command allows you to manage your project users.`,
  client: `The client command allows you to configure your CLI`,
  login: `The login command allows you to authenticate and manage a user account.`,
  logout: `The logout command allows you to logout of your Appwrite account.`,
  console: `The console command allows gives you access to the APIs used by the Appwrite console.`,
  assistant: `The assistant command allows you to interact with the Appwrite Assistant AI`,
  migrations: `The migrations command allows you to migrate data between services.`,
  project: `The project command is for overall project administration.`,
  proxy: `The proxy command allows you to configure behavior for your attached domains.`,
  vcs: `The vcs command allows you to interact with VCS providers and manage your code repositories.`,
  main: chalk.redBright(`${logo}${description}`),
};
