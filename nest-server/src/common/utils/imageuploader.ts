// import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';

// cloudinary.config({
//   cloud_name: process.env.CLOUD_NAME,
//   api_key: process.env.API_KEY,
//   api_secret: process.env.API_SECRET,
// });

// interface UploadOptions {
//   folder: string;
//   height?: number;
//   quality?: number;
// }

// export const uploadImageToCloudinary = async (
//   filePath: string,
//   options: UploadOptions,
// ): Promise<UploadApiResponse> => {
//   const uploadOptions: cloudinary.UploadApiOptions = {
//     folder: options.folder,
//     resource_type: 'auto',
//   };

//   if (options.height) {
//     uploadOptions.height = options.height;
//   }
//   if (options.quality) {
//     uploadOptions.quality = options.quality;
//   }

//   console.log('OPTIONS', uploadOptions);

//   return await cloudinary.uploader.upload(filePath, uploadOptions);
// };

const cloudinary = require("cloudinary").v2

//  export const uploadImageToCloudinary = async (file:any, folder:any, height?, quality?) => {
//   const options:any = { folder }
//   if (height) {
//     options.height = height
//   }
//   if (quality) {
//     options.quality = quality
//   }
//   options.resource_type = "auto"
//   console.log("OPTIONS", options)
//   console.log(file.path)
//   console.log(file)
//   return await cloudinary.uploader.upload(file.path, options)
// }
export const uploadImageToCloudinary = (
  file: Express.Multer.File,
  folder: any,
  height?: number,
  quality?: number
): Promise<any> => {
  console.log(file)
  if (!file || !file.buffer || file.buffer.length === 0) {
    throw new Error('Invalid or empty file');
  }

  const options: any = { folder, resource_type: 'auto' };
  if (height) options.height = height;
  if (quality) options.quality = quality;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(options, (err, result) => {
      if (err) return reject(err);
      resolve(result);
    });

    uploadStream.end(file.buffer); //  stream the buffer
  });
};
