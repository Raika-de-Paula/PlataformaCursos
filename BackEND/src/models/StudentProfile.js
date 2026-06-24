//src/models/StudentProfile.js

const mongoose = require("mongoose");

const studentProfileSchema = new mongoose.Schema(
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

    interests: {
      type: [String],
      default: []
    },

    bio: {
      type: String,
      default: ""
    },

    enrolledCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ],

    completedCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
      }
    ]
  },
  { timestamps: true }
);

module.exports = mongoose.model("StudentProfile", studentProfileSchema);