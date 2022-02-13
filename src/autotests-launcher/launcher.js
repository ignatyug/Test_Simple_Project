const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const { launcherStrings } = require('./consts');
const {
    getScriptRunningString,
    getScriptExecutedString,
    getScriptFailedString,
    logsDivider,
} = launcherStrings;

/** Class representing an autotests launcher */
class Launcher {
    _autotestsFolderPath = path.join(__dirname, 'clean-scripts');
    _autotestsFiles = fs.readdirSync(this._autotestsFolderPath);

    /**
     * Creates instance of Launcher class.
     * @param {boolean} isShowBrowser - describes if autotests will be run implicitly or explicitly.
     * @param {Logger} logger - logger.
     * @returns {Launcher}
     */
    constructor(isShowBrowser, logger) {
        this._isShowBrowser = !isShowBrowser;
        this._logger = logger;
    }

    /**
     * @private
     * Returns list of objects containing autotest's filename and function that launches it.
     * @returns {Promise<{name: string, run: VoidFunction}[]>}
     */
    async _getAutotests() {
        return this._autotestsFiles.map((autotestFileName) => {
            const autotestPath = path.join(this._autotestsFolderPath, autotestFileName);

            return { name: autotestFileName, run: require(autotestPath) };
        });
    }

    /**
     * Method that runs autotests.
     * @returns {Promise<void>}
     */
    async runAutotests() {
        const autotests = await this._getAutotests();
        const browser = await puppeteer.launch({ headless: !this._isShowBrowser });

        for await (const autotest of autotests) {
            const writeToLog = async (text, prefix) => {
                await this._logger.writeToLog(autotest.name, `${text}\n`, prefix);
            };
            const writeLastLog = async (text, prefix) => {
                const trailingSymbols = !this._logger.isSaveLogs ? `\n${logsDivider}` : '';
                await writeToLog(`${text}${trailingSymbols}`, prefix);
            };

            await writeToLog(getScriptRunningString(autotest.name));

            try {
                await autotest.run(browser, writeToLog);
                await writeLastLog(getScriptExecutedString(autotest.name));
            } catch (err) {
                await writeLastLog(getScriptFailedString(err), 'err');
            }
        }

        await browser.close();
    }
}

module.exports = Launcher;
