const fs = require('fs');

const path = 'forgather';

fs.readdir(path, function(err, items) {
    for (var i = 0; i < items.length; i++) {
        let file = items[i].split('_');
        let job_number = file[0];
        let item_number = file[1];
        let quantity = file[3];
        let file_name = items[i];

        fs.mkdir(item_number, { recursive: true }, errorCreatingFolder);

        if (file_name[0] != '.') {
            setTimeout(() => {
                fs.rename('forgather/' + file_name, item_number + '/' + file_name, (error) => '');
            }, 200);
        }
    }
});

function errorCreatingFolder(data) {
    // console.log(data);
}