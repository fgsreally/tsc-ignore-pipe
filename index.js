import cac from "cac";
import chalk from "chalk";
import {getProgramInput} from './input.js'
import { partitionTscErrors, parseTscErrors } from "./tsc.js";
const cli = cac("tip");

cli
  .command("", "ignore error from specified files when using tsc")
  .option("--excludes, -e [e]", "[string] glob that ignore specified files ")
  .action((option) => {
    let { excludes=[] } = option;

    if(!Array.isArray(excludes)){
      excludes=[excludes]
    }
  
    getProgramInput()
      .then((input) => {
        const tscErrors = parseTscErrors(input);
        // console.log(tscErrors);
        const { ignoredTscErrors, unignoredTscErrors } = partitionTscErrors({
          tscErrors,
          globs: excludes,
        });
        if (ignoredTscErrors.length)
          console.log(
            `[tip] ${chalk.yellow(ignoredTscErrors.length)} errors have been ignored (excludes ${chalk.grey(excludes.join('  '))})`
          );

        if (unignoredTscErrors.length) {
          console.log(
            `[tip] ${chalk.red(unignoredTscErrors.length)} errors were not ignored`
          );
          unignoredTscErrors.forEach((error) =>
           console.log(error.rawErrorLines.join("\n"))
          );

          return { error: true };
        }
      })
      .then((result) => {
        if (result?.error) {
          process.exit(1);
        }else{
          console.log(chalk.green('[tip] tsc pass~'))
        }
      })
      .catch((error) => {
        console.error("Unknown error", error);
        process.exit(1);
      });
  });

cli.help();

cli.parse();
