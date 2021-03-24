var fs = require("fs"),
    { parse } = require("node-html-parser"),
    path = require('path'),
    TurndownService = require('turndown');

var turndownService = new TurndownService();


function readFiles(dirName, onFileContent, onError) {
    fs.readdir(dirName, (err, filesNames) => {

        if (err) {
            onError(err);
            return;
        }

        var targetFiles = filesNames.filter(function (file) {
            return path.extname(file).toLowerCase() === '.html';
        });

        targetFiles.forEach(fileName => {
            fs.readFile(`${dirName}//${fileName}`, 'utf-8', (err, content) => {
                if (err) {
                    onError(fileName, err);
                    return;
                }

                onFileContent(fileName, content);

            });
        });

    })
}

const markdownFolder = 'markdowns';

readFiles('/Users/gis/Downloads/FFMPEG', (fileName, content) => {

    console.log(`Processing ${fileName}`);
    // console.log(content);

    const root = parse(content);
    var mainContentDiv = root.querySelector('#main-content');

    // console.log(mainContentDiv.innerHTML);

    //Create markdown folder if it doesn't exist
    if (!fs.existsSync(markdownFolder)) {
        fs.mkdirSync(markdownFolder);
    }

    //Create HTML files with the main-content div only
    fs.writeFile(`${markdownFolder}/${fileName}`, mainContentDiv.innerHTML, function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`${fileName} saved on ${markdownFolder}`);
    });

    console.log(turndownService.turndown(mainContentDiv.innerHTML));

    fs.writeFile(`${markdownFolder}/${fileName.replace(path.extname(fileName), '.md')}`, turndownService.turndown(mainContentDiv.innerHTML), function (err) {
        if (err) {
            return console.log(err);
        }
        console.log(`${fileName} saved on ${markdownFolder}`);
    });



}, (fileName, err) => {
    console.error(`[ERROR] on file ${fileName}`);
    throw err;
});