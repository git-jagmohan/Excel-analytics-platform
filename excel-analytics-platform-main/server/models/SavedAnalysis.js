const mongoose = require('mongoose');

const savedAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },

    name: {
      type: String,
      default: 'My Analysis'
    },

    xAxis: {
      type: String,
      required: true
    },

    yAxis: {
      type: String,
      required: true
    },

    chartType: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  'SavedAnalysis',
  savedAnalysisSchema
);