require('@tensorflow/tfjs-node')
//const express = require('express');
//const faceapi = require('face-api.js');
const faceapi = require('@vladmandic/face-api');
const fetch = require('node-fetch');
const path = require('path')
const { promises: fs } = require('fs')
const canvas = require("canvas");

const db = require('./server.js');
const { resolve } = require('path');
const { loadImage, Canvas, Image, ImageData } = canvas; 

global.Blob = require('blob');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch })



async function detecting(img) {

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  //var jsonObj = JSON.parse(fromFile)
  //const labelki = jsonObj.map( x=>faceapi.LabeledFaceDescriptors.fromJSON(x) );
  const labesFaceRecog = await modifyModel()
  console.log("labesLogin0" + labesFaceRecog)
  const faceMatcher = new faceapi.FaceMatcher(
    labesFaceRecog,
    0.4
  );

  let image = await loadImage(img);

  console.log("labesLogin" + labesFaceRecog)

  const singleResult = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor()
  //console.log(singleResult)

  console.log("labesLogin2" + labesFaceRecog)

  if (singleResult) {
    let bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString());
    return bestMatch
  } else {
    return false
  }

  
}

async function sqlSelectAllImg(){

  console.log("sqlSelectAllImg")
  const sqlQuery = `SELECT login_id, img FROM DB_employees_img`
  return new Promise((resolve, reject) => db.db.query(sqlQuery, (err, result) => {
    console.log("result sqlSelectAllImg: " + result + "err: " + err)
    if (err) reject(err)
    else resolve(result)
    })
  );
}

async function sqlSelectUserIndex(){

  console.log("sqlSelectUserIndex")
  const sqlQuery = `SELECT login_id FROM DB_employees_img GROUP BY login_id`
  return new Promise((resolve, reject) => db.db.query(sqlQuery, (err, result) => {
    //console.log("result sqlSelectAllImg: " + result + "err: " + err)
    if (err) reject(err)
    else resolve(result)
    })
  );
}

//function sqlSelectLabels(login){
//  const sqlQuery = `SELECT img FROM DB_employees_img WHERE login_id LIKE ${login}`
//  return new Promise((resolve, reject) => db.db.query(sqlQuery, [login], (err, result) => {
//    console.log("result sqlSelectAllImg: " + result + "err: " + err)
//    if (err) reject(err)
//    else resolve(result)
//    })
//  );
//}

const transformArray = (arr = []) => {
  const res = [];
  const map = {};
  let i, j, curr;
  for (i = 0, j = arr.length; i < j; i++) {
    curr = arr[i];
    if (!(curr.login_id in map)) {
        map[curr.login_id] = {login_id: curr.login_id, img: []};
        res.push(map[curr.login_id]);
    };
    map[curr.login_id].img.push(curr.img);
  };
  return res;
};

async function loadLabeledImages() {

  const sqlAll = await sqlSelectAllImg()
  const sqlUserIndex = transformArray(sqlAll)
  var image = new Image();

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  return Promise.all(
    sqlUserIndex.map(async label => {
      console.log(label.login_id + " : " + label.img.length)
      const descriptions = [] //desktryptor sztuczej
      var detections

      for (let i = 0; i < label.img.length; i++) {
        const img = await canvas.loadImage(label.img[i])

        detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        //console.log("detections: " + faceapi.LabeledFaceDescriptors.toString(detections));
        //JSON.stringify(detections) 
        //descriptions.push(Array.prototype.slice.call(detections.descriptor))
        descriptions.push(new Float32Array(detections.descriptor));
        //descriptions.push(detections)
      }
      console.log("END ONE");
      return new faceapi.LabeledFaceDescriptors(label.login_id.toString(), descriptions);
    })
  )
}

function writeModelFile(labeledFaceDescriptors){
  return new Promise((resolve, reject) => {
    var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
    fs.writeFile('./faceModel/model.txt', JSON.stringify(labeledFaceDescriptorsJson,  null, 2), error => {
      if (error) reject(err);
    })
    resolve(true)
  })
}

function modifyModel(res){

  return new Promise(async (resolve, reject) => {
    const labeledFaceDescriptors = await loadLabeledImages()
    console.log(labeledFaceDescriptors);

    fs.writeFile('./faceModel/model.json', JSON.stringify(labeledFaceDescriptors), 'utf8', error => {
      if (err) {
        console.log(`Error writing file: ${err}`);
      } else {
        console.log(`File is written successfully!`);
      }
    })
    //resolve(true)

    console.log("modifyModel - end function");
    //var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
    resolve(labeledFaceDescriptors);
  })

}
  
module.exports = {
  detecting, 
  modifyModel
};
