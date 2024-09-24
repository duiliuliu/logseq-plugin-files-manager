import { Logger } from 'tslog';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const isDebug = __DEBUG__;
console.log('DEBUG:', isDebug);
// Default severities are: 0: silly, 1: trace, 2: debug, 3: info, 4: warn, 5: error, 6: fatal
export const logger = new Logger({
    // minLevel: isDebug ? 0 : 3,
    minLevel: isDebug
});
