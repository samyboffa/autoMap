const axios = require('axios');
const { Parser } = require('json2csv');
const fs = require('fs');

const coordinates = [
  //nord
  [48, -5.1, 51.2, -3],
  [48, -3, 51.2, -1],
  [48, -1, 51.2, 1],
  [48, 1, 51.2, 3],
  [48, 3, 51.2, 5],
  [48, 5, 51.2, 8.2],
  //centre
  [45, -5.1, 48, -2],
  [45, -2, 48, 1],
  [45, 1, 48, 4],
  [45, 4, 48, 8.2],
  //sud
  [42, -5.1, 45, -2],
  [42, -2, 45, 1],
  [42, 1, 45, 4],
  [42, 4, 45, 8.2],
];
let plantes = [
  {
    name: 'rapeseed',
    category: '',
    data: [],
    fields: ['@id', '@type', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
  },
  {
    name: 'sunflower',
    category: '',
    data: [],
    fields: ['@id', '@type', 'specificWeight', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
  },
  {
    name: 'corn',
    category: '',
    data: [],
    fields: ['@id', '@type', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
  },
  {
    name: 'wheat',
    category: '',
    data: [],
    fields: ['@id', '@type', 'category', 'specificWeight', 'protein', 'fallingNumber', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
  },
  {
    name: 'barley',
    category: '',
    data: [],
    fields: ['@id', '@type', 'category', 'specificWeight', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
  },
];

const checkDuplicateAndInsert = (reponse, plantes) => {
  reponse.forEach((el) => {
    let found = plantes.find((elem) => elem.id === el.id);
    if (!found) {
      plantes.push(el);
    }
  });
};

const scanMap = async (plantes) => {
  for (let i = 0; i < coordinates.length; i++) {
    console.log('scanning zone : ', i + 1);
    for (let j = 0; j < plantes.length; j++) {
      const res = await axios.get(`https://api-v2.moisson-live.com/${plantes[j].name}-observations?coordinates[within_box]=${coordinates[i]}&season=2021&category=${plantes[j].category}`, {
        headers: {
          accept: 'application/ld+json',
        },
      });
      const reponse = res.data['hydra:member'];
      await checkDuplicateAndInsert(reponse, plantes[j].data);
    }
  }
  return plantes;
};

const generateFiles = async (plantes) => {
  plantes.forEach((plante) => {
    const opts = { fields: plante.fields };
    const parser = new Parser(opts);
    console.log(plante.name, plante.data.length);
    const csv = parser.parse(plante.data);
    fs.writeFileSync(`${plante.name}.csv`, csv);
  });
};

const run = async () => {
  plantes = await scanMap(plantes);
  await generateFiles(plantes);
};

run();
