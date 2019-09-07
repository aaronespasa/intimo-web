const fs = require('fs');
const bcrypt = require('bcrypt');

module.exports = {
  jsonReader: (filePath) => {
    const data = fs.readFileSync(filePath, 'utf-8'); // Saves the data in the given file in data as a string
    try {
      const config = JSON.parse(data); // Trasforms the data string into a JS object
      return config;
    } catch (error) {
      console.error(error);
    }
  },
  passHasher: (password) => {
    const saltRounds = 10;
    return bcrypt.hashSync(password, saltRounds);
  },
  passChecker: (password, hash) => {
    console.log(password, hash);

    return bcrypt.compareSync(password, hash);
  },
};
