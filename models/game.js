const db = require('../db');
const randomstring = require('randomstring');
const deck = require('../deck');
const { shuffle, deal } = require('../helpers');

class Game {
	static async findAllAsUser(id) {
		console.log('HERE', id);
		const result = await db.query(
			`SELECT * FROM games
          WHERE player1=$1`,
			[ id ]
		);
		return result.rows;
	}

	static async findOne(id) {
		const result = await db.query(
			`SELECT * FROM games
          WHERE id=$1`,
			[ id ]
		);
		return result.rows;
	}

	/* Shuffles and deals cards, places one card in pile.*/
	static async create(players) {
		const id = randomstring.generate({
			length: 6,
			capitalization: 'lowercase'
		});
		let shuffledDeck = shuffle(deck);
		let hands = [];
		deal(players, shuffledDeck, hands);
		const pile = JSON.stringify([ shuffledDeck.pop() ]);

		const result = await db.query(
			`INSERT INTO games (id, deck, pile, player1, player2, player3, player4, hands)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING id, player1, player2, player3, player4, hands`,
			[ id, JSON.stringify(shuffledDeck), pile, players[0], players[1], players[2], players[3], JSON.stringify(hands) ]
		);
		return { ...result.rows, cards_left_in_deck: shuffledDeck.length, cards_left_in_pile: 1 };
	}

	static async drawCardFromDeck(id) {
		// Get the deck.
		const result = await db.query(`SELECT deck FROM games WHERE id=$1`, [ id ]);
		let deck = JSON.parse(result.rows[0].deck);

		if (deck.length === 0) {
			const error = new Error('Deck is empty!');
			error.status = 403;
			throw error;
		}

		// Draw the card.
		const card = deck.pop();
		// Update deck in db.
		await db.query(`UPDATE games SET deck=$1 WHERE id=$2`, [ JSON.stringify(deck), id ]);

		return { card, cards_left_in_deck: deck.length };
	}

	static async drawCardFromPile(id) {
		// Get the pile.
		const result = await db.query(`SELECT pile FROM games WHERE id=$1`, [ id ]);
		let pile = JSON.parse(result.rows[0].pile);

		if (pile.length === 0) {
			const error = new Error('Pile is empty!');
			error.status = 403;
			throw error;
		}

		// Draw the card.
		const card = pile.pop();

		// Update pile in db.
		await db.query(`UPDATE games SET pile=$1 WHERE id=$2`, [ JSON.stringify(pile), id ]);

		return { card, cards_left_in_pile: pile.length };
	}

	static async discardCard(id, card) {
		// Get the pile.
		const result = await db.query(`SELECT pile FROM games WHERE id=$1`, [ id ]);
		let pile = JSON.parse(result.rows[0].pile);

		// Add card to pile.
		pile.push(card);

		// Update pile in db.
		await db.query(`UPDATE games SET pile=$1 WHERE id=$2`, [ JSON.stringify(pile), id ]);

		return { cards_left_in_pile: pile.length };
	}
}

module.exports = Game;
