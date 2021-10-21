const faceapi = require('face-api.js')

async function detecting(image) {
  const img = await faceapi.fetchImage(`https://res.cloudinary.com/dvz618eta/image/upload/s--vSBEMjff--/v1634754448/csss/lukasz/1.jpg`)
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
