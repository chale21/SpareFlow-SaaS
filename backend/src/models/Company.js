const mongoose = require('mongoose');

const companySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
            trim: true
        },

        phone: {
            type: String,
            trim: true
        },

        address: {
            type: String,
            trim: true
        },

        subscriptionPlan: {
            type: String,
            enum: ['free', 'basic', 'premium'],
            default: 'free'
        },

        status: {
            type: String,
            enum: ['active', 'inactive', 'suspended'],
            default: 'active'
        }
    },
    {
        timestamps: true
    }
);

module.exports = mongoose.model('Company', companySchema);
