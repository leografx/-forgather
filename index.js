const fs = require('fs');
const process  = require('process');
const pdf = require('pdfjs');
var barcode = require('barcode');
const path = require('path');
PDFDocument = require('pdfkit');
const gatherPath = 'forgather';

function createTicket(fileName){
    let file = fileName.split('_');
    doc = new PDFDocument({ layout: 'portrait', size: [ 3.75 * 72, 2.25 * 72] });
    
    // Labels 
    doc.fontSize(8);
    doc.text(`JOB#: `, 30, 20);
    doc.text(`ITEM#: `, 30, 35);
    doc.text(`QT: `, 30, 50);
    doc.text(`SHIPPING: `, 30, 65);
    // data
    doc.fontSize(12);
    doc.text(`${ file[0] }`, 80, 20);
    doc.text(`${ file[1] }`, 80, 35);
    doc.text(`${ file[2] }`, 80, 50);
    doc.text(`${ (file[3]==1)? 'YES': 'NO' }`, 80, 65);
    doc.pipe(fs.createWriteStream('job_tickets/' + fileName)); 
    doc.on('pageAdded', () => doc.text("JOB TICKET"));
    doc.image('imgs/' + file[0] + '.jpg', { x: 54, y: 85, width: 198 });
    doc.end();  
}

if(process.argv[2] === 'prepare' || process.argv[2] === 'p') {
    prepareNow();
}

if(process.argv[2] === 'gather' || process.argv[2] === 'g') {
    gatherNow();
}


function prepareNow() {
    fs.readdir(gatherPath, function(err, items) {
        for (var i = 0; i < items.length; i++) {
            let file = items[i].split('_');
            let job_number = file[0];
            let item_number = file[1];
            let quantity = file[2];
            let file_name = items[i];
            let shipping = file[3];
            
            if (file_name[0] != '.') {
                generateBarCode (job_number, file_name);
                fs.mkdir('gather/' + item_number, { recursive: true }, errorCreatingFolder);       
                //mergePdf(file_name, item_number);
            }   
        }
    });
}

function gatherNow(){
    fs.readdir(gatherPath, function(err, items) {
        for (var i = 0; i < items.length; i++) {
            let file = items[i].split('_');
            let job_number = file[0];
            let item_number = file[1];
            let quantity = file[2];
            let file_name = items[i];
            let shipping = file[3];
            
            if (file_name[0] != '.') {
                //generateBarCode (job_number, file_name);
                fs.mkdir('gather/' + item_number, { recursive: true }, errorCreatingFolder);       
                mergePdf(file_name, item_number);
            }   
        }
    });
}

function errorCreatingFolder(data) {
    // console.log(data);
}

function mergePdf(file, item_number) {
    // let barcode = path.join(__dirname, 'imgs', obj.jobNumber + '.jpeg');
    let doc = new pdf.Document({ width: 3.75 * 72, height: 2.25 * 72 });

    let src2 = fs.readFileSync('job_tickets/' + file ,(err)=>'');
    let ext1 = new pdf.ExternalDocument(src2);
    doc.addPagesOf(ext1);
    let src = fs.readFileSync('forgather/' + file,(err)=>'');
    ext2 = new pdf.ExternalDocument(src);
    doc.addPagesOf(ext2);

    doc.asBuffer((err, data) => {
        if (err) {
            console.error(err)
        } else {
            fs.writeFileSync('forgather/' + file, data, { encoding: 'binary' });
            fs.rename('forgather/' + file, 'gather/' + item_number + '/' + file, (error) => '');
        }
    });
}



function generateBarCode (job_number,file) {
    let barcodeCreated = false;
    let code39 = barcode('code39', {
        data: job_number,
        width: 400,
        height: 100,
    });
    
    let outfile = path.join(__dirname, 'imgs', job_number + '.jpg');
    
    code39.saveImage(outfile, function(err) {
        if (err) { throw err };
        barcodeCreated = true;
        console.log('File has been written!');
        if (barcodeCreated) {
            createTicket(file);
        }
    });
}