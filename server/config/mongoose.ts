import mongoose from 'mongoose';

export const initializeDatabase = async () => {
  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw Error('undefined mongo db uri');
    }

    await mongoose.connect(uri);

    console.log('[db]: Database connected successfully');
  } catch (err) {
    console.log(err);
  }
};
