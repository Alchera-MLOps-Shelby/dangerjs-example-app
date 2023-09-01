import { danger, fail } from 'danger';

const prDescription = danger.github.pr.body;

if (!prDescription || prDescription.trim() === '') {
  fail('Please provide a meaningful description for this pull request.');
}
