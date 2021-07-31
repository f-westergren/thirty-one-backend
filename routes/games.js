const express = require('express');
const router = express.Router();
const Game = require('../models/game');

router.get('/', async (req, res, next) => {
	try {
		const games = await Game.findAllAsUser(req.body.id);
		return res.json({ games });
	} catch (err) {
		return next(err);
	}
});

router.get('/:id', async (req, res, next) => {
	try {
		console.log(req.params.id);
		const game = await Game.findOne(req.params.id);
		return res.json({ game });
	} catch (err) {
		return next(err);
	}
});

router.post('/', async (req, res, next) => {
	try {
		const game = await Game.create(req.body.players);
		return res.json({ game });
	} catch (err) {
		return next(err);
	}
});

router.post('/drawDeck', async (req, res, next) => {
	try {
		const card = await Game.drawCardFromDeck(req.body.id);
		return res.json(card);
	} catch (error) {
		return next(error);
	}
});

router.post('/drawPile', async (req, res, next) => {
	try {
		const card = await Game.drawCardFromPile(req.body.id);
		return res.json(card);
	} catch (error) {
		return next(error);
	}
});

router.post('/discardCard', async (req, res, next) => {
	try {
		const pile = await Game.discardCard(req.body.id, req.body.card);
		return res.json(pile);
	} catch (error) {
		return next(error);
	}
});

module.exports = router;
