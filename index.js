const fs = require('fs');
const pdf = require('pdfjs');
var barcode = require('barcode');
const path = require('path');

const gatherPath = 'forgather';


fs.readdir(gatherPath, function(err, items) {
    for (var i = 0; i < items.length; i++) {
        let file = items[i].split('_');
        let job_number = file[0];
        let item_number = file[1];
        let quantity = file[2];
        let file_name = items[i];
        let shipping = file[3];
        

            if (file_name[0] != '.') {
                generateBarCode (job_number);
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
    let barcode = path.join(__dirname, 'imgs', obj.jobNumber + '.jpeg');
    let doc = new pdf.Document({ width: 3.75 * 72, height: 2.25 * 72 });

    // doc.image(barcode,{
    //     width: 400, align: 'center', wrap: false, x: 10, y: 30
    //   },()=>'');
    doc.text('JOB# ' + obj.jobNumber);
    doc.text('ITEM# ' + obj.item);
    doc.text('QT ' + obj.quantity);
    
    console.log(barcode);

    let src = fs.readFileSync(file,(err)=>'');
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



function generateBarCode (job_number) {
    let code39 = barcode('code39', {
        data: job_number,
        width: 400,
        height: 100,
    });
    
    let outfile = path.join(__dirname, 'imgs', job_number + '.jpeg');
    
    code39.saveImage(outfile, function(err) {
        if (err) throw err;
    
        console.log('File has been written!');
    });
}
