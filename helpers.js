const jwt = require('jsonwebtoken');

const { SECRET } = require('./config');

const createToken = (user) => {
	let payload = {
		id: user.id
	};

	return jwt.sign(payload, SECRET);
};

const partialUpdate = (table, items, key, id) => {
	let idx = 1;
	let columns = [];

	for (let key in items) {
		if (key.startsWith('_')) {
			delete items[key];
		}
	}

	for (let column in items) {
		columns.push(`${column}=$${idx}`);
		idx += 1;
	}

	let cols = columns.join(', ');
	let query = `UPDATE ${table} SET ${cols} WHERE ${key}=$${idx} RETURNING *`;

	let values = Object.values(items);
	values.push(id);
	return { query, values };
};

const shuffle = (deck) => {
	let newDeck = JSON.parse(JSON.stringify(deck));
	for (let i = newDeck.length - 1; i > 0; i--) {
		let j = Math.floor(Math.random() * (i + 1));
		let temp = newDeck[i];
		newDeck[i] = newDeck[j];
		newDeck[j] = temp;
	}
	return newDeck;
};

// Deals three to each player one by one.
const deal = (players, deck, hands) => {
	let cards = 0;
	while (cards < 3) {
		cards++;
		for (let i = 0; i < players.length; i++) {
			if (!hands[i] && players[i] !== 'NOPLAYER') hands[i] = [];
			if (players[i] !== 'NOPLAYER') {
				hands[i].push(deck.pop());
			}
		}
	}
};

module.exports = { createToken, shuffle, deal, partialUpdate };
