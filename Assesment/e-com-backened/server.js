require('dotenv/config');
const mongoose = require('mongoose');
const app = require('./app');
mongoose.connect(process.env.MONGO_DB_LOCAL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log("Connected to Mongodb "))
    .catch(err => console.log("Failed to connect Mongodb"))

const port = process.env.PORT || 3001;
app.listen(port, () => {
    console.log(`Listening port ${port}...`)
})