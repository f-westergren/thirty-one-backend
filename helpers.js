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

const deal = (players, deck, hands) => {
	// console.log(players, hands);
	let cards = 0;
	while (cards < 3) {
		cards++;
		for (player in players) {
			if (!hands[player] && player !== 0) hands[player] = [];
			if (player !== 0) {
				hands[player].push(deck.pop());
			}
		}
	}
};

module.exports = { shuffle, deal };
