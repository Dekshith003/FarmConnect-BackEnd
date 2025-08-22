// services/profile.service.js

const logger = require("../utils/logger");
const Profile = require("../models/Profile");

module.exports = function ProfileService() {
  return {
    // Upsert profile (create if not exists, update if exists)
    async upsertProfile(userId, role, profileData) {
      try {
        // Only allow fields defined in the schema
        const allowedFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "city",
          "state",
          "zip",
          "farmName",
          "landSize",
          "farmType",
          "experience",
          "bio",
          "avatar",
          // Customer fields
          "businessName",
          "businessType",
          "orderVolume",
        ];
        const updateData = { user: userId, role };
        for (const key of allowedFields) {
          if (profileData && profileData[key] !== undefined) {
            updateData[key] = profileData[key];
          }
        }
        const profile = await Profile.findOneAndUpdate(
          { user: userId },
          updateData,
          { new: true, upsert: true, setDefaultsOnInsert: true }
        );
        logger.info(`Profile upserted for ${role} ID: ${userId}`);
        return profile;
      } catch (error) {
        logger.error(`Error in upsertProfile: ${error.message}`);
        throw error;
      }
    },

    // Get profile by user ID
    async getProfile(userId) {
      try {
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error("Invalid userId: not a valid ObjectId");
        }
        return await Profile.findOne({ user: userId });
      } catch (error) {
        logger.error(`Error in getProfile: ${error.message}`);
        throw error;
      }
    },

    // Delete profile by user ID
    async deleteProfile(userId) {
      try {
        return await Profile.findOneAndDelete({ user: userId });
      } catch (error) {
        logger.error(`Error in deleteProfile: ${error.message}`);
        throw error;
      }
    },
  };
};
