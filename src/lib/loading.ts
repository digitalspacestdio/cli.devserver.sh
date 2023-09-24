import ora from 'ora';

type LoadingCallback = () => Promise<any>;

const spinner = ora();

export default async (message: string, callback: LoadingCallback, clear = false) => {
  spinner.start(message);
  try {
    const res = await callback();
    spinner.succeed();
    if (clear) {
      spinner.clear();
    }

    return res;
  } catch (err) {
    spinner.fail();
    throw err;
  }
};
