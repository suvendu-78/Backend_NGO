import { Book } from "../Module/Book.model.js";

// CREATE BOOK (ADMIN)
const CreateBook = async (req, res) => {
  try {
    const { title, description, price } = req.body;

    // multer gives file here
    const pdfFile = req.file;

    if (!pdfFile) {
      return res.status(400).json({ message: "PDF file is required" });
    }

    const newBook = await Book.create({
      title,
      description,
      price,
      pdfUrl: pdfFile.path, // local file path
      uploadedBy: req.user._id, // comes from requireAdmin middleware
      isPublished: true,
    });

    res.status(201).json({
      message: "Book uploaded successfully",
      book: newBook,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server Error" });
  }
};

export default CreateBook;
