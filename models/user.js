const db = require('../db');
const bcrypt = require('bcrypt');
const BCRYPT_WORK_FACTOR = 10;
const { partialUpdate } = require('../helpers');
const randomstring = require('randomstring');

class User {
	static async authenticate(data) {
		const result = await db.query(
			`SELECT id, email, username, password
          FROM users WHERE email = $1`,
			[ data.email ]
		);

		const user = result.rows[0];
		if (user) {
			const validPass = await bcrypt.compare(data.password, user.password);
			if (validPass) {
				return { id: user.id };
			}
		}

		const invalidPass = new Error('Invalid credentials.');
		invalidPass.status = 401;
		throw invalidPass;
	}

	static async register(data) {
		const duplicateCheck = await db.query(
			`SELECT email
          FROM users
          WHERE email = $1`,
			[ data.email ]
		);

		if (duplicateCheck.rows[0]) {
			const duplicate = new Error(`Email ${data.email} already exists`);
			duplicate.status = 409;
			throw duplicate;
		}

		const hashedPassword = await bcrypt.hash(data.password, BCRYPT_WORK_FACTOR);
		const id =
			'U' +
			randomstring.generate({
				length: 6,
				charset: 'numeric'
			});
		const result = await db.query(
			`INSERT INTO users (id, email, username, password)
          VALUES ($1, $2, $3, $4)`,
			[ id, data.email, data.username, hashedPassword ]
		);

		return result.rows[0];
	}

	static async findOne(id) {
		console.log('ID', id, typeof +id);
		const result = await db.query(
			`SELECT email, username
          FROM users
          WHERE id = $1`,
			[ id ]
		);

		if (result.rows.length === 0) {
			const notFound = new Error(`Can't find user.`);
			notFound.status = 404;
			throw notFound;
		}

		return result.rows[0];
	}

	static async update(id, data) {
		let { query, values } = partialUpdate('users', data, 'id', id);

		const result = await db.query(query, values);

		if (result.rows.length === 0) {
			let notFound = new Error("Can't find user.");
			notFound.status = 404;
			throw notFound;
		}

		return result.rows[0];
	}

	static async remove(id) {
		const result = await db.query(
			`DELETE FROM users 
          WHERE id=$1
          RETURNING id`,
			[ id ]
		);

		if (result.rows.length === 0) {
			const notFound = new Error(`Can't find user.`);
			notFound.status = 404;
			throw notFound;
		}
	}
}

module.exports = User;
