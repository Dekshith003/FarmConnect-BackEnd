// controllers/profile.controller.js
const pickProfileFields = (profile) => {
  if (!profile) return null;
  const base = {
    role: profile.role,
    firstName: profile.firstName || "",
    lastName: profile.lastName || "",
    email: profile.email || "",
    phone: profile.phone || "",
    address: profile.address || "",
    city: profile.city || "",
    state: profile.state || "",
    zip: profile.zip || "",
    avatar: profile.avatar || "",
    bio: profile.bio || "",
  };
  if (profile.role === "Farmer") {
    return {
      ...base,
      farmerId: profile.farmerId,
      farmName: profile.farmName || "",
      landSize: profile.landSize || "",
      farmType: profile.farmType || "",
      experience: profile.experience || "",
    };
  } else if (profile.role === "Customer") {
    return {
      ...base,
      customerId: profile.customerId,
      businessName: profile.businessName || "",
      businessType: profile.businessType || "",
      orderVolume: profile.orderVolume || "",
    };
  }
  return base;
};

module.exports = function ProfileController({ profileService }) {
  return {
    // Update profile
    updateProfile: async (req, res, next) => {
      try {
        const id = req.user.id;
        const role = req.user.role;
        const profileData = { ...req.body };
        if (req.file) {
          profileData.avatar = `/uploads/avatars/${req.file.filename}`;
        }
        const profile = await profileService.upsertProfile(
          id,
          role,
          profileData
        );
        res.status(200).json({
          message: "Profile saved",
          profile: pickProfileFields(profile),
        });
      } catch (error) {
        next(error);
      }
    },
    // View own profile
    getProfile: async (req, res, next) => {
      try {
        const profile = await profileService.getProfile(
          req.user.id,
          req.user.role
        );
        console.log(profile);
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ profile: pickProfileFields(profile) });
      } catch (error) {
        next(error);
      }
    },
    // View profile by id
    getProfileById: async (req, res, next) => {
      try {
        // You may need to get role from params or query in frontend
        const role = req.query.role || req.body.role || "Farmer";
        const profile = await profileService.getProfile(req.params.id, role);
        if (!profile) {
          return res.status(404).json({ message: "Profile not found" });
        }
        res.status(200).json({ profile: pickProfileFields(profile) });
      } catch (error) {
        next(error);
      }
    },
  };
};
