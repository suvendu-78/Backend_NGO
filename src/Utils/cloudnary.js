import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDNARY_NAME,
  api_key: process.env.CLOUDNARY_APIKEY,
  api_secret: process.env.CLOUDNARY_API_SECRET_KEY,
});

export const uploadPdfToCloudinary = async (localPath) => {
  try {
    console.log("Uploading PDF:", localPath);

    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "raw",
      folder: "books/pdfs",
      // use_filename: true,
      // unique_filename: true,
    });

    console.log("PDF Uploaded:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary PDF Error:", error.message);
    throw error;
  }
};

export const uploadImageToCloudinary = async (localPath) => {
  try {
    console.log("Uploading Image:", localPath);

    const result = await cloudinary.uploader.upload(localPath, {
      resource_type: "image",
      folder: "books/images",
      use_filename: true,
      unique_filename: true,
    });

    console.log("Image Uploaded:", result.secure_url);

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary Image Error:", error.message);
    throw error;
  }
};
