const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

// Multer konfiguratsiyasi
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post("/upload-avatar", upload.single("avatar"), (req, res) => {
  if (!req.file) {
    return res.status(400).send("Fayl tanlanmagan");
  }
  res.send({ message: "Fayl muvaffaqiyatli yuklandi!", file: req.file });
});

app.listen(port, () => {
  console.log(`Server http://localhost:${port} portida ishlamoqda`);
});
