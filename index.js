const axios = require('axios');

const coordinates = [
  [48, -5, 51.2, 1],
  [48.0, 1.0, 51.0, 4.0],
];
const plantes = [
  { name: 'rapeseed', category: '' },
  { name: 'sunflower', category: '' },
  { name: 'corn', category: '' },
  { name: 'wheat', category: '' },
  { name: 'barley', category: '' },
];

const run = async () => {
  for (let j = 0; j < plantes.length; j++) {
    const res = await axios.get(`https://api-v2.moisson-live.com/${plantes[j].name}-observations?coordinates[within_box]=${coordinates[1]}&season=2021&category=${plantes[j].category}`, {
      headers: {
        accept: 'application/ld+json',
      },
    });
    console.log(plantes[j].name, res.data['hydra:member'].length);
  }
};

run();
