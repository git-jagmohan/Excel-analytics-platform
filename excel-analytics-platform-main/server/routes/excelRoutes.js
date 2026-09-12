const express = require('express');
const router = express.Router();
const multer = require('multer');
const xlsx = require('xlsx');

const ExcelRecord = require('../models/ExcelRecord');
const SavedAnalysis = require('../models/SavedAnalysis');
const authMiddleware = require('../middleware/authMiddleware');

// =========================
// MULTER CONFIGURATION
// =========================

const storage = multer.memoryStorage();
const upload = multer({ storage });


// =========================
// UPLOAD EXCEL FILE
// =========================

router.post(
  '/upload',
  authMiddleware,
  upload.single('file'),
  async (req, res) => {
    try {
      console.log('✅ /upload route hit');

      if (!req.file) {
        return res.status(400).json({
          msg: 'No file uploaded'
        });
      }

      const workbook = xlsx.read(req.file.buffer, {
        type: 'buffer'
      });

      const sheetName = workbook.SheetNames[0];

      const sheetData = xlsx.utils.sheet_to_json(
        workbook.Sheets[sheetName]
      );

      if (!sheetData.length) {
        console.log('⚠️ No data found in Excel file');

        return res.status(400).json({
          msg: 'No data found'
        });
      }

      // Delete previous Excel records belonging to this user
      await ExcelRecord.deleteMany({
        user: req.user.id
      });

      // Attach logged-in user ID to every Excel row
      const recordsWithUser = sheetData.map((row) => ({
        user: req.user.id,
        data: row
      }));

      const inserted = await ExcelRecord.insertMany(
        recordsWithUser
      );

      console.log(
        `✅ Inserted ${inserted.length} records for user ${req.user.id}`
      );

      res.json({
        msg: 'Upload successful',
        records: inserted.length
      });

    } catch (err) {
      console.error('❌ Upload error:', err);

      res.status(500).json({
        msg: 'Upload error',
        error: err.message
      });
    }
  }
);


// =========================
// GET USER EXCEL DATA
// =========================

router.get(
  '/data',
  authMiddleware,
  async (req, res) => {
    try {
      const data = await ExcelRecord.find({
        user: req.user.id
      });

      res.json(data);

    } catch (err) {
      console.error('❌ Fetch error:', err);

      res.status(500).json({
        msg: 'Fetch error',
        error: err.message
      });
    }
  }
);


// =========================
// DELETE USER EXCEL DATA
// =========================

router.delete(
  '/delete',
  authMiddleware,
  async (req, res) => {
    try {
      await ExcelRecord.deleteMany({
        user: req.user.id
      });

      res.json({
        msg: 'Records deleted'
      });

    } catch (err) {
      console.error('❌ Delete error:', err);

      res.status(500).json({
        msg: 'Delete error',
        error: err.message
      });
    }
  }
);


// =========================
// SAVE ANALYSIS
// =========================
router.post('/save-analysis', authMiddleware, async (req, res) => {
  try {
    const {
      name,
      xAxis,
      yAxis,
      chartType,
      chartData
    } = req.body;

    if (!name || !xAxis || !yAxis || !chartType) {
      return res.status(400).json({
        msg: 'Missing required analysis information'
      });
    }

    const SavedAnalysis = require('../models/SavedAnalysis');

    const analysis = await SavedAnalysis.create({
      user: req.user.id,
      name,
      xAxis,
      yAxis,
      chartType,
      chartData: chartData || []
    });

    res.status(201).json({
      msg: 'Analysis saved successfully',
      analysis
    });

  } catch (err) {
    console.error('Save analysis error:', err);

    res.status(500).json({
      msg: 'Failed to save analysis',
      error: err.message
    });
  }
});


// =========================
// GET SAVED ANALYSES
// =========================

router.get(
  '/saved-analyses',
  authMiddleware,
  async (req, res) => {
    try {
      const analyses = await SavedAnalysis.find({
        user: req.user.id
      }).sort({
        createdAt: -1
      });

      res.json(analyses);

    } catch (err) {
      console.error(
        '❌ Fetch saved analyses error:',
        err
      );

      res.status(500).json({
        msg: 'Failed to fetch saved analyses',
        error: err.message
      });
    }
  }
);


// =========================
// ADMIN - GET ALL DATA
// =========================

router.get(
  '/all',
  authMiddleware,
  async (req, res) => {
    try {
      if (req.user.role !== 'admin') {
        return res.status(403).json({
          msg: 'Access denied: Admins only'
        });
      }

      const allData = await ExcelRecord
        .find({})
        .populate(
          'user',
          'name email'
        );

      res.json(allData);

    } catch (err) {
      console.error(
        '❌ Admin fetch error:',
        err
      );

      res.status(500).json({
        msg: 'Admin fetch error',
        error: err.message
      });
    }
  }
);


// =========================
// EXPORT ROUTER
// =========================

module.exports = router;