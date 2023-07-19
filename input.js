import { createInterface } from 'readline';

export const getProgramInput = () =>
  new Promise((resolve) => {
    const programInput = [];
    const rl = createInterface(process.stdin);

    rl.on('line', (line) => {
      programInput.push(line);
    });

    rl.once('close', () => {
      resolve(programInput);
    });
  });
