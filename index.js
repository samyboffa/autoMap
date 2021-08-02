const axios = require('axios');
const { Parser } = require('json2csv');
const fs = require('fs');

const coordinates = [
  [48, -5.1, 51.2, -2],
  [48, -2, 51.2, 1],
  [48, 1, 51.2, 4],
  [48, 4, 51.2, 8.2],
  [45, -5.1, 48, -2],
  [45, -2, 48, 1],
  [45, 1, 48, 4],
  [45, 4, 48, 8.2],
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

const scanMap = async (plantes) => {
  for (let i = 0; i < coordinates.length; i++) {
    console.log('zone', i + 1);
    for (let j = 0; j < plantes.length; j++) {
      const res = await axios.get(`https://api-v2.moisson-live.com/${plantes[j].name}-observations?coordinates[within_box]=${coordinates[i]}&season=2021&category=${plantes[j].category}`, {
        headers: {
          accept: 'application/ld+json',
        },
      });

      plantes[j].data = [...plantes[j].data, ...res.data['hydra:member']];
    }
  }
  return plantes;
};

const run = async () => {
  const fields = ['id', 'createdAt', 'category', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'];
  const opts = { fields: fields };

  const parser = new Parser(opts);

  plantes = await scanMap(plantes);

  plantes.forEach((el) => {
    console.log(el.data.length);
  });
  console.log(plantes[0].data[0]);
  console.log(plantes[1].data[0]);
  console.log(plantes[2].data[0]);
  console.log(plantes[3].data[0]);
  console.log(plantes[4].data[0]);
};

run();
