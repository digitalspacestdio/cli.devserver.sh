import { type, version, arch } from 'os';
import https from 'https';
import axios, { ResponseType } from 'axios';
import * as JSONbigint from 'json-bigint';
import FormData from 'form-data';
import AppwriteException from './exception';
import { globalConfig } from './config';
const JSONbig = JSONbigint({ storeAsString: false });

class Client {
  static CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
  endpoint: string;
  headers: {
    'content-type': string;
    'x-sdk-name': string;
    'x-sdk-platform': string;
    'x-sdk-language': string;
    'x-sdk-version': string;
    'user-agent': string;
    'X-Appwrite-Response-Format': string;
  };
  selfSigned: boolean;

  constructor() {
    this.endpoint = 'https://HOSTNAME/v1';
    this.headers = {
      'content-type': '',
      'x-sdk-name': 'Command Line',
      'x-sdk-platform': 'console',
      'x-sdk-language': 'cli',
      'x-sdk-version': '4.1.0',
      'user-agent': `AppwriteCLI/4.1.0 (${type()} ${version()}; ${arch()})`,
      'X-Appwrite-Response-Format': '1.4.0',
    };
  }

  /**
   * Set Cookie
   *
   * Your cookie
   *
   * @param {string} cookie
   *
   * @return self
   */
  setCookie(cookie: string) {
    this.addHeader('cookie', cookie);

    return this;
  }

  /**
   * Set Project
   *
   * Your project ID
   *
   * @param {string} project
   *
   * @return self
   */
  setProject(project: string) {
    this.addHeader('X-Appwrite-Project', project);

    return this;
  }

  /**
   * Set Key
   *
   * Your secret API key
   *
   * @param {string} key
   *
   * @return self
   */
  setKey(key: string) {
    this.addHeader('X-Appwrite-Key', key);

    return this;
  }

  /**
   * Set JWT
   *
   * Your secret JSON Web Token
   *
   * @param {string} jwt
   *
   * @return self
   */
  setJWT(jwt: string) {
    this.addHeader('X-Appwrite-JWT', jwt);

    return this;
  }

  /**
   * Set Locale
   *
   * @param {string} locale
   *
   * @return self
   */
  setLocale(locale: string) {
    this.addHeader('X-Appwrite-Locale', locale);

    return this;
  }

  /**
   * Set Mode
   *
   * @param {string} mode
   *
   * @return self
   */
  setMode(mode: string) {
    this.addHeader('X-Appwrite-Mode', mode);

    return this;
  }

  /**
   * Set self signed.
   *
   * @param {bool} status
   *
   * @return this
   */
  setSelfSigned(status: boolean) {
    this.selfSigned = status;

    return this;
  }

  /**
   * Set endpoint.
   *
   * @param {string} endpoint
   *
   * @return this
   */
  setEndpoint(endpoint: string) {
    this.endpoint = endpoint;

    return this;
  }

  /**
   * @param {string} key
   * @param {string} value
   */
  addHeader(key: string, value: string) {
    this.headers[key.toLowerCase()] = value;

    return this;
  }

  async call(method: string, path = '', headers = {}, params: any = {}, responseType: ResponseType = 'json') {
    headers = Object.assign({}, this.headers, headers);

    const contentType = headers['content-type'].toLowerCase();

    let formData = null;

    if (contentType.startsWith('multipart/form-data')) {
      const form = new FormData();

      const flatParams = Client.flatten(params);

      for (const key in flatParams) {
        form.append(key, flatParams[key]);
      }

      headers = {
        ...headers,
        ...form.getHeaders(),
      };

      formData = form;
    }

    const options = {
      httpsAgent: true == this.selfSigned ? new https.Agent({ rejectUnauthorized: false }) : null,
      method: method.toUpperCase(),
      url: this.endpoint + path,
      params: method.toUpperCase() === 'GET' ? params : {},
      headers: headers,
      data: method.toUpperCase() === 'GET' || contentType.startsWith('multipart/form-data') ? formData : params,
      json: contentType.startsWith('application/json'),
      transformRequest:
        method.toUpperCase() === 'GET' || contentType.startsWith('multipart/form-data')
          ? undefined
          : (data: any) => JSONbig.stringify(data),
      transformResponse: [(data: any) => (data ? JSONbig.parse(data) : data)],
      responseType: responseType,
    };
    try {
      const response = await axios(options);
      if (response.headers['set-cookie']) {
        globalConfig.setCookie(response.headers['set-cookie'][0]);
      }
      return response.data;
    } catch (error) {
      if ('response' in error && error.response !== undefined) {
        if (error.response && 'data' in error.response) {
          if (typeof error.response.data === 'string') {
            throw new AppwriteException(error.response.data, error.response.status, error.response.data);
          } else {
            throw new AppwriteException(error.response.data.message, error.response.status, error.response.data);
          }
        } else {
          throw new AppwriteException(error.response.statusText, error.response.status, error.response.data);
        }
      } else {
        throw new AppwriteException(error.message);
      }
    }
  }

  static flatten(data: any[], prefix = '') {
    let output = {};

    for (const key in data) {
      const value = data[key];
      const finalKey = prefix ? prefix + '[' + key + ']' : key;

      if (Array.isArray(value)) {
        output = Object.assign(output, Client.flatten(value, finalKey)); // @todo: handle name collision here if needed
      } else {
        output[finalKey] = value;
      }
    }

    return output;
  }
}

export default Client;
