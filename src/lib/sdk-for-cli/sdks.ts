import Client from './client';
import { globalConfig, localConfig } from './config';

// const questionGetEndpoint = [
//   {
//     type: 'input',
//     name: 'endpoint',
//     message: 'Enter the endpoint of your Appwrite server',
//     default: 'http://localhost/v1',
//     async validate(value) {
//       if (!value) {
//         return 'Please enter a valid endpoint.';
//       }
//       const client = new Client().setEndpoint(value);
//       try {
//         const response = await client.call('get', '/health/version');
//         if (response.version) {
//           return true;
//         } else {
//           throw new Error();
//         }
//       } catch (error) {
//         return 'Invalid endpoint or your Appwrite server is not running as expected.';
//       }
//     },
//   },
// ];

export const sdkForConsole = async (requiresAuth = true): Promise<Client> => {
  const client = new Client();
  const project = globalConfig.getProject();
  const cookie = globalConfig.getCookie();
  const selfSigned = globalConfig.getSelfSigned();
  const endpoint = globalConfig.getEndpoint();
  //   if (!endpoint) {
  //     const answers = await inquirer.prompt(questionGetEndpoint);
  //     endpoint = answers.endpoint;
  //     globalConfig.setEndpoint(endpoint);
  //   }

  if (requiresAuth && cookie === '') {
    throw new Error('Session not found. Please run `appwrite login` to create a session');
  }

  client.setEndpoint(endpoint);
  client.setCookie(cookie);
  client.setProject(project);
  client.setSelfSigned(selfSigned);
  client.setLocale('en-US');

  return client;
};

export const sdkForProject = async (): Promise<Client> => {
  const client = new Client();
  const endpoint = globalConfig.getEndpoint();
  const project = localConfig.getProject().projectId ? localConfig.getProject().projectId : globalConfig.getProject();
  const key = globalConfig.getKey();
  const cookie = globalConfig.getCookie();
  const selfSigned = globalConfig.getSelfSigned();

  //   if (!endpoint) {
  //     const answers = await inquirer.prompt(questionGetEndpoint);
  //     endpoint = answers.endpoint;
  //     globalConfig.setEndpoint(endpoint);
  //   }

  if (!project) {
    throw new Error(
      // eslint-disable-next-line max-len
      'Project is not set. Please run `appwrite init project` to initialize the current directory with an Appwrite project.',
    );
  }

  client.setEndpoint(endpoint);
  client.setProject(project);
  client.setSelfSigned(selfSigned);
  client.setLocale('en-US');

  if (cookie) {
    client.setCookie(cookie);
    client.setMode('admin');

    return client;
  }

  if (key) {
    client.setKey(key);
    client.setMode('default');

    return client;
  }

  throw new Error('Session not found. Please run `appwrite login` to create a session.');
};
