const asyncHandler = require('express-async-handler');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');
const Book = require('../models/Book');

// ── Cloudinary config (reads from .env) ──────────────────
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ── Multer: keep files in memory (no disk write) ─────────
const upload = multer({ storage: multer.memoryStorage() });
const uploadFields = upload.fields([
  { name: 'thumbnail', maxCount: 1 },
  { name: 'pdfFile', maxCount: 1 },
]);

// Helper: upload a buffer to Cloudinary and return secure_url
const uploadToCloudinary = (buffer, folder, resourceType = 'auto') =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder, resource_type: resourceType },
      (err, result) => (err ? reject(err) : resolve(result.secure_url))
    );
    streamifier.createReadStream(buffer).pipe(stream);
  });

// ── GET all books ─────────────────────────────────────────
const getAllBooks = asyncHandler(async (req, res) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json({ success: true, count: books.length, data: books });
});

// ── GET single book ───────────────────────────────────────
const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  res.json({ success: true, data: book });
});

// ── ADD book (Admin) ──────────────────────────────────────
const addBook = asyncHandler(async (req, res) => {
  const { title, description, price, bookUrl } = req.body;

  if (!title || !description || !price) {
    res.status(400);
    throw new Error('Please fill all required fields (title, description, price)');
  }

  // Upload thumbnail to Cloudinary if provided
  let thumbnailUrl = '';
  if (req.files?.thumbnail?.[0]) {
    thumbnailUrl = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      'tegronnotes/thumbnails',
      'image'
    );
  }

  // Upload PDF to Cloudinary if provided
  let pdfFileUrl = '';
  if (req.files?.pdfFile?.[0]) {
    pdfFileUrl = await uploadToCloudinary(
      req.files.pdfFile[0].buffer,
      'tegronnotes/pdfs',
      'raw'        // 'raw' tells Cloudinary to preserve the file as-is (PDF)
    );
  }

  // At least one content source required
  if (!pdfFileUrl && !bookUrl) {
    res.status(400);
    throw new Error('Please provide either a PDF file or an external URL');
  }

  const book = await Book.create({
    title,
    description,
    price: Number(price),
    author: req.body.author || '-',
    category: req.body.category || 'General',
    bookUrl: bookUrl || '',
    thumbnail: thumbnailUrl,
    pdfFile: pdfFileUrl,
    addedBy: req.user._id,
  });

  res.status(201).json({ success: true, data: book });
});

// ── UPDATE book (Admin) ───────────────────────────────────
const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }

  const { title, description, price, author, category, bookUrl } = req.body;

  // Re-upload thumbnail only if a new file was sent
  let thumbnailUrl = book.thumbnail;
  if (req.files?.thumbnail?.[0]) {
    thumbnailUrl = await uploadToCloudinary(
      req.files.thumbnail[0].buffer,
      'tegronnotes/thumbnails',
      'image'
    );
  }

  // Re-upload PDF only if a new file was sent
  let pdfFileUrl = book.pdfFile;
  if (req.files?.pdfFile?.[0]) {
    pdfFileUrl = await uploadToCloudinary(
      req.files.pdfFile[0].buffer,
      'tegronnotes/pdfs',
      'raw'
    );
  }

  const updated = await Book.findByIdAndUpdate(
    req.params.id,
    {
      title: title || book.title,
      description: description || book.description,
      price: price ? Number(price) : book.price,
      author: author || book.author,
      category: category || book.category,
      bookUrl: bookUrl !== undefined ? bookUrl : book.bookUrl,
      thumbnail: thumbnailUrl,
      pdfFile: pdfFileUrl,
    },
    { new: true, runValidators: true }
  );

  res.json({ success: true, data: updated });
});

// ── DELETE book (Admin) ───────────────────────────────────
const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) { res.status(404); throw new Error('Book not found'); }
  await book.deleteOne();
  res.json({ success: true, message: 'Book deleted successfully' });
});

module.exports = { getAllBooks, getBook, addBook, updateBook, deleteBook, uploadFields };