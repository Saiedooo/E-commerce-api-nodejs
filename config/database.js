const mongoose = require("mongoose");

const dbConnection = () => {
  mongoose.connect(process.env.DB_URL).then((conn) => {
    console.log(`Data base Connected: ${conn.connection.host}`);
  });
  // .catch((err) => {
  //   console.error(`Data base Error ${err}`);
  //   process.exit(1);
  // });
};

module.exports = dbConnection;
