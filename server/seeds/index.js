const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_DB_CONNECTION_URL);
        console.log('✅ MongoDB connected');
    } catch (error) {
        console.error('❌ MongoDB connection failed:', error);
        process.exit(1);
    }
};

const seedAll = async () => {
    try {
        await connectDB();

        const dataDir = path.join(__dirname, 'documents');
        const files = fs.readdirSync(dataDir).filter(file => file.endsWith('.js'));

        for (const file of files) {
            const seedModule = require(path.join(dataDir, file));
            const { model, name, data } = seedModule;

            if (!model || !Array.isArray(data)) {
                console.warn(`⚠️ Skipping ${file} — invalid format`);
                continue;
            }

            await model.deleteMany();
            for (let i = 0; i < data.length; i++) {
                const element = data[i];
                await model.create({ id: i + 1, ...element });
            }

            console.log(`✅ Seeded ${name}s (${data.length} entries)`);
        }

        console.log('🎉 All seeders executed successfully!');
        process.exit();
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedAll();