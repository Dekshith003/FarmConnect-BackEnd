// services/profile.service.js

const logger = require("../utils/logger");
const Profile = require("../models/Profile");

module.exports = function ProfileService() {
  return {
    // Create or update profile (role-based)
    async upsertProfile(id, role, profileData) {
      try {
        let allowedFields = [
          "firstName",
          "lastName",
          "email",
          "phone",
          "address",
          "city",
          "state",
          "zip",
          "avatar",
          "bio",
        ];
        if (role === "Farmer") {
          allowedFields = allowedFields.concat([
            "farmName",
            "landSize",
            "farmType",
            "experience",
          ]);
        } else if (role === "Customer") {
          allowedFields = allowedFields.concat([
            "businessName",
            "businessType",
            "orderVolume",
          ]);
        }
        const updateData = { role };
        for (const key of allowedFields) {
          updateData[key] =
            profileData && profileData[key] !== undefined
              ? profileData[key]
              : "";
        }
        // Store id as farmerId or customerId
        if (role === "Farmer") {
          updateData.farmerId = id;
        } else if (role === "Customer") {
          updateData.customerId = id;
        }
        const query = role === "Farmer" ? { farmerId: id } : { customerId: id };
        const profile = await Profile.findOneAndUpdate(query, updateData, {
          new: true,
          upsert: true,
          setDefaultsOnInsert: true,
        });
        logger.info(`Profile upserted for ${role} ID: ${id}`);
        return profile;
      } catch (error) {
        logger.error(`Error in upsertProfile: ${error.message}`);
        throw error;
      }
    },

    // View profile by user ID, fallback to registration data (role-based)
    async getProfile(id, role) {
      try {
        const mongoose = require("mongoose");
        if (!mongoose.Types.ObjectId.isValid(id)) {
          // Return null for invalid ObjectId, so controller returns 404
          return null;
        }
        const query = role === "Farmer" ? { farmerId: id } : { customerId: id };
        let profile = await Profile.findOne(query);
        if (!profile) {
          // Fetch registration data from Farmer or Customer model
          let regData = null;
          if (role === "Farmer") {
            const Farmer = require("../models/Farmer");
            regData = await Farmer.findById(id);
          } else if (role === "Customer") {
            const Customer = require("../models/Customer");
            regData = await Customer.findById(id);
          }
          if (!regData) return null;
          profile = {
            role,
            firstName: regData.firstName || "",
            lastName: regData.lastName || "",
            email: regData.email || "",
            phone: regData.phone || "",
            address: regData.address || "",
            city: regData.city || "",
            state: regData.state || "",
            zip: regData.zip || "",
            avatar: "",
            bio: "",
            farmName: role === "Farmer" ? regData.farmName || "" : undefined,
            landSize: role === "Farmer" ? regData.landSize || "" : undefined,
            farmType: role === "Farmer" ? regData.farmType || "" : undefined,
            experience:
              role === "Farmer" ? regData.experience || "" : undefined,
            businessName:
              role === "Customer" ? regData.businessName || "" : undefined,
            businessType:
              role === "Customer" ? regData.businessType || "" : undefined,
            orderVolume:
              role === "Customer" ? regData.orderVolume || "" : undefined,
          };
          if (role === "Farmer") profile.farmerId = id;
          if (role === "Customer") profile.customerId = id;
        }
        return profile;
      } catch (error) {
        logger.error(`Error in getProfile: ${error.message}`);
        throw error;
      }
    },
  };
};
