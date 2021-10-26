const fetch = require('node-fetch');
const faceapi = require('face-api.js')
const cloudinary = require('cloudinary')
const canvas = require('canvas')
//global.Blob = require('blob');
//faceapi.env.monkeyPatch({ fetch: fetch });

const { loadImage, Canvas, Image, ImageData } = canvas
faceapi.env.monkeyPatch({ Canvas, Image, ImageData, fetch: fetch })
faceapi.loadSsdMobilenetv1Model('/models')


async function detecting(image) {
  const img = await loadImage('/lukasz5.jpg');
  //const link = 'https://res.cloudinary.com/dvz618eta/image/upload/v1634930122/csss/lukasz/5.jpg'
  //console.log('https://res.cloudinary.com/dvz618eta/image/upload/v1634930122/csss/lukasz/5.jpg')
  //const referenceImage = await loadImage('http://res.cloudinary.com/dvz618eta/image/upload/v1634930122/csss/lukasz/5.jpg')
  //const referenceImage = await faceapi.fetchImage(img)
  const results = await faceapi
  .detectAllFaces(img)
  .withFaceLandmarks()
  .withFaceDescriptors()

  if (!results.length) {
    return
  }

  // create FaceMatcher with automatically assigned labels
  // from the detection results for the reference image
  const faceMatcher = new faceapi.FaceMatcher(results)

  const singleResult = await faceapi
    .detectSingleFace(image)
    .withFaceLandmarks()
    .withFaceDescriptor()

  if (singleResult) {
    const bestMatch = faceMatcher.findBestMatch(singleResult.descriptor)
    console.log(bestMatch.toString())
    return true;
  }
}



module.exports = {detecting}
