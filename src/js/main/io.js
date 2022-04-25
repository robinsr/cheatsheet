const { dialog, ipcMain } = require('electron');
const path = require('path');
const fs = require( 'fs-extra' );
const gm = require('gm')

const { CustomImage } = require('../utils/images');


const saveFile = (e, imageModel) => {

    let image = CustomImage.fromSnapshot(imageModel);
    
    console.log('Saving image model: ', image);

    return new Promise((resolve, reject) => {
        dialog.showSaveDialog({
            defaultPath: image.getFilename()
        })
        .then(result => {
            let { canceled, filePath } = result;
            let { width, height } = image;

            if (canceled) {
                resolve(null);
            } else {
                let buf = image.getBuffer();

                gm(buf)
                    .units('PixelsPerInch')
                    .resample(144, 144)
                    .density(144, 144)
                    .resize(width*2, height*2)
                    .toBuffer('PNG', (err, newBuf) => {
                        if (err) {
                            reject(err);
                        } else {
                            writeFile(filePath, newBuf)
                                .then(() => resolve(filePath))
                                .catch(reject);
                        }
                    });

            }
        });
    });
}

const writeFile = function(filepath, data) {
    return new Promise((resolve, reject) => {
        fs.writeFile(filepath, data, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

module.exports = { saveFile };
