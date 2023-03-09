const fastcsv = require('fast-csv');
const fs = require('fs');



const makeCsv = async (path, data) => {
    return new Promise((resolve, reject) => {
        const ws = fs.createWriteStream(path)

        fastcsv
            .write(data, { headers: true })
            .pipe(ws)
            .on("finish", function () {
                console.log(`Write to ${path} successfully!`);
                ws.close()
                resolve()
            })
            .on("error", () => { reject() })


    })
}


module.exports = {
    make: makeCsv
}