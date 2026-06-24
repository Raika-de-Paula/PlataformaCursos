//src/controllers/instructorController.js

const InstructorProfile = require("../models/InstructorProfile");
const User = require("../models/User");

const getMyInstructorProfile = async (req, res) => {
  try {
    let profile = await InstructorProfile.findOne({
      userId: req.user.id
    });

    if (!profile) {
      profile = await InstructorProfile.create({
        userId: req.user.id,
        contacts: {
          emails: [],
          phones: [],
          links: []
        },
        academicBackground: [],
        specialties: [],
        bio: "",
        photoUrl: ""
      });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createOrUpdateInstructorProfile = async (req, res) => {
  try {
    const updateData = {
      contacts: {
        emails: req.body.emails ? JSON.parse(req.body.emails) : [],
        phones: req.body.phones ? JSON.parse(req.body.phones) : [],
        links: req.body.links ? JSON.parse(req.body.links) : []
      },

      academicBackground: req.body.academicBackground
        ? JSON.parse(req.body.academicBackground)
        : [],

      specialties: req.body.specialties
        ? JSON.parse(req.body.specialties)
        : [],

      bio: req.body.bio,
      userId: req.user.id
    };

    if (req.file) {
      updateData.photoUrl = req.file.path;
    }

    const profile = await InstructorProfile.findOneAndUpdate(
      { userId: req.user.id },
      updateData,
      {
        returnDocument: "after",
        upsert: true
      }
    );

    res.json({
      message: "Perfil de instrutor salvo com sucesso",
      profile
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getPublicInstructorProfile = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findById(userId).select("name");

    const profile = await InstructorProfile.findOne({ userId })
      .populate("courses", "title description thumbnail category");

    if (!user || !profile) {
      return res.status(404).json({
        message: "Perfil público de instrutor não encontrado"
      });
    }

    res.json({
      name: user.name,
      photoUrl: profile.photoUrl,
      contacts: profile.contacts,
      academicBackground: profile.academicBackground,
      specialties: profile.specialties,
      bio: profile.bio,
      courses: profile.courses
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyInstructorProfile,
  createOrUpdateInstructorProfile,
  getPublicInstructorProfile
};