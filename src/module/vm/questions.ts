import { uniqueNamesGenerator, adjectives, animals } from 'unique-names-generator';

export const questionsVmCreate = [
  {
    type: 'input',
    name: 'name',
    message: 'Machine name (3 - 32 symbols)',
    default: () => uniqueNamesGenerator({ dictionaries: [adjectives] }) + '-' + uniqueNamesGenerator({ dictionaries: [animals] }),
    validate(value: string | any[]) {
      if (value.length < 3) {
        return 'Minimum length: 3';
      }
      if (value.length > 32) {
        return 'Maximum length: 32';
      }

      return true;
    },
  },
  {
    type: 'rawlist',
    name: 'size',
    message: 'Machine size',
    choices: ['s', 'm', 'l', 'xl'],
    default: 's',
  },
  {
    type: 'input',
    name: 'username',
    message: 'Username  (1 - 32 symbols)',
    default: 'developer',
    validate(value: string | any[]) {
      if (value.length < 3) {
        return 'Minimum length: 3';
      }
      if (value.length > 32) {
        return 'Maximum length: 32';
      }

      return true;
    },
  },
  {
    type: 'password',
    name: 'password',
    message: 'Password (only the hash will be used)',
    mask: '*',
    validate(value: string) {
      if (!value) {
        return "Password can't be empty";
      }
      return true;
    },
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to continue creating the virtual machine?',
    default: false,
  },
];

export const questionsVmDestroy = [
  {
    type: 'input',
    name: 'id',
    message: 'Machine ID',
    validate(value: string | any[]) {
      if (!value.length) {
        return 'Please enter a value';
      }

      return true;
    },
  },
  {
    type: 'confirm',
    name: 'confirm',
    message: 'Do you want to continue?',
    decription: 'This action will delete all data associated with the virtual machine',
    color: 'red',
    default: false,
  },
];
