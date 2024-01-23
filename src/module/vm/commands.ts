import { Command, CommandRunner, Option } from 'nest-commander';
import { VmService } from './vm.service';
import * as inquirer from 'inquirer';
import { questionsVmCreate, questionsVmDestroy } from './questions';
import apacheMd5 from '../../lib/apache-md5';
import { createHash } from 'crypto';
import * as colors from 'colors';
import loading from '../../lib/loading';
import { AppwriteException, Databases } from 'node-appwrite';
import * as Table from 'cli-table3';
import { AppwriteUnauthorizedException } from '../appwrite/appwrite.service';

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
      head: ['id', 'name', 'size', 'url', 'status'],
    });

    try {
      await loading(
        'Retreiving vm list...',
        async () => {
          const list = await this.vmService.getVmList();
          if (list.total) {
            list.documents.forEach((doc) =>
              table.push([doc.$id, doc['name'], doc['size'], `https://${doc['name']}.devserver.sh`, doc['status']]),
            );
          } else {
            table.push([{ content: colors.gray('No virtual machines found'), colSpan: 5 }]);
          }
        },
        true,
      );

      console.log(table.toString());
    } catch (err: any) {
      if (err instanceof AppwriteException || err instanceof AppwriteUnauthorizedException) {
        console.error(`${err.code}: ${err.message}`);
        return process.exit(1);
      } else {
        console.error(err);
        return process.exit(1);
      }
    }
  }
}

@Command({ name: 'vm:create', description: 'Create new virtual machine' })
export class VmCreateCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmCreateCommandOptions): Promise<void> {
    let vm: any;
    const answers = await inquirer.prompt(questionsVmCreate);
    if (answers?.confirm) {
      try {
        await loading('Saving virtual machine settings...', async () => { 
          vm = await this.vmService.createVm({
            name: answers.name,
            size: answers.size,
            username: answers.username,
            // eslint-disable-next-line newline-per-chained-call
            password_hash: createHash('sha512').update(answers.password).digest('hex'),
            // eslint-disable-next-line newline-per-chained-call
            code_server_password_hash: createHash('sha256').update(answers.password).digest('hex'),
            public_port: answers.public_port.split(",").filter((port) => parseInt(port) > 0),
            public_port_username: answers.public_port_username,
            public_port_password_hash: answers?.public_port_password ? apacheMd5(answers.public_port_password) : '',
          });
        });
        console.log(`Virtual machine created, ID: ${vm.$id}`);
      } catch (err: any) {
        if (err instanceof AppwriteException || err instanceof AppwriteUnauthorizedException) {
          console.error(`${err.code}: ${err.message}`);
          return process.exit(1);
        } 

        console.error(err);

        return process.exit(1);
      }

      const vmId = vm.$id;
      await loading('Deploying virtual machine...', async () => {
        return new Promise((resolve) => {
          let interval = setInterval(() => {
            this.vmService.getVm(vmId).then((doc) => {
              if (["running"].includes(doc['status'])) {
                clearInterval(interval);
                resolve(true);
              }
              if (["deploy-failed"].includes(doc['status'])) {
                clearInterval(interval);
                resolve(false);
              }
            })
          }, 1000)
        });
      });

      vm = await this.vmService.getVm(vmId);
      if (vm['status'] == "deploy-failed") {
        console.error(`Deploy failed! Please contact support.`);
      }

      if (vm['status'] == "running") {
        console.error(`Deploy finished! Please follow this link: https://${vm['name']}.devserver.sh`);
      }
    }
  }
}

@Command({ name: 'vm:update', description: 'Create a virtual machine' })
export class VmUpdateCommand extends CommandRunner {
  constructor(private vmService: VmService) {
    super();
  }
  async run(passedParam: string[], options?: VmUpdateCommandOptions): Promise<void> {
    try {
      process.stdout.write(Buffer.from('vm updated'));
    } catch (err: any) {
      if (err instanceof AppwriteException || err instanceof AppwriteUnauthorizedException) {
        console.error(`${err.code}: ${err.message}`);
        return process.exit(1);
      } else {
        console.error(err);
        return process.exit(1);
      }
    }
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
            ids: [answers.id],
          });
        });
      } catch (err: any) {
        if (err instanceof AppwriteException || err instanceof AppwriteUnauthorizedException) {
          console.error(`${err.code}: ${err.message}`);
          return process.exit(1);
        } else {
          console.error(err);
          return process.exit(1);
        }
      }
    }
  }
}
