import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import {SERVER_URL} from '../constants.js';

class AddAssignment extends React.Component {
    constructor(props){
        super(props);
        this.state={name:'',due_date:'',course_id:''};
    }
    
    handleName = (event) => {
        this.setState({name:event.target.value});
    }
    handleDueDate = (event) =>{
        this.setState({due_date: event.target.value});
    }
    handleCourse = (event) => {
        this.setState({course_id: event.target.value});
    }
    handleSubmit = (event) => {
        event.preventDefault();
        const token = Cookies.get('XRSF-TOKENT');
        var name = this.state.name;
        var due_date = this.state.due_date;
        var course_id = this.state.course_id;

        fetch(`${SERVER_URL}/assignment`,
            {
                method: 'POST',
                header: {'X-XRSF-TOKEN': token, 'Content-Type': 'application/json',},
                body: JSON.stringify({"due_date":due_date,"name":name,"course_id":course_id}),
            }).then(res => {
                if (res.ok) {
                    toast.success(`New assignment "` + name + `" has been added`, {position: toast.POSITION.BOTTOM_LEFT});
                    console.log(`New assignment "` + name + `" has been added`);
                }
                else {
                    toast.error("ERROR: Failed to add course", {position: toast.POSITION.BOTTOM_LEFT});
                    console.error("Error, http status: " + res.status);
                }
            }).catch(err => {
                toast.error("ERROR: Failed to add course", {position: toast.POSITION.BOTTOM_LEFT});
                console.error(err);
            })
    }
    render() {
        return(
            <div className="App">
             <h4>Please Fill out the following form to submit a new Assignment </h4>

             <form onSubmit={this.handleSubmit}>
                <p>Assignment Name:</p>
                <input name='name' onChange={this.handleName} />
                <p>Due Date:</p>
                <input type="date" name='due_date' onChange={this.handleDueDate}  />
                <p>Course ID:</p>
                <input variant="outlined" type="number" name='course_id' onChange={this.handleCourse}/>
                <input type="submit"/>
            </form>

            <Button component={Link} to={{pathname:'/'}} 
                        variant="outlined" color="secondary"  style={{margin: 50}}>
                  Return Home
                </Button>
             <ToastContainer autoClose={1500} /> 
             </div>
        )
    }
}
export default AddAssignment;