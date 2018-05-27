import { CommitMsgValidator } from './validate-commit-msg';

const validator = new CommitMsgValidator(process.env['GIT_PARAMS']);

validator.validate().subscribe((result) => process.exit(result === true ? 0 : 1));
