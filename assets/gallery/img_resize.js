const sharp = require('sharp');
const galleryConfig = require('./__config__.json').data;

function resizeImg(fileIn, fileOut) {
    sharp(fileIn).resize({ height:116, width:156}).toFile(fileOut)
}

galleryConfig.forEach(section => {
    const link1 = section.link.replace('/assets/gallery', 'src/assets/gallery');
    section.files.forEach(file => {
        const link2 = file.split('.mob')[0];
        const fileIn = link1 + 'imgs/' + link2 + '.JPG'
        const fileOut = link1 + 'imgs/' + link2 + '_resized.JPG'
        resizeImg(fileIn, fileOut);
    })
})
