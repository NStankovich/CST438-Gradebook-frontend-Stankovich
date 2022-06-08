import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom'
import Cookies from 'js-cookie';
import Button from '@mui/material/Button';
import Radio from '@mui/material/Radio';
import {DataGrid} from '@mui/x-data-grid';
import {SERVER_URL} from '../constants.js'

// NOTE:  for OAuth security, http request must have
//   credentials: 'include' 
//

class Assignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {selected: 0, status: null, loading: null, assignments: []};
    };
 
   componentDidMount() {
    this.fetchStatus();
  }

  componentDidUpdate() {
    if (this.state.status && this.state.loading == null) {
      this.fetchAssignments();
    }
  }

  fetchStatus = () => {
    const token = Cookies.get('XSRF-TOKEN');
    fetch(`${SERVER_URL}/user/status`, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token },
        credentials: 'include'
      } )
    .then((response) => {
      return response.text();
    }) 
    .then((responseData) => {
      this.setState({status: responseData})       
    })
    .catch(err => {
      console.error(err)
    }); 
  }
 
  fetchAssignments = () => {
    this.setState({loading: true})
    const fetchURL = this.state.status == "instructor"? `${SERVER_URL}/gradebook`: `${SERVER_URL}/student-grades`;
    console.log("Assignment.fetchAssignments");
    const token = Cookies.get('XSRF-TOKEN');
    fetch(fetchURL, 
      {  
        method: 'GET', 
        headers: { 'X-XSRF-TOKEN': token},
        credentials: 'include' 
      } )
    .then((response) => response.json()) 
    .then((responseData) => { 
      console.log(responseData);
      if (Array.isArray(responseData.assignments)) {
        //  add to each assignment an "id"  This is required by DataGrid  "id" is the row index in the data grid table 
        this.setState({ assignments: responseData.assignments.map((assignment, index) => ( { id: index, ...assignment } )), loading: false });
      } 
      else if (Array.isArray(responseData.assignmentGrades)) {
        this.setState({ assignments: responseData.assignmentGrades.map((assignment, index) => ( { id: index, ...assignment } )), loading:false });
      }
      else {
        toast.error("Fetch failed.", {
          position: toast.POSITION.BOTTOM_LEFT
        });
        this.setState({loading: false});
      }        
    })
    .catch(err => {
      console.error(err)
      this.setState({loading: false});
    }); 
  }
  
   onRadioClick = (event) => {
    console.log("Assignment.onRadioClick " + event.target.value);
    this.setState({selected: event.target.value});
  }
  
  render() {
    
    const columns = [
      {
        field: 'assignmentName',
        headerName: 'Assignment',
        width: 400,
        renderCell: (params) => (
          <div>
          <Radio
            checked={params.row.id == this.state.selected}
            onChange={this.onRadioClick}
            value={params.row.id}
            color="default"
            size="small"
          />
          {params.value}
          </div>
        )
      },
      { field: 'courseTitle', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 200 }
    ];
    const studentColumns = [
      { field: 'name', headerName: 'Assignment Name', width: 300 },
      { field: 'courseName', headerName: 'Course', width: 300 },
      { field: 'dueDate', headerName: 'Due Date', width: 300 },
      { field: 'score', headerName: 'Score', width: 300 },
    ];

    const title = this.state.status == "instructor"? 'Assignment(s) ready to grade: ': 'Assignment(s): ';
      
    const assignmentSelected = this.state.assignments[this.state.selected];
    return (
        <div align="left" >
          <h4>{title}</h4>
            <div style={{ height: 450, width: '100%', align:"left"   }}>
              <DataGrid rows={this.state.assignments} columns={(this.state.status == "instructor")? columns: studentColumns} />
            </div> 
          {(this.state.status == "instructor") &&            
          <Button name="Grade" component={Link} to={{pathname:'/gradebook',   assignment: assignmentSelected }} 
                  variant="outlined" color="primary" disabled={this.state.assignments.length===0}  style={{margin: 10}}>
            Grade
          </Button>
          }
          {(this.state.status == "instructor") &&
          <Button name="AddAssignment" component={Link} to={{pathname:'/add_assignment'}} 
              variant="outlined" color="secondary"  style={{margin: 10}}>
            Add Assignment
          </Button>
          }
          <ToastContainer autoClose={1500} /> 
        </div>
    )
  }
}  

export default Assignment;


