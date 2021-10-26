const express = require('express');
const faceapi = require('face-api.js');
const fetch = require('node-fetch');
const path = require('path')
const canvas = require("canvas");
const { loadImage, Canvas, Image, ImageData } = canvas; 

global.Blob = require('blob');

faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch })



async function detecting(img) {


  const labeledFaceDescriptors = await loadLabeledImages();
  console.log('labeledFaceDescriptors: ', labeledFaceDescriptors);
  const faceMatcher = new faceapi.FaceMatcher(
    labeledFaceDescriptors,
    0.6
  );
  let image;
  image = await loadImage(img);
  
  const singleResult = await faceapi
  .detectSingleFace(image)
  .withFaceLandmarks()
  .withFaceDescriptor()
  //console.log(singleResult)
  return new Promise ((resolve, reject) => {
    if (singleResult) {
      const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
      console.log(bestMatch.toString());
      resolve(true);
    }
    resolve(false);
  });
  
}


function loadLabeledImages() {
  const labels = [
    'lukasz'
  ];
  return Promise.all(
    labels.map(async (label) => {
      const descriptions = [];
      for (let i = 0; i < 2; i++) {
        const img = await loadImage(
          `https://res.cloudinary.com/dvz618eta/image/upload/v1634930122/csss/${label}/${i}.jpg`
        );
        await faceapi.nets.ssdMobilenetv1.loadFromDisk(path.join(__dirname, 'models'))
        await faceapi.nets.faceLandmark68Net.loadFromDisk(path.join(__dirname, 'models'))
        await faceapi.nets.faceRecognitionNet.loadFromDisk(path.join(__dirname, 'models'))

        const detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        descriptions.push(detections.descriptor);
      }

      return new faceapi.LabeledFaceDescriptors(label, descriptions);
    })
  );
}


module.exports = {detecting}
