//src/models/InstructorProfile.js

const mongoose = require("mongoose");

const instructorProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true
    },

    photoUrl: {
      type: String,
      default: ""
    },

    academicBackground: {
      type: [String],
      default: []
    },

    specialties: {
      type: [String],
      default: []
    },

    contacts: {
      emails: {
        type: [String],
        default: []
      },

      phones: {
        type: [String],
        default: []
      },

      links: [
        {
          label: {
            type: String,
            default: ""
          },
          url: {
            type: String,
            default: ""
          }
        }
      ]
    },

    bio: {
      type: String,
      default: ""
    },

    courses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("InstructorProfile", instructorProfileSchema);