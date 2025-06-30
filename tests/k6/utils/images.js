const fs = require('fs');
const path = require('path');
const { faker } = require('@faker-js/faker');

function generatePhotosBatch(totalPhotos = 1000, batchSize = 50) {
  const allPhotos = [];

  for (let i = 0; i < totalPhotos; i += batchSize) {
    for (let j = i; j < i + batchSize && j < totalPhotos; j++) {
      const photo = {
        url: faker.image.urlLoremFlickr({ category: 'nature' }), // gera url random de imagem
        caption: faker.lorem.sentence(),
      };

      allPhotos.push(photo);
    }
  }

  const filePath = path.join(__dirname, '../data/photos.json');
  fs.writeFileSync(filePath, JSON.stringify(allPhotos, null, 2));
  console.log(`✅ ${allPhotos.length} fotos salvas em ${filePath}`);
}

generatePhotosBatch();
