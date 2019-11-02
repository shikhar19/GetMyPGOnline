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