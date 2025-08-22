// controllers/profile.controller.js
const pickProfileFields = (profile) => {
  if (!profile) return null;
  const base = {
    _id: profile._id,
    user: profile.user,
    role: profile.role,
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    address: profile.address,
    city: profile.city,
    state: profile.state,
    zip: profile.zip,
    bio: profile.bio,
    avatar: profile.avatar,
    createdAt: profile.createdAt,
    updatedAt: profile.updatedAt,
  };
  if (profile.role === "Farmer") {
    return {
      ...base,
      farmName: profile.farmName,
      landSize: profile.landSize,
      farmType: profile.farmType,
      experience: profile.experience,
    };
  } else if (profile.role === "Customer") {
    return {
      ...base,
      businessName: profile.businessName,
      businessType: profile.businessType,
      orderVolume: profile.orderVolume,
    };
  }
  return base;
};

const notificationService = require("../services/notification.service")();

module.exports = function ProfileController({ profileService }) {
  return {
    upsertProfile: async (req, res, next) => {
      try {
        const userId = req.user.id;
        const role = req.user.role;
        // Accept all possible fields for both roles
        const profileData = { ...req.body };
        // Handle avatar upload
        if (req.file) {
          profileData.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        const profile = await profileService.upsertProfile(
          userId,
          role,
          profileData
        );
        // Send notification
        await notificationService.createNotification(
          userId,
          role.charAt(0).toUpperCase() + role.slice(1),
          "info",
          "Your profile was updated successfully.",
          { profile: pickProfileFields(profile) }
        );
        res.status(200).json({
          message: "Profile saved",
          profile: pickProfileFields(profile),
        });
      } catch (error) {
        next(error);
      }
    },
    getProfile: async (req, res, next) => {
      try {
        const profile = await profileService.getProfile(req.user.id);
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ profile: pickProfileFields(profile) });
      } catch (error) {
        next(error);
      }
    },
    getProfileById: async (req, res, next) => {
      try {
        const profile = await profileService.getProfile(req.params.userId);
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ profile: pickProfileFields(profile) });
      } catch (error) {
        next(error);
      }
    },
    deleteProfile: async (req, res, next) => {
      try {
        await profileService.deleteProfile(req.user.id);
        res.status(200).json({ message: "Profile deleted" });
      } catch (error) {
        next(error);
      }
    },
    fetchOrCreateProfile: async (req, res, next) => {
      try {
        const userId = req.params.userId;
        let profile = await profileService.getProfile(userId);
        if (!profile) {
          // Only allow profile fields
          // Accept all possible fields for both roles
          const profileData = { ...req.body };
          profile = await profileService.upsertProfile(
            userId,
            req.body.role,
            profileData
          );
        }
        res.status(200).json({ profile: pickProfileFields(profile) });
      } catch (error) {
        next(error);
      }
    },
  };
};
