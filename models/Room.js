const mongoose = require('mongoose');

const RoomSchema = mongoose.Schema({
    capacity: {
        type: String,
        required: true
    },
    underPg: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Pg'
    },
    price: {
        type: String,
        required: true
    },
    booking: {
        tenant: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        alottmentDate: {
            type: Date
        },
        approveAllotmentDate: {
            type: Date
        },
        paid: {
            type: Boolean,
            default: false
        },
        paymentDuedBy: {
            type: String,
            default: false
        }
    }
});


const Rooms = module.exports = mongoose.model('Rooms', RoomSchema);