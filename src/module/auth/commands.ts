import { Command, CommandRunner, Option } from 'nest-commander';
import { input, password } from '@inquirer/prompts';
import { AuthService } from './auth.service';
import { sdkForConsole } from '../../lib/sdk-for-cli/sdks';
import loading from '../../lib/loading';
// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface LoginCommandOptions {}

@Command({ name: 'auth:login', description: 'User Authentification (Login / Password)' })
export class LoginCommand extends CommandRunner {
  constructor(private authService: AuthService) {
    super();
  }

  async run(passedParam: string[], options?: LoginCommandOptions): Promise<void> {
    const sdk = await sdkForConsole(false);
    const userEmail = await input({
      message: 'Please enter your login (email address)',
      validate: function (value: string) {
        if (value.match(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/)) {
          return true;
        }

        return 'Please enter a valid email address';
      },
    });
    const userPassword = await password({ message: 'Please enter your password', mask: '*' });

    try {
      await loading(
        'Logging in...',
        async () => {
          await this.authService.accountCreateEmailSession({
            email: userEmail,
            password: userPassword,
            parseOutput: false,
            sdk: sdk,
          });
          await this.authService.accountCreateJWT({ sdk: sdk });
        },
        true,
      );
    } catch (err) {
      console.error('Error (' + err?.code + '): ' + err?.response?.message);
    }
  }
}
