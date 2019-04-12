var db = require('./db.js');
class RoomData {
	constructor(roomId) {
		this.roomId = roomId;
		var date = new Date();
		date.setHours(date.getHours()+8);
		var year = date.getFullYear();
		var month = date.getMonth() + 1;
		var day = date.getDate();
		this.today = `${year}-${month}-${day}`;
	}
	fetchGift(date) {
		var fileName = `./data/${this.roomId}_gift_${date}.json`;
		var data = db.fetch(fileName)
		return JSON.parse(String(data));
	}
	addGift(data) {
		var fileName = `./data/${this.roomId}_gift_${this.today}.json`;
		db.add(fileName, data);
	}
	fetchRenqi(date) {
		var fileName = `./data/${this.roomId}_renqi_${date}.json`;
		var data = db.fetch(fileName)
		return JSON.parse(String(data));
	}
	addRenqi(data) {
		var fileName = `./data/${this.roomId}_renqi_${this.today}.json`;
		db.add(fileName, data);
	}
}
module.exports = RoomData;
