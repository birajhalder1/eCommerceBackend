

const path = require("path")

/**
* @description This function converts the buffer to data url
* @param {Object} req containing the field object
* @returns {String} The data url from the string buffer
*/
// console.log(req.file)
// const dataUri = req => dUri.format(path.extname(req.file.originalname).toString(), req.file.buffer);
// module.exports = { multerUploads, dataUri };

const uploadFileToCloudinary = async(file) =>{
    var cloudinary = require('cloudinary').v2;

    cloudinary.config({
        cloud_name:`${process.env.CLOUDINARY_CLOUD_NAME}`,
        api_key:`${process.env.CLOUDINARY_API_KEY}`,
        api_secret:`${process.env.CLOUDINARY_API_SECRET}`
    })
    console.log(file)
    // const file = req.files.photo;

    cloudinary.uploader.upload(file.tempFilePath, (err, result)=>{
        if(err){
            return null;
        }
        return result;
    })
}


exports.fileUpload =async (req, res, next)=> {
    if (!req.file) {
      return next();
    }
  
    // const gcsname = Date.now() + req.file.originalname;
    // console.log(req.file)
    let url = await uploadFileToCloudinary(req.file);
    // console.log(url);
    
  }

// exports.multerUploads = (req, res) => {
    const Multer = require('multer');
    exports.multer = Multer({
      storage: Multer.MemoryStorage,
      limits: {
        fileSize: 5 * 1024 * 1024, // no larger than 5mb
      },
    });

// }

// const multerUploads = () => {

// }

