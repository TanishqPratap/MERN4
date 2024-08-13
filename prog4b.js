const { MongoClient } = require('mongodb');
const readlineSync = require('readline-sync');

async function main() {
    // Connection URI
    const uri = "mongodb://localhost:27017"; // For local MongoDB
    // const uri = "<Your MongoDB Atlas Connection String>"; // For MongoDB Atlas

    // Create a new MongoClient
    const client = new MongoClient(uri);

    try {
        // Connect the client to the server
        await client.connect();
        console.log("Connected successfully to server");

        // Specify the database and collection
        const database = client.db('school');
        const collection = database.collection('students');

        // Student details to be inserted
        const student = {
            usn: '1AY22CD057',
            name: 'Tanishq',
            sem: 4,
            year_of_admission: 2022
        };

        // Insert the student data
        const insertResult = await collection.insertOne(student);
        console.log(`New student inserted with the following id: ${insertResult.insertedId}`);

        // Prompt for partial name
        const partialName = readlineSync.question('Enter the partial name to search for: ');

        // Search for students by partial name
        const query = { name: { $regex: partialName, $options: 'i' } }; // 'i' for case-insensitive search
        const students = await collection.find(query).toArray();

        // Print the search results
        if (students.length > 0) {
            console.log(`Students found with partial name "${partialName}":`);
            students.forEach(student => {
                console.log(`USN: ${student.usn}, Name: ${student.name}, Semester: ${student.sem}, Year of Admission: ${student.year_of_admission}`);
            });
        } else {
            console.log(`No students found with partial name "${partialName}".`);
        }
        
    } catch (err) {
        console.error(err);
    } finally {
        // Close the connection
        await client.close();
    }
}

main().catch(console.error);
