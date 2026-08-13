const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
    {
        companyId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Company',
            required: function () {
                return this.role !== 'SUPER_ADMIN';
            }
        },

        name: {
            type: String,
            required: true,
            trim: true
        },

        email: {
            type: String,
            required: true,
            lowercase: true,
            trim: true
        },

        password: {
            type: String,
            required: true,
            minlength: 6
        },

        role: {
            type: String,
            enum: [
                'SUPER_ADMIN',
                'SHOP_OWNER',
                'STAFF'
            ],
            default: 'STAFF'
        },

        status: {
            type: String,
            enum: ['ACTIVE', 'INACTIVE', 'SUSPENDED'],
            default: 'ACTIVE'
        },

        lastLogin: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

userSchema.index(
    { companyId: 1, email: 1 },
    { unique: true }
);

module.exports = mongoose.model('User', userSchema);