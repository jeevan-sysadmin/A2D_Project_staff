// server.js or api/getUsers.js (depending on your setup)

const admin = require('firebase-admin');
const express = require('express');
const serviceAccount = require('../../a2dt-f5fb7-firebase-adminsdk-d7lj8-32876431fb.json'); // Path to your Firebase service account file

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const auth = admin.auth();
const app = express();

app.get('/api/getUsers', async (req, res) => {
  try {
    const userRecords = [];
    let result = await auth.listUsers(1000); // Fetch the first 1000 users
    userRecords.push(...result.users);

    while (result.pageToken) {
      result = await auth.listUsers(1000, result.pageToken); // Fetch next page of users
      userRecords.push(...result.users);
    }

    // Return the users as a JSON response
    res.json({ users: userRecords });
  } catch (error) {
    console.error('Error fetching auth users:', error);
    res.status(500).send('Error fetching users');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
