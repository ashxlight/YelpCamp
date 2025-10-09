const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/yelp-camp')
  .then(() => {
    console.log("✅ Mongoose Connection Established");
  })
  .catch(err => {
    console.log("❌ Mongoose Connection Error");
    console.log(err);
  });

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
  await Campground.deleteMany({});
  for (let i = 0; i < 50; i++) {
    const random = Math.floor(Math.random() * 1000);
    const price=Math.floor(Math.random()*20+10);
    const camp = new Campground({
      author:'68a20f41bf6f36c8ff748a5f',
      location: `${cities[random].city}, ${cities[random].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      image: `https://picsum.photos/400?random=${Math.random()}`,
      description:"Lorem ipsum dolor sit amet consectetur adipisicing elit. Illo quod hic omnis nobis, dolore voluptate quasi laborum asperiores! Vero neque eos vitae dignissimos nobis impedit, saepe amet ad quaerat nesciunt.",
      price
    });
    await camp.save();
  }
  console.log("✅ Seeding completed");
  mongoose.connection.close();
}

seedDB();
