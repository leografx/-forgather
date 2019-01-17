const fs = require('fs');
const pdf = require('pdfjs');

const path = 'forgather';

fs.readdir(path, function(err, items) {
    for (var i = 0; i < items.length; i++) {
        let file = items[i].split('_');
        let job_number = file[0];
        let item_number = file[1];
        let quantity = file[2];
        let file_name = items[i];
        let shipping = file[3];

        if (file_name[0] != '.') {
            fs.mkdir(item_number, { recursive: true }, errorCreatingFolder);
            mergePdf('forgather/' + file_name, {
                file_name: item_number + '/' + file_name,
                jobNumber: job_number,
                quantity: quantity,
                item: item_number,
                shipping: shipping
            });
            fs.rename('forgather/' + file_name, item_number + '/' + file_name, (error) => '');
        }
    }
});

function errorCreatingFolder(data) {
    // console.log(data);
}

function mergePdf(file, obj) {
    let doc = new pdf.Document({ width: 3.5 * 72, height: 2 * 72 });
    doc.text('JOB# ' + obj.jobNumber);
    doc.text('ITEM# ' + obj.item);
    doc.text('QT ' + obj.quantity);
    let src = fs.readFileSync(file);
    let ext = new pdf.ExternalDocument(src);
    doc.addPagesOf(ext);

    doc.asBuffer((err, data) => {
        if (err) {
            console.error(err)
        } else {
            fs.writeFileSync(obj.file_name, data, { encoding: 'binary' });
        }
    });
}