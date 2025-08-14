// controllers/profile.controller.js
module.exports = function ProfileController({ profileService }) {
  return {
    createOrUpdate: async (req, res, next) => {
      try {
        const userId = req.user.id;
        const role = req.user.role;
        const profile = await profileService.createOrUpdateProfile(
          userId,
          role,
          req.body
        );
        res
          .status(200)
          .json({ message: "Profile saved successfully", profile });
      } catch (error) {
        next(error);
      }
    },

    updateProfile: async (req, res, next) => {
      try {
        const userId = req.user.id;
        const role = req.user.role;
        const updated = await profileService.createOrUpdateProfile(
          userId,
          role,
          req.body
        );
        res.status(200).json({ message: "Profile updated", profile: updated });
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
        res.json(profile);
      } catch (error) {
        next(error);
      }
    },

    deleteProfile: async (req, res, next) => {
      try {
        await profileService.deleteProfile(req.user.id);
        res.json({ message: "Profile deleted successfully" });
      } catch (error) {
        next(error);
      }
    },
  };
};
