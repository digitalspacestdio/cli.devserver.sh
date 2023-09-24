import { Command, CommandRunner, Option } from 'nest-commander';
import { VmService } from './vm.service';
import * as inquirer from 'inquirer';
import { questionsVmCreate, questionsVmDestroy } from './questions';
import apacheMd5 from '../../lib/apache-md5';
import { createHash } from 'crypto';
import * as colors from 'colors';
import loading from '../../lib/loading';
import { AppwriteException } from 'node-appwrite';
import * as Table from 'cli-table3';

interface VmListCommandOptions {}
interface VmCreateCommandOptions {}
interface VmUpdateCommandOptions {}
interface VmDestroyCommandOptions {}

@Command({ name: 'vm:list', description: 'List virtual machines' })
export class VmListCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmListCommandOptions): Promise<void> {
    const table = new Table({
      head: ['id', 'name', 'size', 'url'],
    });

    await loading(
      'Retreiving vm list...',
      async () => {
        const list = await this.vmService.getVmList();
        if (list.total) {
          list.documents.forEach((doc) =>
            table.push([doc.$id, doc['name'], doc['size'], `https://${doc['name']}.devserver.sh`]),
          );
        } else {
          table.push([{ content: colors.gray('No virtual machines found'), colSpan: 4 }]);
        }
      },
      true,
    );

    console.log(table.toString());
  }
}

@Command({ name: 'vm:create', description: 'Create new virtual machine' })
export class VmCreateCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmCreateCommandOptions): Promise<void> {
    const answers = await inquirer.prompt(questionsVmCreate);

    if (answers?.confirm) {
      try {
        let vm: any;
        await loading('Saving virtual machine parameters...', async () => {
          vm = await this.vmService.createVm({
            name: answers.name,
            size: answers.size,
            username: answers.username,
            // eslint-disable-next-line newline-per-chained-call
            password_hash: createHash('sha512').update(answers.password).digest('hex'),
            // eslint-disable-next-line newline-per-chained-call
            code_server_password_hash: createHash('sha256').update(answers.password).digest('hex'),
            public_ports: [],
            public_ports_auth_username: 'web',
            public_ports_auth_password_hash: apacheMd5('web'),
          });
        });
        console.log(`Virtual machine created, ID: ${vm.$id}`);
      } catch (err: any) {
        if (err instanceof AppwriteException) {
          console.error(`${err.code}: ${err.message}`);
          return process.exit(1);
        } else {
          throw err;
        }
      }

      await loading('Deploying virtual machine...', () => {
        return new Promise((resolve) => setTimeout(resolve, 3000));
      });
    }
  }
}

@Command({ name: 'vm:update', description: 'Create a virtual machine' })
export class VmUpdateCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmUpdateCommandOptions): Promise<void> {
    process.stdout.write(Buffer.from('vm updated'));
  }
}

@Command({ name: 'vm:destroy', description: 'Destroy a virtual machine' })
export class VmDestroyCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmDestroyCommandOptions): Promise<void> {
    const answers = await inquirer.prompt(questionsVmDestroy);

    if (answers?.confirm) {
      try {
        await loading('Initiating the destroy of the virtual machine...', async () => {
          await this.vmService.destroyVm({
            id: answers.id,
          });
        });
      } catch (err: any) {
        if (err instanceof AppwriteException) {
          console.error(`${err.code}: ${err.message}`);
          return process.exit(1);
        } else {
          throw err;
        }
      }
    }
  }
}
