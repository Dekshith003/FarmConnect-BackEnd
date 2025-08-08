// services/profile.service.js

const logger = require("../utils/logger");
const Profile = require("../models/Profile");

module.exports = function ProfileService() {
  return {
    async createOrUpdateProfile(userId, role, profileData) {
      try {
        let profile = await Profile.findOne({ user: userId });
        if (profile) {
          profile = await Profile.findOneAndUpdate(
            { user: userId },
            { ...profileData, role },
            { new: true }
          );
          logger.info(`Profile updated for ${role} ID: ${userId}`);
        } else {
          profile = await Profile.create({
            ...profileData,
            user: userId,
            role,
          });
          logger.info(`Profile created for ${role} ID: ${userId}`);
        }
        return profile;
      } catch (error) {
        logger.error(`Error in createOrUpdateProfile: ${error.message}`);
        throw error;
      }
    },

    async getProfile(userId) {
      try {
        return await Profile.findOne({ user: userId });
      } catch (error) {
        logger.error(`Error in getProfile: ${error.message}`);
        throw error;
      }
    },

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
