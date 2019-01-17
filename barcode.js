var barcode = require('barcode');
const path = require('path');


var code39 = barcode('code39', {
    data: "it works",
    width: 400,
    height: 100,
});

var outfile = path.join(__dirname, 'imgs', 'mycode.png');

code39.saveImage(outfile, function(err) {
    if (err) throw err;

    console.log('File has been written!');
});