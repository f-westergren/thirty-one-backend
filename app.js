const express = require('express');
const app = express();
const cors = require('cors');
app.use(express.json());
app.use(cors());

// Logging system
const morgan = require('morgan');
app.use(morgan('tiny'));

const helmet = require('helmet');
app.use(helmet());

const gameRoutes = require('./routes/games');

app.use('/games', gameRoutes);

/* 404 handler */
app.use((req, res, next) => {
	const err = new Error('Not Found');
	err.status = 404;

	return next(err);
});

app.use((err, req, res, next) => {
	if (err.stack) console.log(err.stack);

	res.status(err.status || 500);

	return res.json({
		error: err,
		message: err.message
	});
});

module.exports = app;
