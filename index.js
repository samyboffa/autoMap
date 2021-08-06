const axios = require('axios');
const { google } = require('googleapis');

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
    spreadsheetId: '1UkrhIDJ1izFpl5RDEaDJDuyiycSTEktOnS_Saw0mnmw',
  },
  {
    name: 'sunflower',
    category: '',
    data: [],
    fields: ['@id', '@type', 'specificWeight', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
    spreadsheetId: '1TkKYmakLZOb4Ton9xr9sV0QIcHRKyzqw91FVRZXQ6VM',
  },
  {
    name: 'corn',
    category: '',
    data: [],
    fields: ['@id', '@type', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
    spreadsheetId: '1PIOFlqrRo5-9-teFB-4LzKsXAtlIoQzczP5dahmIhnw',
  },
  {
    name: 'wheat',
    category: '',
    data: [],
    fields: ['@id', '@type', 'category', 'specificWeight', 'protein', 'fallingNumber', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
    spreadsheetId: '1bHqRhDR__DxzFp5Uk8Vso5JP3okEQ_4kHZ74NBS7LgY',
  },
  {
    name: 'barley',
    category: '',
    data: [],
    fields: ['@id', '@type', 'category', 'specificWeight', 'id', 'createdAt', 'variety', 'yield', 'humidity', 'yieldNotation', 'nitrogenQuantityUsed', 'nitrogenProductUsed', 'comment', 'cultivationMethod', 'place', 'soldVolume', 'sowingWeek', 'coordinates', 'image'],
    spreadsheetId: '1e4sRt9PckYL5bFbsFmiv-mM571slv3SHovP8UjQalJU',
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

const loginGoogle = async () => {
  const auth = new google.auth.GoogleAuth({
    keyFile: 'credentials.json',
    scopes: 'https://www.googleapis.com/auth/spreadsheets',
  });
  const authClientObject = await auth.getClient();
  return authClientObject;
};

const updateSheets = async (plantes) => {
  const authClientObject = await loginGoogle();
  const sheets = google.sheets({ version: 'v4', auth: authClientObject });
  plantes.forEach(async (plante) => {
    //clearing sheets
    const clearRequest = {
      spreadsheetId: plante.spreadsheetId,
      range: `${plante.name}!A2:ZZZ`,
    };
    const ClearResponse = await sheets.spreadsheets.values.clear(clearRequest);
    console.log('removing old data : ', plante.name, ClearResponse.statusText);
    //putting values in array
    let values = plante.data.map((el) => {
      return Object.values(el);
    });
    //convertings objects values to strings
    values = values.map((obj) => {
      return (obj = obj.map((elem) => {
        return (elem = JSON.stringify(elem));
      }));
    });

    const addRequest = {
      spreadsheetId: plante.spreadsheetId,
      range: `${plante.name}!A2`,
      valueInputOption: 'USER_ENTERED',
      resource: {
        values,
      },
    };
    //updating sheets in google drive
    const addResponse = await sheets.spreadsheets.values.append(addRequest);
    console.log('adding new data : ', plante.name, addResponse.statusText);
  });
};

const run = async () => {
  plantes = await scanMap(plantes);
  await updateSheets(plantes);
};

run();
