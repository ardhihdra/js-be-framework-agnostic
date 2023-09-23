const admin = require('firebase-admin');
const { applicationDefault } = require('firebase-admin/app');
const { RepositoryInterface } = require('./interface');

const projectId = 'undangan-online-514c9';

admin.initializeApp({
  projectId: projectId,
  credential: applicationDefault(),
  databaseURL: 'https://undangan-online-514c9.firebaseio.com'
});

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyDwUeW3deeDJGrsCTvIbvYR-xWxGOvczcs",
//   authDomain: "undangan-online-514c9.firebaseapp.com",
//   projectId: "undangan-online-514c9",
//   storageBucket: "undangan-online-514c9.appspot.com",
//   messagingSenderId: "835760414779",
//   appId: "1:835760414779:web:3d5d4e355cb51e57967c1e",
//   measurementId: "G-CMHWEYZQQH"
// };

const db = admin.firestore();

class FirestoreRepository extends RepositoryInterface {
  constructor(collectionName) {
    super()
    this.collectionName = collectionName
  }

  returnWithID(doc) {
    return {id: doc.id, ...doc.data()}
  }

  async create(post) {
    const ref = db.collection(this.collectionName).doc();
    post.id = Number(ref.id);
    await ref.set(post);
    return post;
  }

  async findOne(filter) {
    return findAll(filter)[0]
  }

  async findAll(filter={}) {
    const collection = db.collection(this.collectionName)
    let snapshot = collection
    for(let key of Object.keys(filter)) {
      if (typeof filter[key] === 'object' && !(filter[key] instanceof Date) ) {
          for(let operator of Object.keys(filter[key])) {
            snapshot = snapshot.where(key, operator, filter[key][operator])
          }
      } else {
        snapshot = snapshot.where(key, '==', filter[key][1])
      }
    }
    const snapshotData = await snapshot.get()
    return snapshotData.docs.map((doc) => this.returnWithID(doc));
  }

  async findByID(id) {
    const docRef = db.collection(this.collectionName).doc(id);
    const doc = await docRef.get()
    if (doc.exists) {
      return this.returnWithID(doc)
    } else {
      // doc.data() will be undefined in this case
      console.log("No such document!");
      return undefined;
    }
    // const snapshot = await db.collection(this.collectionName).where('ID', '==', id).get();
  }

  async findByField(field, value) {
    const snapshot = await db.collection(this.collectionName).where(field, '==', value).get();
    if (snapshot.empty) {
      return undefined;
    } else {
      return snapshot.docs[0].data();
    }
  }
}

module.exports = {
  FirestoreRepository
}