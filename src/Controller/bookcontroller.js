import fs from "fs";
import {
  uploadPdfToCloudinary,
  uploadImageToCloudinary,
} from "../Utils/cloudnary.js";
import { Book } from "../Module/Book.model.js";

// const CreateBook = async (req, res) => {
//   try {
//     const pdfPath = req.files.pdf[0].path;
//     const imagePath = req.files.image?.[0]?.path;

//     console.log("Uploading PDF:", pdfPath);

//     const pdfUpload = await uploadPdfToCloudinary(pdfPath);

//     let imageUpload = null;
//     if (imagePath) {
//       console.log("Uploading Image:", imagePath);
//       imageUpload = await uploadImageToCloudinary(imagePath);
//     }

//     // ✅ DELETE LOCAL FILES AFTER SUCCESS
//     if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
//     if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

//     const book = await Book.create({
//       title,
//       description,
//       price,
//       pdfUrl: pdfUpload.url,
//       imageUrl: imageUpload?.url,
//     });

//     return res.json({
//       success: true,
//       pdfUrl: pdfUpload.url,
//       imageUrl: imageUpload?.url,
//     });
//   } catch (error) {
//     console.error("CreateBook Error:", error);

//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default CreateBook;

// import fs from "fs";
// import { Book } from "../Module/Book.model.js";
// import {
//   uploadPdfToCloudinary,
//   uploadImageToCloudinary,
// } from "../Utils/cloudnary.js";

// const CreateBook = async (req, res) => {
//   try {
//     // ✅ FIX: extract fields from req.body
//     const { title, description, price, author, imei } = req.body;

//     if (!title || !req.files?.pdf) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and PDF are required",
//       });
//     }

//     const pdfPath = req.files.pdf[0].path;
//     const imagePath = req.files.image?.[0]?.path;

//     // ⬆️ Upload to Cloudinary
//     const pdfUpload = await uploadPdfToCloudinary(pdfPath);

//     let imageUpload = null;
//     if (imagePath) {
//       imageUpload = await uploadImageToCloudinary(imagePath);
//     }

//     // 🧹 Delete local temp files
//     if (fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
//     if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

//     // 💾 Save to MongoDB
//     const book = await Book.create({
//       title,
//       description,
//       price,
//       imei,
//       author,
//       pdfUrl: pdfUpload.url,
//       pdfPublicId: pdfUpload.publicId,
//       imageUrl: imageUpload?.url,
//       imagePublicId: imageUpload?.publicId,
//     });

//     return res.status(201).json({
//       success: true,
//       message: "Book uploaded successfully",
//       book,
//     });
//   } catch (error) {
//     console.error("CreateBook Error:", error);
//     return res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export default CreateBook;

// const CreateBook = async (req, res) => {
//   try {
//     const { title, description, price, author, imei } = req.body;

//     if (!title) {
//       return res.status(400).json({
//         success: false,
//         message: "Title is required",
//       });
//     }

//     const pdfPath = req.files?.pdf?.[0]?.path;
//     const imagePath = req.files?.image?.[0]?.path;

//     let pdfUpload = null;
//     let imageUpload = null;

//     let type = "book"; // default physical book

//     if (pdfPath) {
//       pdfUpload = await uploadPdfToCloudinary(pdfPath);
//       type = "ebook";
//     }

//     if (imagePath) {
//       imageUpload = await uploadImageToCloudinary(imagePath);
//     }

//     // delete temp files
//     if (pdfPath && fs.existsSync(pdfPath)) fs.unlinkSync(pdfPath);
//     if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);

//     const book = await Book.create({
//       title,
//       description,
//       price,
//       author,
//       imei,

//       type,

//       pdfUrl: pdfUpload?.url,
//       pdfPublicId: pdfUpload?.publicId,

//       imageUrl: imageUpload?.url,
//       imagePublicId: imageUpload?.publicId,
//     });

//     res.status(201).json({
//       success: true,
//       message: `${type} uploaded successfully`,
//       book,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }

// };

const CreateBook = async (req, res) => {
  try {
    const { title, description, price, author, imei, type } = req.body;

    if (!title || !type) {
      return res.status(400).json({
        success: false,
        message: "Title and type required",
      });
    }

    const pdfPath = req.files?.pdf?.[0]?.path;
    const imagePath = req.files?.image?.[0]?.path;

    let pdfUpload = null;
    let imageUpload = null;

    if (type === "ebook" && !pdfPath) {
      return res.status(400).json({
        success: false,
        message: "PDF required for ebook",
      });
    }

    if (pdfPath) {
      pdfUpload = await uploadPdfToCloudinary(pdfPath);
    }

    if (imagePath) {
      imageUpload = await uploadImageToCloudinary(imagePath);
    }

    const book = await Book.create({
      title,
      description,
      price,
      author,
      imei,
      type,
      pdfUrl: pdfUpload?.url,
      pdfPublicId: pdfUpload?.publicId,
      imageUrl: imageUpload?.url,
      imagePublicId: imageUpload?.publicId,
    });

    res.status(201).json({
      success: true,
      message: `${type} uploaded`,
      book,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

export default CreateBook;
