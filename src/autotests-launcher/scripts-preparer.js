const fs = require('fs');
const path = require('path');
const { createFolderIfNotExists } = require('../utils/fs-utils');
const { preparerStrings } = require('./consts');
const { autotestsCodeReplacers } = preparerStrings;
const rawScriptsFolderPath = path.join(__dirname, 'raw-scripts');
const cleanScriptsFolderPath = path.join(__dirname, 'clean-scripts');

createFolderIfNotExists(rawScriptsFolderPath);
createFolderIfNotExists(cleanScriptsFolderPath);

const rawAutotestsFiles = fs.readdirSync(rawScriptsFolderPath);

rawAutotestsFiles.forEach((fileName) => {
    const rawScriptPath = path.join(rawScriptsFolderPath, fileName);
    const cleanScriptPath = path.join(cleanScriptsFolderPath, fileName);
    let fileData = fs.readFileSync(rawScriptPath).toString();

    autotestsCodeReplacers.forEach((replacer) => fileData = fileData.replace(replacer.toReplace, replacer.replaceWith));

    if (!fs.existsSync(cleanScriptPath)) {
        fs.writeFileSync(cleanScriptPath, fileData.trim(), { encoding: 'utf-8' });
    }
});
