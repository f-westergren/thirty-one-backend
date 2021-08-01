require('dotenv').config();

const PORT = +process.env.PORT || 3001;
const SECRET = process.env.SECRET || 'secret';

if (process.env.NODE_ENV === 'test') {
	DB_URI = 'thirty_one_test';
} else {
	DB_URI = process.env.DATABASE_URL || 'thirty_one';
}

console.log('Using database', DB_URI);

module.exports = { PORT, DB_URI, SECRET };
