import { homedir } from 'os';
import * as fs from 'fs';
import * as _path from 'path';
import * as JSONbig from 'json-bigint';

class Config {
  path: any;
  data: any;
  constructor(path: any) {
    this.path = path;
    this.read();
  }

  read() {
    try {
      const file = fs.readFileSync(this.path).toString();
      this.data = JSONbig({ storeAsString: false }).parse(file);
    } catch (e) {
      this.data = {};
    }
  }

  write() {
    const dir = _path.dirname(this.path);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(this.path, JSONbig({ storeAsString: false }).stringify(this.data, null, 4), { mode: 0o600 });
  }

  get(key: string) {
    return this.data[key];
  }

  set(key: string, value: any[]) {
    this.data[key] = value;
    this.write();
  }

  delete(key: string | number) {
    delete this.data[key];
    this.write();
  }

  clear() {
    this.data = {};
    this.write();
  }

  has(key: string) {
    return this.data[key] !== undefined;
  }

  keys() {
    return Object.keys(this.data);
  }

  values() {
    return Object.values(this.data);
  }

  toString() {
    return JSONbig({ storeAsString: false }).stringify(this.data, null, 4);
  }
}

class Local extends Config {
  static CONFIG_FILE_PATH = '.devserver.sh/local.json';

  constructor(path = Local.CONFIG_FILE_PATH) {
    const homeDir = homedir();
    super(`${homeDir}/${path}`);
  }

  getFunctions() {
    if (!this.has('functions')) {
      return [];
    }
    return this.get('functions');
  }

  getFunction($id: any) {
    if (!this.has('functions')) {
      return {};
    }

    const functions = this.get('functions');
    for (let i = 0; i < functions.length; i++) {
      if (functions[i]['$id'] == $id) {
        return functions[i];
      }
    }

    return {};
  }

  addFunction(props: { [x: string]: any }) {
    if (!this.has('functions')) {
      this.set('functions', []);
    }

    const functions = this.get('functions');
    for (let i = 0; i < functions.length; i++) {
      if (functions[i]['$id'] == props['$id']) {
        return;
      }
    }
    functions.push(props);
    this.set('functions', functions);
  }

  updateFunction(id: any, props: any) {
    if (!this.has('functions')) {
      return;
    }

    const functions = this.get('functions');
    for (let i = 0; i < functions.length; i++) {
      if (functions[i]['$id'] == id) {
        functions[i] = {
          ...functions[i],
          ...props,
        };
        this.set('functions', functions);
        return;
      }
    }
  }

  getCollections() {
    if (!this.has('collections')) {
      return [];
    }
    return this.get('collections');
  }

  getCollection($id: any) {
    if (!this.has('collections')) {
      return {};
    }

    const collections = this.get('collections');
    for (let i = 0; i < collections.length; i++) {
      if (collections[i]['$id'] == $id) {
        return collections[i];
      }
    }

    return {};
  }

  addCollection(props: { [x: string]: any }) {
    if (!this.has('collections')) {
      this.set('collections', []);
    }

    const collections = this.get('collections');
    for (let i = 0; i < collections.length; i++) {
      if (collections[i]['$id'] == props['$id'] && collections[i]['databaseId'] == props['databaseId']) {
        collections[i] = props;
        this.set('collections', collections);
        return;
      }
    }
    collections.push(props);
    this.set('collections', collections);
  }

  getBuckets() {
    if (!this.has('buckets')) {
      return [];
    }
    return this.get('buckets');
  }

  getBucket($id: any) {
    if (!this.has('buckets')) {
      return {};
    }

    const buckets = this.get('buckets');
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i]['$id'] == $id) {
        return buckets[i];
      }
    }

    return {};
  }

  addBucket(props: { [x: string]: any }) {
    if (!this.has('buckets')) {
      this.set('buckets', []);
    }

    const buckets = this.get('buckets');
    for (let i = 0; i < buckets.length; i++) {
      if (buckets[i]['$id'] == props['$id']) {
        buckets[i] = props;
        this.set('buckets', buckets);
        return;
      }
    }
    buckets.push(props);
    this.set('buckets', buckets);
  }

  getDatabases() {
    if (!this.has('databases')) {
      return [];
    }
    return this.get('databases');
  }

  getDatabase($id: any) {
    if (!this.has('databases')) {
      return {};
    }

    const databases = this.get('databases');
    for (let i = 0; i < databases.length; i++) {
      if (databases[i]['$id'] == $id) {
        return databases[i];
      }
    }

    return {};
  }

  addDatabase(props: { [x: string]: any }) {
    if (!this.has('databases')) {
      this.set('databases', []);
    }

    const databases = this.get('databases');
    for (let i = 0; i < databases.length; i++) {
      if (databases[i]['$id'] == props['$id']) {
        databases[i] = props;
        this.set('databases', databases);
        return;
      }
    }
    databases.push(props);
    this.set('databases', databases);
  }

  getTeams() {
    if (!this.has('teams')) {
      return [];
    }
    return this.get('teams');
  }

  getTeam($id: any) {
    if (!this.has('teams')) {
      return {};
    }

    const teams = this.get('teams');
    for (let i = 0; i < teams.length; i++) {
      if (teams[i]['$id'] == $id) {
        return teams[i];
      }
    }

    return {};
  }

  addTeam(props: { [x: string]: any }) {
    if (!this.has('teams')) {
      this.set('teams', []);
    }

    const teams = this.get('teams');
    for (let i = 0; i < teams.length; i++) {
      if (teams[i]['$id'] == props['$id']) {
        teams[i] = props;
        this.set('teams', teams);
        return;
      }
    }
    teams.push(props);
    this.set('teams', teams);
  }

  getProject() {
    if (!this.has('projectId') || !this.has('projectName')) {
      return {};
    }

    return {
      projectId: this.get('projectId'),
      projectName: this.get('projectName'),
    };
  }

  setProject(projectId: any, projectName: any) {
    this.set('projectId', projectId);
    this.set('projectName', projectName);
  }
}

class Global extends Config {
  static CONFIG_FILE_PATH = '.devserver.sh/global.json';

  static PREFERENCE_ENDPOINT = 'endpoint';
  static PREFERENCE_SELF_SIGNED = 'selfSigned';
  static PREFERENCE_COOKIE = 'cookie';
  static PREFERENCE_PROJECT = 'project';
  static PREFERENCE_KEY = 'key';
  static PREFERENCE_LOCALE = 'locale';
  static PREFERENCE_MODE = 'mode';

  static MODE_ADMIN = 'admin';
  static MODE_DEFAULT = 'default';

  static PROJECT_CONSOLE = 'console';

  constructor(path = Global.CONFIG_FILE_PATH) {
    const homeDir = homedir();
    super(`${homeDir}/${path}`);
  }

  getEndpoint() {
    if (!this.has(Global.PREFERENCE_ENDPOINT)) {
      return 'https://appwrite.devserver.sh/v1';
    }
    return this.get(Global.PREFERENCE_ENDPOINT);
  }

  setEndpoint(endpoint: any) {
    this.set(Global.PREFERENCE_ENDPOINT, endpoint);
  }

  getSelfSigned() {
    if (!this.has(Global.PREFERENCE_SELF_SIGNED)) {
      return false;
    }
    return this.get(Global.PREFERENCE_SELF_SIGNED);
  }

  setSelfSigned(selfSigned: any) {
    this.set(Global.PREFERENCE_SELF_SIGNED, selfSigned);
  }

  getCookie() {
    if (!this.has(Global.PREFERENCE_COOKIE)) {
      return '';
    }
    return this.get(Global.PREFERENCE_COOKIE);
  }

  setCookie(cookie: any) {
    this.set(Global.PREFERENCE_COOKIE, cookie);
  }

  getProject() {
    if (!this.has(Global.PREFERENCE_PROJECT)) {
      return 'devserversh';
    }
    return this.get(Global.PREFERENCE_PROJECT);
  }

  setProject(project: any) {
    this.set(Global.PREFERENCE_PROJECT, project);
  }

  getKey() {
    if (!this.has(Global.PREFERENCE_KEY)) {
      return '';
    }
    return this.get(Global.PREFERENCE_KEY);
  }

  setKey(key: any) {
    this.set(Global.PREFERENCE_KEY, key);
  }
}

const globalConfig = new Global();
const localConfig = new Local();

export { globalConfig, localConfig };
