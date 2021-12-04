//require('@tensorflow/tfjs-node')
const express = require('express');
//const faceapi = require('face-api.js');
//const faceapi = require('@vladmandic/face-api');
const fetch = require('node-fetch');
const path = require('path')
const { promises: fs } = require('fs')
const canvas = require("canvas");

//const db = require('./server.js');
const { resolve } = require('path');
const { loadImage, Canvas, Image, ImageData } = canvas; 


const mysql = require("mysql");

const db = mysql.createPool({
  host: 'dysk.sytes.net',
  user: 'csss_admin',
  password: 'csss.2000.!@',
  port: '8888',
  database: 'DB_csss'
});

global.Blob = require('blob');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch })

async function detecting(img) {

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  const file = await fs.readFile('./faceModel/model.txt', "utf-8")

  var jsonObj = JSON.parse(file)
  const labesFaceRecog = jsonObj.map(x=>faceapi.LabeledFaceDescriptors.fromJSON(x));
  const faceMatcher = new faceapi.FaceMatcher(
    labesFaceRecog,
    0.5
  );

  let image = await loadImage(img);

  const singleResult = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (singleResult) {
    let bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString());
    return bestMatch
  } else {
    return false
  }

  
}

//funckja do opóźnienia - jako argument przy wywołaniu wpisujemy ilośc milisekund
//function sleep(milliseconds) {
//  const date = Date.now();
//  let currentDate = null;
//  do {
//    currentDate = Date.now();
//  } while (currentDate - date < milliseconds);
//}

async function sqlSelectAllImg(){

  console.log("sqlSelectAllImg")

  
  //problem z opóźnieniem - rekody dodane do bazy nie są w pełni zczytywane pomimo 10s opóźnienia.
  //na każde zdjęcie przypada ok 5s. Przy przetwarzaniu np 5zdjęć mamy aż 25 sekund - musi być inne rozwiązanie.
  //według mnie zdjęcia do bazy trafiają dużo szybciej.
  //aktualizacja modelu na podstawie danych z bazy powinna odbyć się "niezależnie" od endpoint (taki pomysł)
  //problem opóźnienia może też wynikać w sposobie importu pliku z server.js
  //w tym momencie występuje "pętla" server.js importuje employeelogin -> employeelogin importuje faceDetection -> faceDetection importuje server.js (tak być niepowinno)

  //await sleep(10000);

  const sqlQuery = `SELECT LoginId, Img FROM DB_employees_img`

  db.query(sqlQuery, (err, result) => {
    console.log("result sqlSelectAllImg: " + result + "err: " + err)
    //if (err) reject(err)
    //else resolve(result)
  })


  return new Promise((resolve, reject) => db.query(sqlQuery, (err, result) => {
    console.log("result sqlSelectAllImg: " + result + "err: " + err)
    if (err) reject(err)
    else resolve(result)
    })
  );
}

const transformArray = (arr = []) => {
  const res = [];
  const map = {};
  let i, j, curr;
  for (i = 0, j = arr.length; i < j; i++) {
    curr = arr[i];
    if (!(curr.LoginId in map)) {
        map[curr.LoginId] = {LoginId: curr.LoginId, Img: []};
        res.push(map[curr.LoginId]);
    };
    map[curr.LoginId].Img.push(curr.Img);
  };
  return res;
};

async function loadLabeledImages() {

  const sqlAll = await sqlSelectAllImg()
  const sqlUserIndex = transformArray(sqlAll)
  //let ifFaceDetect = true

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  return Promise.all(
    sqlUserIndex.map(async label => {
      console.log(label.LoginId + " : " + label.Img.length)
      const descriptions = []
      var detections

      for (let i = 0; i < label.Img.length; i++) {
        const img = await canvas.loadImage(label.Img[i])

        detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        console.log("DETECTIONS: " + detections);
        if(detections){
          descriptions.push(new Float32Array(detections.descriptor));
        }
      }
      console.log("END ONE");
      return new faceapi.LabeledFaceDescriptors(label.LoginId.toString(), descriptions);
    })
  )
}

function writeModelFile(labeledFaceDescriptors){
  return new Promise((resolve, reject) => {
    fs.writeFile('./faceModel/model.txt', JSON.stringify(labeledFaceDescriptors), 'utf8', error => {
      if (err) {
        console.log(`Error writing file: ${err}`);
        reject(err);
      } else {
        console.log(`File is written successfully!`);
      }
    })
    resolve(true)
  })
}

function modifyModel(){

  return new Promise(async (resolve, reject) => {
    const labeledFaceDescriptors = await loadLabeledImages()
    console.log(labeledFaceDescriptors);
  
    writeModelFile(labeledFaceDescriptors)
      .then((res) => {
        resolve(true)
      })
      .catch((err) => {
        reject(err)
      })
  })

}
  
module.exports = {
  detecting, 
  modifyModel
};
