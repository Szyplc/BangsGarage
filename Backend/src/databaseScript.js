const mongoose = require('mongoose');
const { User, Chat_room, Conversation, Media, GenderEnum, Car, Car_Specification } = require('../dist/schema.js');

mongoose.connect('mongodb+srv://generalkenobi1919:X3AdbUJMjhaCI8RN@cluster0.zcokpld.mongodb.net/Praktyki', { useNewUrlParser: true, useUnifiedTopology: true });

const deleteSpecsAndCars = async () => {
    try {
        // Znajdź _id dokumentów do usunięcia
        const specsToDelete = await Car_Specification.find({ manufacturer: "creating" }).select('_id');

        // Usuń powiązane dokumenty w 'cars'
        await Car.deleteMany({ Car_Specification: { $in: specsToDelete.map(spec => spec._id) } });

        // Usuń dokumenty z 'Car_Specification'
        await Car_Specification.deleteMany({ manufacturer: "creating" });

        console.log('Dokumenty zostały usunięte');
    } catch (error) {
        console.error('Wystąpił błąd:', error);
    }
};

deleteSpecsAndCars();