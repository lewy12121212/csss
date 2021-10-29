const express = require('express');
const faceapi = require('face-api.js');
const fetch = require('node-fetch');
const path = require('path')
const { promises: fs } = require('fs')
const canvas = require("canvas");
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


function loadLabeledImages() {
  
  const labels = [
    'lukasz',
    'eryk'
  ];
  return Promise.all(
    
    labels.map(async (label) => {
      const descriptions = [];
      await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
      await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
      await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))
      
      let detections
      for (let i = 0; i < 2; i++) {
        console.log(label);
        const img = await loadImage(
          `https://res.cloudinary.com/dvz618eta/image/upload/v1634930122/csss/${label}/${i}.jpg`
        );

        detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}


async function modifyModel(){

  const labeledFaceDescriptors = await loadLabeledImages();
  var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
  console.log(labeledFaceDescriptorsJson);
  
  fs.writeFile('./faceModel/model.txt', JSON.stringify(labeledFaceDescriptorsJson,  null, 2), error => {
    if (error) console.error(error);
    return;
  })
  return 
}

module.exports = {
  detecting, 
  modifyModel
}
