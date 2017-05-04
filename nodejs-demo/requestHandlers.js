/**
 * Created by sky on 2017/5/3.
 */

// const {exec} = require('child_process');
const path = require('path');
const fs = require('fs');
const formidable = require('formidable');

function start(request, response) {
    console.log('Request handler "start" was called.');

    // exec('find /', {timout: 10000, maxBuffer: 20000 * 1024},
    //     function (err, stdout, stderr) {
    //         response.writeHead(200, {'Content-Type': 'text/plain'});
    //         response.write(stdout);
    //         response.end();
    //     });

    let body = '<html>' +
        '<head>' +
        '<meta charset="utf-8">' +
        '</head>' +
        '<body>' +
        '<form action="/upload" method="post" enctype="multipart/form-data">' +
        '<input type="file" name="upload" multiple="multiple">' +
        '<input type="submit" value="上传">' +
        '</form>' +
        '</body>' +
        '</html>';

    response.writeHead(200, {'Content-Type': 'text/html'});
    response.write(body);
    response.end();
}

function upload(request, response) {
    console.log('Rquest handler "upload" was called.');

    let form = new formidable.IncomingForm();
    console.log('about to parse...');
    form.parse(request, function (err, fields, files) {
        console.log('parse done.');
        let pathname = path.resolve(__dirname, './tmp/test.png');
        fs.renameSync(files.upload.path, pathname);
        response.writeHead(200, {'Content-Type': 'text/html'});
        response.write('received image: <br>');
        response.write('<img src="/show">');
        response.end();
    });
}

function show(request, response) {
    console.log('Request handler "show" was called.');

    let pathname = path.resolve(__dirname, './tmp/test.png');
    fs.readFile(pathname, 'binary', (err, file) => {
        if (err) {
            response.writeHead(500, {'Content-Type': 'text/plain'});
            response.write(err + '\n');
            response.end();
        } else {
            response.writeHead(200, {'Content-Type': 'image/png'});
            response.write(file, 'binary');
            response.end();
        }
    });
}

exports.start = start;
exports.upload = upload;
exports.show = show;
