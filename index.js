const functions = require("firebase-functions");
import { Storage } from '@google-cloud/storage';
const storage = new Storage();

exports.storageTrigger = functions.region('europe-west2').storage.object().onFinalize(async (object) => {

    const file = storage.bucket(object.bucket).file(object.name);
    const filePath = object.name;
    if (filePath.includes('logosRaw/')){
      const main = require('./resizeImages');
      main.reSizeImage(file);
    }

  })