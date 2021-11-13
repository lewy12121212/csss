const cloudinary = require('cloudinary');
//import cloudinary from 'cloudinary';
//import {Cloudinary} from "@cloudinary/url-gen";

cloudinary.config({ 
  cloud_name: 'dvz618eta', 
  api_key: '633365981842176', 
  api_secret: 'gSCB-Xp_Gw7F4yzuPSdxvd-RxYY',
  secure: true
});

exports.uploads = async (file, login, name) =>{
  await cloudinary.v2.uploader.upload(file, { 
    folder: "csss/".concat(login), 
    public_id: name
    //access_mode: "authenticated"
  }, function(error, result) {console.log(result, error); })
}


