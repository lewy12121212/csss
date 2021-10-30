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
        const img = await loadImage(label.img[i])

        detections = await faceapi
          .detectSingleFace(img)
          .withFaceLandmarks()
          .withFaceDescriptor();
        console.log("detections: " + faceapi.LabeledFaceDescriptors.toString(detections));
        //JSON.stringify(detections) 
        //descriptions.push(Array.prototype.slice.call(detections.descriptor))
        descriptions.push(new Float32Array(faceapi.LabeledFaceDescriptors.toString(detections)));
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
  //return new Promise((resolve, reject) => {
  //  console.log("detection - ModifyModel!!!!!!!!!!!!!!!!!!!!!!!!")
  //  resolve(true)
  //})

  return new Promise(async (resolve, reject) => {
    const labeledFaceDescriptors = await loadLabeledImages()
    console.log(labeledFaceDescriptors);
    console.log("END");
    //var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
    var labeledFaceDescriptorsJson = labeledFaceDescriptors.map(x=>x.toJSON())
    console.log(labeledFaceDescriptorsJson);
    
    fs.writeFile('./faceModel/model.txt', JSON.stringify(labeledFaceDescriptorsJson,  null, 2), error => {
      if (error) {
        console.error(error);
        reject(error);
      }
    })
    resolve(true);
    //console.log("detection - ModifyModel")
    //loadLabeledImages(arguments[0])
    //.then((res) => {
    //  let labeledFaceDescriptors = res
    //  console.log("detection - ModifyModel - resolve")
    //  writeModelFile(labeledFaceDescriptors)
    //    .then((res) => {
    //      resolve(true)
    //    })
    //    .catch((err) => {
    //      console.log("writeModelFile - crashed")
    //      reject(false)
    //    })
//
    //})
    //.catch((err) => {
    //  console.log("loadLabeledImages - crashed")
    //  reject(false)
    //})

  })
}
  
module.exports = {
  detecting, 
  modifyModel
};
