// firebaseAdmin.js
import admin from 'firebase-admin';

// Initialize Firebase Admin SDK
const serviceAccount = require('./a2dt-f5fb7-firebase-adminsdk-d7lj8-32876431fb.json'); // Replace with the path to your Firebase service account JSON

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  admin.app(); // If already initialized
}

const db = admin.firestore();
const auth = admin.auth();

export { db, auth };
