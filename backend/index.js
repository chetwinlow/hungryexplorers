/*
  dependencies
*/

const express = require('express')
const admin = require('firebase-admin');
const cors = require('cors')
const path = require('path')
const os = require('os')
const fs = require('fs')
const UUID = require('uuid-v4')
const Busboy = require('busboy')

/*
config - express
*/

const app = express()
const port = process.env.PORT || 8080

/*
config - firebase
*/

const serviceAccount = require('./serviceAccountKey.json');
  
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: 'hungryexplorers-1ca3e.appspot.com'
});

const db = admin.firestore();

const bucket = admin.storage().bucket()

/*
endpoint - posts
*/

//getting posts
app.get('/posts', (req, res) => {

  const posts = []
  db.collection('posts').orderBy('date', 'desc').get().then(snapshot => {
    snapshot.forEach((doc) => {
      posts.push(doc.data())
    });
    res.send(posts)
  })
})

//creating posts
app.post('/createPost', (req, res) => {
  const uuid = UUID()

  const busboy = new Busboy({ headers: req.headers });

  const fields = {}
  let fileData = {}

  busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
    console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding + ', mimetype: ' + mimetype);
    // /tmp/4564564-234234.png
    const filepath = path.join(os.tmpdir(), filename)
    file.pipe(fs.createWriteStream(filepath))
    fileData = {filepath, mimetype}
  });

  busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
    fields[fieldname] = val
  });

  busboy.on('finish', function() {
    
    bucket.upload(
      fileData.filepath,
      {
        uploadType: 'media',
        metadata: {
          metadata: {
            contentType: fileData.mimetype,
            firebaseStorageDownloadTokens: uuid
          }
        }
      },
      (err, uploadedFile) => {
        if (!err) {
          createDocument(uploadedFile)
        }
      }
    )

    function createDocument(uploadedFile) {
      db.collection('posts').doc(fields.id).set({
        id: fields.id,
        caption: fields.caption,
        location: fields.location,
        date: parseInt(fields.date),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${ bucket.name }/o/${ uploadedFile.name }?alt=media&token=${ uuid }`
      }).then(() => {
        res.send('Post added: ' + fields.id)
      })
    }
  });

  req.pipe(busboy)
})

/*
listen
*/

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
})