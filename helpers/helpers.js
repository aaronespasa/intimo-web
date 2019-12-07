const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = {
  jsonReader: (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8'); // Saves the data in the given file in data as a JSON string
    try {
      const config = JSON.parse(data); // Trasforms the JSON string into a JS object
      return config;
    } catch (error) {
      console.error(error);
    }
  },
  jsonWriter: async (filePath, data) => {
    data = JSON.stringify(data, null, 2); //Transforms the JS object into a Json string
    fs.writeFileSync(filePath, data); //Edits the JSON file with the new data
  },
  passHasher: (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  },
  passChecker: (password, hash) => {
    return bcrypt.compareSync(password, hash);
  },
};
