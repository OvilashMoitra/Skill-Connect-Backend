
const mongoose = require('mongoose');

// Connect to MongoDB directly
mongoose.connect('mongodb://localhost:27017/bug-buster')
.then(async () => {
    console.log('Connected to DB');
    
    // Define Auth Schema briefly
    const AuthSchema = new mongoose.Schema({
        email: String,
        role: String
    });
    // Check if model exists or define it
    const Auth = mongoose.models.Auth || mongoose.model('Auth', AuthSchema);

    // Find all users
    const users = await Auth.find({}, 'email role');
    console.log('--- USERS IN DB ---');
    users.forEach(u => console.log(`${u.email}: '${u.role}'`)); // Quote role to see spaces etc
    console.log('-------------------');

    process.exit(0);
})
.catch(err => {
    console.error(err);
    process.exit(1);
});
