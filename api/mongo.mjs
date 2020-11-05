import mongoose from 'mongoose'
import fs from 'fs'
import colors from 'colors'
// import { func } from 'prop-types';

const config = JSON.parse(fs.readFileSync('./api/config.json'));
const db = mongoose.createConnection(config.url, {useNewUrlParser: true, poolSize: config.poolSize,useUnifiedTopology: true});

db.on('connected',() => {console.log('[Mongo] Connection => Connected'.green)})
db.on('error',(err) => {console.log(`[Mongo] Error => ${err}`.red)})
db.on('disconnected',() => {console.log('[Mongo] Disconnect => Disconnected'.yellow)})

export function getDocument(fieldName, fieldValue, collectionName, callback) {
	if (typeof(callback) !== 'function')
		throw new Error('The callback parameter must be a function.');
	
	const collection = db.collection(collectionName);

	collection.countDocuments({}, (err, result) => {
		if (err) {
			callback(JSON.stringify(new Array(0)));
			return;
		}
		if (result <= 0) {
			callback(JSON.stringify(new Array(0)));
			return;
		}
		const query = collection.find({ [fieldName]: fieldValue }).toArray();
		query.then(
			(docs) => {
				callback(JSON.stringify(docs));
				return;
			},
			() => {
				// console.log('frth');
				callback(JSON.stringify(new Array(0)));
				return;
			}
		);
	});
}
export function insertDocuments(jsonString, collectionName) {
	const collection = db.collection(collectionName);
	var docs;

	try {
		docs = JSON.parse(jsonString);
	} catch(err) {
		return new Error('Failed to parse JSON data.', err);
	}

	if (!docs)
		return new Error('Documents are undefined.');

	if (Array.isArray(docs)) {
		collection.insertMany(docs, {}, (err) => {
			if (err)
				throw err;
			return;
		});
	}

	collection.insertOne(docs, {}, (err) => {
		if (err)
			throw err;
		return;
	});
}
export function updateDocuments(jsonString, collectionName, callback) {
	if (typeof(callback) !== 'function')
		throw new Error('The callback parameter must be a function.');
	
	var collection = db.collection(collectionName);
	var docs;

	try {
		docs = JSON.parse(jsonString);
	} catch(err) {
		return new Error('Documents are undefined.');
	}

	if (!docs)
		return new Error('Documents are undefined.');

	if(!Array.isArray(docs)) {
		docs._id = mongoose.Types.ObjectId(docs._id);

		collection.updateOne({ _id: docs._id }, { $set: docs }, (err) => {
			if (err)
				return callback({success: false, docs: docs});
			return callback({success: true, docs: [docs._id.toString()]});
		});
	} else {
		var completed = [];
		
		var updateValues = function(documentID) {
			docs[documentID]._id = mongoose.Types.ObjectId(docs[documentID]._id);
			collection.updateOne({ _id: docs[documentID]._id }, { $set: docs[documentID] }, (err) => {
				if (err)
					return callback({success: false, docs: docs });
			});
			completed.push(docs.pop()._id.toString());
		};
		
		for (var i = docs.length - 1; i >= 0; i--) {
			updateValues(i);
			continue;
		}	
		return callback({success: true, docs: completed });
	}
}
export function getCollection(collectionName, callback) {
    if (typeof(callback) !== 'function')
        throw new Error('The callback parameter must be a function.');

	const promiseCollection = db.collection(collectionName).find({}).toArray();

	promiseCollection.then((documentResult) => {
		if (documentResult.length <= 0) {
			callback(JSON.stringify(new Array(0)));
			return;
		}

		callback(JSON.stringify(documentResult));
	});
}

