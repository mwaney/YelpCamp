const res = require('express/lib/response');
const mongoose = require('mongoose');
const Campground = require('../models/campground');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');

mongoose.connect('mongodb://localhost:27017/yelp-camp')

    // const db = mongoose.connection
    .then(() => {
        console.log('Database Connected')
    })
    .catch(err => {
        console.log('OH NO ERROR');
        console.log(err);
    })

const sample = array => array[Math.floor(Math.random() * array.length)];

const seedDB = async () => {
    await Campground.deleteMany({});
    for (let i = 0; i < 50; i++) {
        const random1000 = Math.floor(Math.random() * 1000);
        const price = Math.floor(Math.random() * 30) + 10;
        const camp = new Campground({
            location: `${cities[random1000].city}, ${cities[random1000].state}`,
            title: `${sample(descriptors)} ${sample(places)}`,
            image: 'https://source.unsplash.com/collection/483251',
            description: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Animi amet, fugiat perspiciatis voluptas doloremque distinctio voluptatem. Praesentium rem dolores reiciendis sapiente sed ad modi? Possimus, eaque. Ex sunt voluptas illo aperiam quidem a, vel, nemo repudiandae, facilis odit numquam dolorum aliquam recusandae cumque ratione. Inventore aspernatur, aliquid necessitatibus similique consectetur accusamus nemo nobis expedita? Assumenda aperiam libero aspernatur a commodi, deleniti iste accusamus quos hic doloremque corporis eius veritatis, quis laborum laboriosam illo mollitia. Aperiam, qui. Illum nostrum perspiciatis nihil est laudantium delectus, animi in dolorem eligendi velit eos quaerat ea sed hic quod distinctio? Provident recusandae consequatur excepturi earum voluptas enim debitis est, saepe in, laudantium eos deleniti facilis quasi quas ipsam pariatur vitae quidem dolorem? Tempore, harum quibusdam numquam incidunt temporibus beatae deserunt quaerat culpa possimus voluptates unde cum ex corrupti, officia quia. Corrupti aperiam mollitia possimus id molestias temporibus vero pariatur doloremque enim harum at rerum officia neque praesentium reiciendis, recusandae minima adipisci exercitationem quibusdam dignissimos non odit accusamus. Numquam ipsa vitae, provident consequatur eligendi velit dolorem tempore libero quis quaerat delectus! Illum aliquam nesciunt odit labore error. Ipsa velit, ipsam quia rerum sint expedita architecto dolorem excepturi eligendi temporibus doloribus eveniet magni eum, libero dolorum quos.',
            price
        })
        await camp.save()
    }
}

seedDB().then(() => {
    mongoose.connection.close();
})