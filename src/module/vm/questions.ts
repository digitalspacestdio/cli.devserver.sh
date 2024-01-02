import { ID } from 'node-appwrite';
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
    message: 'System Username (1 - 32 symbols)',
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
    message: 'System Password (will be hashed)',
    mask: '*',
    validate(value: string) {
      if (!value) {
        return "Password can't be empty";
      }
      if (value.length < 8) {
        return 'Minimum length: 8';
      }
      return true;
    },
  },
  {
    type: 'input',
    name: 'public_port',
    message: 'Public Port(s) (3rd party access)',
    default: 'none',
    validate(value: string) {
      if (value) {
        const ports = value.split(",");
        for (var i = 0; i < ports.length; i++) {
          if (parseInt(ports[i]) < 1025) {
            return 'Minimum port is: 1025';
          }
          if (parseInt(ports[i]) > 65535) {
            return 'Maximum port is: 65535';
          }
        }
      }

      return true;
    },
  },
  {
    type: 'input',
    name: 'public_port_username',
    message: 'Public Username (1 - 32 symbols)',
    default: 'web',
    when: (current: { public_port: any; }) => {
      return !!current.public_port && current.public_port != 'none';
    },
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
    type: 'public_port_password',
    name: 'public_port_password',
    message: 'Public Password (will be hashed)',
    mask: '*',
    when: (current: { public_port: any; }) => {
      return !!current.public_port && current.public_port != 'none';
    },
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
