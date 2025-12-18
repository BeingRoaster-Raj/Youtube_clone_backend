import multer from "multer";

// So we are using disk storage of multer to store the file temporarily on our server 
// we can also use memory storage of multer to store the file in memory as a buffer(optionally)

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {
    // const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, file.originalname)
  }
})

export const upload = multer({ storage, })