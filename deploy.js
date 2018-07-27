const fs = require('fs');
const path = require('path');


const TEST = "\\\\172.18.47.98\\NorwebPortalTest";
const tf = "\\\\172.18.47.98\\reporting\\paint\\index.html";
const target = path.join(TEST, "reporting", "paint");
const RemoveOld = () => {
    const index_path = path.join(TEST, "reporting", "paint", 'index.html');
    if (!fs.existsSync(index_path)) return;

    let text = fs.readFileSync(index_path, 'utf8');

    let reg = new RegExp('((?:css|js))\/main.([^.]+).', 'ig');
    let match = reg.exec(text);
    while (match) {
        let file = path.join(TEST, 'static', match[1], `main.${match[2]}.${match[1]}`);
        if (fs.existsSync(file)) {
            fs.unlinkSync(file);
            debugger
        } else {
            debugger;
        }
        match = reg.exec(text);
    }
    fs.unlinkSync(index_path);
}

const done = (err) => {
    if (err) {
        console.error(err);
    }
}
const copy = (f, root) => {
    const item = path.join(__dirname, 'build', f);
    const stat = fs.statSync(root);
    if (stat.isDirectory()) {
        copyDir(f);
    } else {
        copyFile(f);
    }
}
const copyDir = (item) => {
    const dir = path.join(__dirname, 'build', item);
    let items = fs.readdirSync(dir);
    for (let i of items) {
        copy(i, path.join(dir, i));
    }
    debugger;
}
const copyFile = (item) => {
    let readStream = fs.createReadStream(path.join(__dirname, 'build', item));
    readStream.on('error', done);


    const writeStream = fs.createWriteStream(path.join(TEST, item));
    writeStream.on('error', done)
        .on('close', done);

    readStream.pipe(writeStream);
}
const CopyNew = () => {

    const build = path.join(__dirname, 'build');

    const items = fs.readdirSync(build);

    for (let item of items) {

        copy(item, path.join(build, item));

    }

}

RemoveOld();

CopyNew();
// First Find the version of html and css from the index file