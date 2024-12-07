import './App.css'
import React, { useState, useEffect  } from 'react';

function App() {
    // Holds the data to be passed to the database
    const [postData, setPostData] = useState({
        text: ''
    });
    // holds all the todos that will be set to the screen
    const [todos, setTodos] = useState([]);

    // Use Effect hook that will fetch all the todos everytime todos changes
    useEffect(() => {
        fetchTodos();
    }, [todos]);


    const fetchTodos = async () => {
    // Gets a response from the post and calls setTodos which will add a todo
      try {
          const response = await fetch('http://localhost:8080/api/posts');
          const data = await response.json();
          setTodos(data);
      } catch (error) {
          console.error('Error fetching todos:', error);
      }
  };

    const handleChange = (eventObject) => {
        setPostData({
            ...postData,
            text: eventObject.target.value
        });
    };

    const handleSubmit = async (eventObject) => {
        eventObject.preventDefault(); // avoid default actions of the submit button
        try { //Sends a post request to the server containing the post data, stores the response from the server
            const response = await fetch('http://localhost:8080/api/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(postData)
            });
            const data = await response.json();
            console.log(data); // handle the response data as needed
            setTodos([...todos, data.todo]); // Update todos with the returned todo
        } catch (error) {
            console.error('Error:', error);
        }
    };

    const handleDelete = async (id) => {
      try { // sends a request to the server side that the client wants to delete something
          const response = await fetch(`http://localhost:8080/api/delete/${id}`, {
              method: 'DELETE'
          }); // holds the server response
          // Handle response if needed
          console.log(response);
          // Fetch todos again to update the list
          fetchTodos();
      } catch (error) {
          console.error('Error deleting todo:', error);
      }
  };

    return (
      <div className="App">
        <h1>To-Do List</h1>
        <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="text" 
              placeholder="Enter your todo" 
              value={postData.text} 
              onChange={handleChange} 
            />
            <button type="submit">Add Todo</button>
        </form>

        <ul>
            {todos.map((todo, index) => (
            <li key={index}>
              {todo.text}
              <button onClick={() => handleDelete(todo.id)}>Delete</button>
            </li>
            
          ))}
        </ul>


    </div>
    );
}

export default App;

