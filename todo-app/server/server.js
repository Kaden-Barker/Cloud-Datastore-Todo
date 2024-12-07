import { Datastore } from '@google-cloud/datastore'; // import for cloud datastore api
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors'; // Import cors - This allows the server to run on port 5000 and the frontend to run on port 3000

const app = express();
const PORT = 8080;

// Enable CORS
app.use(cors());

// Initialize Database (NoSQL)
const datastore = new Datastore({ // Creates a new instance 
    projectId: 'final-project-417018', // under this project
    keyFilename: '' // Requires Key to service account
});

app.use(bodyParser.json()); // Allows us to read json data

// Post to send data into the database
app.post('/api/posts', (req, res) => {

    console.log("recieved post request")
    const { text } = req.body; // gets the string text from the req
    console.log({text})

    if (!text) { // Make sure that the text is't blank
        return res.status(400).json({ error: 'Text is required for a todo' });
    }

    // Create a new entity
    const todoEntity = {
        key: datastore.key('Todos'), // key tells datastore what kind to place the data in. Kind is similar to a table in a relational database
        data: { // tells it to store two fields, name and isComplete, the value stored will be 'text' and false
            text: text,
            isComplete: false,
        }
    };

    // Save the entity to Datastore
    datastore.save(todoEntity)
        .then(() => {// if saved send a succuss response to the client
            console.log('Todo saved successfully');
            res.status(201).json({ message: 'Todo created successfully', todo: todoEntity }); // return the created todo
        })
        .catch(err => { // catch errors for debuging
            console.error('Error saving todo:', err);
            res.status(500).json({ error: 'Failed to save todo' });
        });
});

// Endpoint to retrieve all todos, This allows us to display the todos
app.get('/api/posts', async (req, res) => {
    try {
        const query = datastore.createQuery('Todos'); // gets all the todos in the kind Todos
        const [todos] = await datastore.runQuery(query); // puts them in a list

        // Map todos to include id property
        const todosWithIds = todos.map((todo) => ({
            // Datastore will automatically create a unique id for each entity
            id: todo[datastore.KEY].id, // extract the id
            text: todo.text,
            isComplete: todo.isComplete
        }));
        res.status(200).json(todosWithIds); // send the respons will all of the todos with an id (this is needed for deleting)
    } catch (error) {
        console.error('Error retrieving todos:', error);
        res.status(500).json({ error: 'Failed to retrieve todos' });
    }
});

// Endpoint to delete a todo
app.delete('/api/delete/:id', async (req, res) => {
    // get the id of the todo that needs to be deleted
    const todoId = req.params.id;
    // creates a key for the specific entity
    const todoKey = datastore.key(['Todos', parseInt(todoId, 10)]);
    try {// search the datastore for that item(key) and delete it
        await datastore.delete(todoKey);
        res.status(204).send(); // send succuss response
    } catch (error) {
        console.error('Error deleting todo:', error);
        res.status(500).json({ error: 'Failed to delete todo' });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
