const axios = require("axios");
const { bucket } = require("../firebase/firebase-admin");

// download file
const downloadAndStoreImageIntoDB = async (fileLink, id) => {
  axios({
    url: fileLink,
    responseType: "stream",
  })
    .then((response) => {
      // Save the photo to Firebase Storage
      const file = bucket.file(`${id}.jpg`);
      response.data.pipe(file.createWriteStream());

      return new Promise((resolve, reject) => {
        file.createWriteStream().on("finish", resolve).on("error", reject);
      });
    })
    .then(() => {
      console.log("Photo downloaded and stored in Firebase Storage.");
    })
    .catch((error) => {
      console.error("Error downloading or storing the photo:", error);
    });
};

module.exports = {
  downloadAndStoreImageIntoDB,
};
