import { stripIndent } from 'common-tags';

export default function print(original, result) {
  const text = `
############### original ###############
${original}
########################################
${result}
############### result #################
`;

  process.stdout.write(text);
}
