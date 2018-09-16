import { createReadStream } from 'fs';
import { Observable, Subscriber } from 'rxjs';
import { map, takeLast } from 'rxjs/operators';

export class CommitMsgValidator {
    static readonly config: any = require('./commit-msg.json');

    private pattern: RegExp = /^(\w+)(?:\(([^)]+)\))?\: (?:.+)$/;
    private revert: RegExp = /^revert:? /i;
    constructor(private fileName: string) { }

    validate(): Observable<boolean> {
        return this.observeHeader()
            .pipe(
                takeLast(1),
                map<string, boolean>((header) => {
                    console.info(header);
                    if (this.revert.test(header)) {
                        console.info('Revert commit accept.');
                        return true;
                    }
                    const config = CommitMsgValidator.config as Config;
                    if (header.length > config.maxLength) {
                        this.logError(header, `This commit message is longer then ${config.maxLength} .`);
                        return false;
                    }

                    const match = this.pattern.exec(header);
                    if (!match) {
                        this.logError(header, `The commit message does not match the pattern ${config.template}.`);
                        return false;
                    }

                    const type = match[1];
                    if (!config.types[type]) {
                        this.logError(header, `The type ${type} is not allowed -> TYPES:
                        ${Object.keys(config.types).filter((key) => config.types[key]).join(' , ')}`);
                        return false;
                    }

                    const scope = match[2];
                    if (!config.scopes[scope]) {
                        this.logError(header, `The scope ${scope} is not allowed -> SCOPES:
                        ${Object.keys(config.scopes).filter((key) => config.scopes[key]).join(' , ')}`);
                        return false;
                    }
                    return true;
                }));
    }

    private logError(header: string, errorMessage: string): void {
        console.error(` *INVALID COMMIT MSG: ${header}\n`, `*ERROR: ${errorMessage}`);
    }

    private observeHeader(): Observable<string> {
        return Observable.create((subscriber: Subscriber<string>) => {
            const commitFile = createReadStream(this.fileName, { encoding: 'utf-8' });
            commitFile.once('error', (err) => err && subscriber.error(err.message));
            commitFile.once('end', () => subscriber.complete());
            commitFile.on('readable', () => {
                const header: string[] = [];
                let data: string = null;
                let foundHeader = false;
                while (!foundHeader && (data = commitFile.read())) {
                    const idxBreakLine = data.indexOf('\n');
                    if (idxBreakLine > -1) {
                        foundHeader = true;
                        header.push(data.substring(0, idxBreakLine));
                        subscriber.next(header.join(''));
                        commitFile.emit('end');
                        break;
                    } else {
                        header.push(data);
                    }
                }
            });
            return () => commitFile.destroy();
        });
    }
}

interface Config {
    maxLength: number;
    types: { [key: string]: boolean };
    scopes: { [key: string]: boolean };
    template: string;
}
