// src/models/Course.js
const mongoose = require("mongoose");

const materialSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  publicId: {
    type: String,
    default: ""
  },
  name: {
    type: String,
    default: ""
  },
  size: {
    type: Number,
    default: 0
  },
  type: {
    type: String,
    enum: ["video", "pdf", "image", "link", "document", "zip", "text"],
    default: "link"
  }
});

const contentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    type: {
      type: String,
      enum: ["video", "pdf", "image", "link", "document", "zip", "text"],
      required: true
    },

    materials: {
      type: [materialSchema],
      default: []
    },

    // Campos legados mantidos para compatibilidade com conteúdos antigos
    materialUrl: {
      type: String,
      default: ""
    },

    publicId: {
      type: String,
      default: ""
    },

    order: {
      type: Number,
      required: true
    },

    materialName: {
      type: String,
      default: ""
    },

    materialSize: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const sectionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },

  order: {
    type: Number,
    required: true
  },

  contents: [contentSchema]
});

const courseSchema = new mongoose.Schema(
  {
    instructorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
      default: null
    },

    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      default: ""
    },

    thumbnail: {
      type: String,
      required: true,
      default: "/images/thumb2.jpg"
    },

    category: {
      type: String,
      default: ""
    },

    status: {
      type: String,
      enum: ["in_progress", "finished"],
      default: "in_progress"
    },

    sections: [sectionSchema]
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Course", courseSchema);