//src/controllers/studentController.js

const StudentProfile = require("../models/StudentProfile");
const User = require("../models/User");

const getMyStudentProfile = async (req, res) => {
  try {
    let profile = await StudentProfile.findOne({
      userId: req.user.id
    });

    if (!profile) {
      profile = await StudentProfile.create({
        userId: req.user.id,
        photoUrl: "",
        contacts: {
          emails: [],
          phones: [],
          links: []
        },
        interests: [],
        bio: "",
        enrolledCourses: [],
        completedCourses: []
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateStudentProfile = async (req, res) => {
  try {
    const updateData = {
      contacts: {
        emails: req.body.emails ? JSON.parse(req.body.emails) : [],
        phones: req.body.phones ? JSON.parse(req.body.phones) : [],
        links: req.body.links ? JSON.parse(req.body.links) : []
      },

      interests: req.body.interests
        ? JSON.parse(req.body.interests)
        : [],

      bio: req.body.bio || "",
      userId: req.user.id
    };

    if (req.file) {
      updateData.photoUrl = req.file.path;
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      {
        returnDocument: "after",
        upsert: true
      }
    );

    res.json({
      message: "Perfil de aluno salvo com sucesso",
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicStudentProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name");

    const profile = await StudentProfile.findOne({ userId })
      .populate("enrolledCourses", "title description thumbnail category status")
      .populate("completedCourses", "title description thumbnail category status");

    if (!user || !profile) {
      return res.status(404).json({
        message: "Perfil público de aluno não encontrado"
      });
    }

    res.json({
      name: user.name,
      photoUrl: profile.photoUrl,
      contacts: profile.contacts,
      bio: profile.bio,
      interests: profile.interests,
      enrolledCourses: profile.enrolledCourses,
      completedCourses: profile.completedCourses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyStudentProfile,
  createOrUpdateStudentProfile,
  getPublicStudentProfile
};