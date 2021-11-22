const faker = require('faker');

faker.locale = 'es';

const generadorInfo = () => ({
    title: faker.name.findName(),
    price: faker.datatype.number({min: 10, max: 500}),
    thumbnail: faker.image.food(),
    id: faker.datatype.number({min: 10, max: 100})
});

module.exports = {
    generadorInfo
}