const mongoose = require('mongoose');

const PgSchema = mongoose.Schema({
    pgName: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    contact: {
        type: String,
		required: true
    },
    address: {
        line1: {
            type: String,
		    required: true
        },
        line2: {
            type: String,
		    required: true
        },
        city: {
            type: String,
		    required: true
        },
        state: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
		    required: true
        }
    },
    totalRooms: {
        type: Number,
        required: true
    },
    isWholeBooked: {
        type: Boolean,
        default: false
    },
    registeredBy: {
        owner: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        registerDate: {
            type: Date
        },
        approveDate: {
            type: Date
        }
    }
});


const Pgs = module.exports = mongoose.model('Pgs', PgSchema);