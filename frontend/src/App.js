import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';


function App() {
  const[userid,setuserId]=useState('');
  const[email,setemail]=useState('');
  const[password,setPassword]=useState('');
  const [data, setData] = useState([]); // This state is for storing the fetched data
  const [display,setDisplay] = useState(false); // state to control display of list
  
  const updateUserId=(event) =>{
    setuserId(event.target.value);
  }
  const updatePassword =(event)=>{
    setPassword(event.target.value);
  }
  const updateEmail=(event)=>{
    setemail(event.target.value);
  }

//   useEffect(() =>{
//     fetch("http://localhost:4000/getall")
//     .then(response => response.json())
//     .then(data => {
//       console.log(data)
//       setData(data)
//   })
// },[]);

const fetchData = () => {
  fetch("http://localhost:4000/getall")
    .then(response =>response.json())
    .then(data => {
        console.log(data);
        setData(data);
        setDisplay(true); // display the list once data is fetched
    })
    .catch(error => console.log('There was a problem with the fetch operation:', error.message));
};

const insertUser=(event)=>{
  event.preventDefault();
  axios.post('http://localhost:4000/insert',{uid:userid,password:password,email:email})
  .then(res=>console.log(res));
}

const deleteUser = (event) => {
  event.preventDefault();

  axios.delete(`http://localhost:4000/delete/${userid}`)
    .then(res => {
      console.log(res);
      if (res.data === "User deleted successfully") {
        alert('User deleted successfully!');
        setuserId("");  // Assuming you have a state function named setuserId to clear the input
      } else {
        alert('Unexpected response from the server.');
      }
    })
    .catch(error => {
      console.error("Error during the deletion: ", error);

      if (error.response) {
        switch(error.response.status) {
          case 404:
            alert('User not found.');
            break;
          case 500:
            alert('Server error. Please try again later.');
            break;
          default:
            alert('Error deleting the user. Check the console for more details.');
        }
      } else {
        alert('Network error. Please check your connection and try again.');
      }
    });
};


const updateUser = (event) => {
  event.preventDefault();

  axios.post('http://localhost:4000/update', { uid: userid, password: password, email: email })
    .then(res => {
      alert(res.data);  // Displaying the message received from the server
      console.log(res.data);

      // Optionally, clear the fields after a successful update
      setuserId("");
      setPassword("");
      setemail("");
    })
    .catch(error => {
      console.error("Error during the update: ", error);

      // Checking if the error has a response attached to it
      if (error.esponse) {
        switch(errror.response.status) {
          case 400:
            alert('Required data missing. Ensure all fields are filled.');
            break;
          case 404:
            alert('User not found.');
            break;
          case 500:
            alert('Internal server error. Please try again later.');
            break;
          default:
            alert('Unexpected error updating the user. Check the console for more details.');
        }
      } else {
        // For cases where there's no response (e.g., network issues)
        alert('Network error. Please check your connection and try again.');
      }
    });
};




    return (
      <div className="App">
        <center>
        <form onSubmit={insertUser}>
          <b>User ID</b><input type="text" value={userid} onChange={updateUserId}/> <br/>
          <b>Password</b><input type="password" value={password} onChange={updatePassword}/><br/> 
          <b>Email ID</b><input type="email" value={email} onChange={updateEmail}/><br/>
          <input type="submit" value="Add"/>&nbsp;&nbsp;<input type='reset' value="Reset"/>
        </form>
        </center>
        <button onClick={fetchData}>Show Users</button>&nbsp;&nbsp;
        <button onClick={deleteUser}>Delete User</button>&nbsp;&nbsp;
        <button onClick={updateUser}>Update User</button>
        {display && (
      <ul>
          {data.map((user, index) => (
              <li key={index}>
                  UserId: {user.userid}, Email: {user.email}, Password: {user.password}
              </li>
          ))}
      </ul>)}
  </div>
    );
}

export default App;
