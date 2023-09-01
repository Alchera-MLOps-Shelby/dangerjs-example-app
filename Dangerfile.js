// import
import {danger, fail, warn} from 'danger';

// settings and variables
const PR_DESCRIPTION = danger.github.pr.body;
const MODIFIED_FILES = danger.git.modified_files;
const MAX_DIFF_SIZE = 500;
const DIFF_SIZE = danger.github.pr.additions + danger.github.pr.deletions;

// 1. Fail when PR description text is missing

if (!PR_DESCRIPTION || PR_DESCRIPTION.trim() === '') {
  fail('Please provide a meaningful description for this pull request.');
}

// 2. Fail when PR code diff size exceeds 500 lines

if (DIFF_SIZE > MAX_DIFF_SIZE) {
  fail(`This pull request is too large (${DIFF_SIZE} changes). Please consider breaking it down.`);
}

// 3. Warn when PR code has any debugging statements

for (const file of MODIFIED_FILES) {
  const fileContent = await danger.github.utils.fileContents(file);
  if (fileContent.includes('console.log')) {
    warn('Debugging statement found. Please remove console.log before merging.');
  }
}

// 4. Warn when PR code has any TODO comments

for (const file of MODIFIED_FILES) {
  const fileContent = await danger.github.utils.fileContents(file);
  if (fileContent.includes('TODO')) {
    warn('There are remaining TODO comments in the code. Please address them before merging.');
  }
}

// 5. Warn when PR code has any commented-out code

for (const file of MODIFIED_FILES) {
  const fileContent = await danger.github.utils.fileContents(file);
  if (fileContent.match(/\/\/.*\bFIXME\b/)) {
    warn('Commented-out code found (FIXME). Please remove before merging.');
  }
}
