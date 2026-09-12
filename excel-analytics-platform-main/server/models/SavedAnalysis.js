const mongoose = require('mongoose');

const savedAnalysisSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    name: {
      type: String,
      required: true,
    },

    xAxis: {
      type: String,
      required: true,
    },

    yAxis: {
      type: String,
      required: true,
    },

    chartType: {
      type: String,
      enum: ['bar', 'pie'],
      required: true,
    },

    // Save the actual Excel rows used by the chart
    chartData: {
      type: [mongoose.Schema.Types.Mixed],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  'SavedAnalysis',
  savedAnalysisSchema
);