import firebase from 'firebase';

var config = {
  apiKey: "AIzaSyBDwxc5R62XFQ3f6fGJ8B9PPSrmKnBDL-A",
  authDomain: "life-fa8ee.firebaseapp.com",
  databaseURL: "https://life-fa8ee.firebaseio.com",
  projectId: "life-fa8ee",
  storageBucket: "life-fa8ee.appspot.com",
  messagingSenderId: "105235232323"
};

const firebaseApp = firebase.initializeApp(config);

export const storage = firebaseApp.storage();

export const database = firebaseApp.database();

export default firebaseApp;
