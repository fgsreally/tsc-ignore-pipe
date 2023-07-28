import { partition,debug} from "./utils.js";
import { minimatch } from "minimatch";
const tscErrorLineRegExp = /^(.*)\(\d+,\d+\): error (TS\d{4,}):.*$/;

export const parseTscErrors = (tscOutput) => {
  const tscErrors = [];
  const tscOutputLines = tscOutput.filter((line) => line.trim() !== "");
  let lastTscError;

  tscOutputLines.forEach((line) => {
    const errorLineMatch = line.match(tscErrorLineRegExp);

    if (!errorLineMatch) {
      if (lastTscError) {
        lastTscError.rawErrorLines.push(line);
      }
      return;
    }

    const tscError = {
      filePath: errorLineMatch[1],
      tscErrorCode: errorLineMatch[2],
      rawErrorLines: [line],
    };

    lastTscError = tscError;
    tscErrors.push(tscError);
  });

  return tscErrors;
};

export const partitionTscErrors = ({ tscErrors, globs }) => {
  const [ignoredTscErrors, unignoredTscErrors] = partition(
    tscErrors,
    (tscError) => {
      debug(`matching file...--${tscError.filePath}`)

      for (let glob of globs) {
        debug(`using glob...--${glob}`)

        if (minimatch(tscError.filePath, glob)) {
          debug('match!!')
          return true;
        }
      }
    }
  );

  return {
    ignoredTscErrors,
    unignoredTscErrors,
  };
};
