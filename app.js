require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./service');

mongoose.connect(process.env.MONGODB_URL)
    .then((con) => console.log(`Database Connected: ${con.connection.host}`))
    .catch((err) => console.log('MongoDB Connection Failed' + err));


const port = process.env.PORT || 3001

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})