import fs from 'fs';
import path from 'path';

const basePath = 'src/assets/projects/img';
const outputFile = 'src/assets/data/project-images.json';

// Funzione per ottenere le immagini in una directory
const getImages = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => !item.isDirectory())
    .map((file) => path.join(dir, file.name).replace('src', ''));
};

// Funzione per scansionare le sottodirectory
const scanDirectories = (dir) => {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isDirectory())
    .reduce((acc, folder) => {
      acc[folder.name] = scanDirectories(path.join(dir, folder.name));
      acc[folder.name]._images = getImages(path.join(dir, folder.name));
      return acc;
    }, {});
};

// Scansiona la cartella di base e salva i dati in un file JSON
const imagesData = scanDirectories(basePath);
fs.writeFileSync(outputFile, JSON.stringify(imagesData, null, 2));

console.log('✅ File JSON con immagini generato!');
