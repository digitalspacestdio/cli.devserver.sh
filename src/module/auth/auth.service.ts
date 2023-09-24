import { Injectable } from '@nestjs/common';
import { sdkForConsole, sdkForProject } from '../../lib/sdk-for-cli/sdks';
import { parse } from '../../lib/parser';
import { homedir } from 'os';
import * as fs from 'fs';

import Client from 'src/lib/sdk-for-cli/client';

interface JwtToken {
  jwt: string;
  expire_at: string;
}

@Injectable()
export class AuthService {
  private jwtTokenPath = homedir() + '/.devserver.sh/jwt.json';
  private jwtToken: JwtToken | undefined;

  async getJwtToken(): Promise<JwtToken> {
    if (undefined === this.jwtToken) {
      if (fs.existsSync(this.jwtTokenPath)) {
        try {
          const jwtTokenString = fs.readFileSync(this.jwtTokenPath).toString();
          const jwtToken = JSON.parse(jwtTokenString) as JwtToken;
          const expireAt = new Date(jwtToken.expire_at || 0);
          const now = new Date(Date.now());
          if (now.getTime() > expireAt.getTime()) {
            this.jwtToken = await this.accountCreateJWT();
          }
        } catch (e) {
          throw e;
        }
      }
    }

    return undefined !== this.jwtToken ? this.jwtToken : null;
  }

  async accountCreateJWT({
    parseOutput = false,
    sdk = null,
  }: {
    parseOutput?: boolean;
    sdk?: Client;
  } = {}): Promise<JwtToken> {
    const client = sdk ? sdk : await sdkForConsole(false);
    //const client = sdk ? sdk : await sdkForProject();
    const apiPath = '/account/jwt';
    const payload = {};
    let response = undefined;
    response = await client.call(
      'post',
      apiPath,
      {
        'content-type': 'application/json',
      },
      payload,
    );

    if (parseOutput) {
      parse(response);
    }

    const expireAt = new Date(Date.now() + 15 * 60).toISOString();
    const jwtToken = { ...response, ...{ expire_at: expireAt } } as JwtToken;

    fs.writeFileSync(this.jwtTokenPath, JSON.stringify(jwtToken));

    return jwtToken;
  }

  async accountCreateEmailSession({
    email,
    password,
    parseOutput = true,
    sdk = null,
  }: {
    email: string;
    password: string;
    parseOutput?: boolean;
    sdk?: Client;
  }): Promise<any> {
    const client = sdk ? sdk : await sdkForProject();
    const apiPath = '/account/sessions/email';
    const payload = {};

    /** Body Params */

    if (typeof email !== 'undefined') {
      payload['email'] = email;
    }

    if (typeof password !== 'undefined') {
      payload['password'] = password;
    }

    let response = undefined;
    response = await client.call(
      'post',
      apiPath,
      {
        'content-type': 'application/json',
      },
      payload,
    );

    if (parseOutput) {
      parse(response);
    }

    return response;
  }
}
