
const express = require('express');
const faceapi = require('face-api.js');
const fetch = require('node-fetch');
const path = require('path')
const { promises: fs } = require('fs')
const canvas = require("canvas");

const db = require('./server.js')
const { loadImage, Canvas, Image, ImageData } = canvas; 

global.Blob = require('blob');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch })



async function detecting(img) {


  var fromFile = await fs.readFile('./faceModel/model.txt', "utf-8")

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  var jsonObj = JSON.parse(fromFile)
  const labelki = jsonObj.map( x=>faceapi.LabeledFaceDescriptors.fromJSON(x) );
  const faceMatcher = new faceapi.FaceMatcher(
    labelki,
    0.5
  );
  let image;
  image = await loadImage(img);
  console.log(labelki)
  const singleResult = await faceapi
  .detectSingleFace(image)
  .withFaceLandmarks()
  .withFaceDescriptor()
  //console.log(singleResult)
  
  let bestMatch
  if (singleResult) {
    bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString());
  }

  return bestMatch
}


async function loadLabeledImages() {

  await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
  await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

  const labels = arguments[0];
 
  return Promise.all(
    
    labels.map(async (label) => {
      const descriptions = [];
      
      const sqlQuery = `SELECT img FROM DB_employees_img WHERE login_id LIKE ${label}`
      let images = await new Promise((resolve, reject) => db.db.query(sqlQuery, (err, result) => {
        if (err) reject(err)
        else {
          resolve(result)
          }
        })
      );

      if(images)
      {
        
        let detections

        for (let i = 0; i < 3; i++) {
          console.log(label.login_id);
          const img = await loadImage(
            images[i].img
          );
  
          detections = await faceapi
            .detectSingleFace(img)
            .withFaceLandmarks()
            .withFaceDescriptor();
          descriptions.push(detections.descriptor);
        }
  
        return new faceapi.LabeledFaceDescriptors(label, descriptions);
      }
      
      return; 
    })
  );
}


async function modifyModel(){

  //console.log(arguments[0])
  const labeledFaceDescriptors = await loadLabeledImages(arguments[0]);
  var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
  console.log(labeledFaceDescriptorsJson);
  
  fs.writeFile('./faceModel/model.txt', JSON.stringify(labeledFaceDescriptorsJson,  null, 2), error => {
    if (error) console.error(error);
    return;
  })
  return 
}
  
module.exports(detecting, modifyModel);
