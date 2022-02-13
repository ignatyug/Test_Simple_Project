const Launcher = require('./launcher');
const Logger = require('../logger');
const requester = process.argv[2] || process.env.REQUESTER_NAME;
const isSaveLogs = !!(+(process.argv.includes('--save-logs') || process.env.SAVE_LOGS));
const isShowBrowser = !!(+(process.argv.includes('--show-browser') || process.env.SHOW_BROWSER));
const logger = new Logger(requester, isSaveLogs);
const launcher = new Launcher(isShowBrowser, logger);

launcher.runAutotests();
