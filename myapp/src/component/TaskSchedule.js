import React, { useEffect, useState } from 'react'
import axios from "axios"

const TaskSchedule = () => {

  const [handleInput, setHandleInput] = useState({
    phone: "",
    title: "",
    description: "",
    scheduleTime: "",
    recurringType:"",
    endDate:""
  })
  const [getTask, setGetTask] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isChecked, setIsChecked] = useState(false);
  const [checkedIs, setCheckedIs] = useState(false);
  const [isActive, setIsActive] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const [updtInptHandle, setUpdtInptHandle] = useState({
    id: "",
    phone: "",
    title: "",
    description: "",
    scheduleTime: "",
    status:"",
    recurringType:"",
    endDate:""
  });

  const getData = async () => {
    try {
      const response = await axios.get("http://localhost:9898/api/tasks")
      // const response = await axios.get("https://tasknotifyapi.web2rise.in/api/tasks")
      if (response.data.data) {
        setGetTask(response.data.data)
        setFilteredUsers(response.data.data);
      }
    } catch (error) {
      console.log(error, "Data is Not Getting")
    }
  }

  // const handleSearchFilter = () => {
  //   const trimmedQuery = searchQuery.trim();
  //   const filteredData = getTask.filter((user) => {
  //     const phoneString = user.phone.toString();
  //     const matchesPhone = phoneString.includes(trimmedQuery);
   
  //     const matchesStatus = activeFilter === 'all' || user.status === activeFilter;
  
  //     return matchesPhone && matchesStatus;
  //   });
  //   console.log(activeFilter)
  //       console.log(filteredData, "filteredData")
  //   setFilteredUsers(filteredData);
  // }

  const handleSearchFilter = () => {
    const trimmedQuery = searchQuery.trim();
    const filteredData = getTask.filter((user) => {
      if (typeof user.phone === 'number') { 
          const phoneString = user.phone.toString();
          const matchesPhone = phoneString.includes(trimmedQuery);

          const matchesStatus = activeFilter === 'all' || user.status === activeFilter;
  
      return matchesPhone && matchesStatus;
          // return phoneString.includes(trimmedQuery);
      }
      return false;  
  });
    setFilteredUsers(filteredData);a
  }

  const handleActiveFilter = (e) =>{
    const selectStatus = e.target.value;
    setActiveFilter(selectStatus)
    
    if(selectStatus==='all'){
      setFilteredUsers(getTask);
    }else {
      // eslint-disable-next-line
      const filteredStatusData = getTask.filter(
        (user) => user.status.toLowerCase() === selectStatus.toLowerCase()
        );
        
      setFilteredUsers(filteredStatusData);
    } 
  }

  console.log(filteredUsers, "filteredUsers")
  

  const formattedDate = dateGet => {
    const date = new Date(dateGet);
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false, // Use 24-hour format
    };
    const formattedDate = date.toLocaleDateString("en-US", options);
    return formattedDate
  };

  const handleField = (e) => {
    setHandleInput({ ...handleInput, [e.target.name]: e.target.value })
  }

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);

  };

  const handleEditCheckboxChange = (e) => {
    setCheckedIs(!checkedIs);
    if (e.target.checked) { 
      setUpdtInptHandle((prevState) => ({
        ...prevState,
        endDate: '',
        recurringType: '',
      }));
      // setUpdtInptHandle({ ...updtInptHandle, endDate: '', recurringType:'' });

    }
  };

  const submitForm = async (e) => {
    e.preventDefault();
    const { phone, title, description, scheduleTime, recurringType, endDate} = handleInput;

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone) || !title || !description || !scheduleTime) {
      alert("Please fill all the fields correctly before Add Task.");
      return;
    }

    try {
      const sendData = await axios.post("http://localhost:9898/api/tasks", { phone, title, description, scheduleTime, recurringType, endDate})
      // const sendData = await axios.post("https://tasknotifyapi.web2rise.in/api/tasks", { phone, title, description, scheduleTime, reminderType })
      if (sendData.data.status === "success") {
        getData()
        setHandleInput({ phone: "", title: "", description: "", scheduleTime: "",  recurringType:"", endDate:"" })
        setIsChecked(false)
      }
      // console.log(sendData)
    } catch (error) {
      console.log(error, "Data Not Post")
    }
  }

  const deleteData = async (index) => {
    const response = await axios.delete(`http://localhost:9898/api/tasks/${index}`)
    // const response = await axios.delete(`https://tasknotifyapi.web2rise.in/api/tasks/${index}`)
    if (response.data.message === "Task Deleted Successfully") {
      getData()
      console.log(response)
    }
  }

  const editData = (ediValue) => {
    console.log(ediValue, "ediValue")
    const id = ediValue.id;
    const filteredData = getTask.find((val) => val.id === id);
    setUpdtInptHandle({ 
      id: filteredData.id, 
      phone: filteredData.phone, 
      title: filteredData.title, 
      description: filteredData.description, 
      scheduleTime: filteredData.scheduleTime, 
      status:filteredData.status,
      endDate:filteredData.endDate,
      recurringType:filteredData.recurringType,
    });

    if(filteredData.status==='Active'){
      setIsActive(true)
    }else{
      setIsActive(false)
    }

  };
  
  const updtHandle = (e) => {
    setUpdtInptHandle({ ...updtInptHandle, [e.target.name]: e.target.value })
  }

  const handleActiveChange = (e) => {
    setIsActive(!isActive);
    if (!e.target.checked) {
      setUpdtInptHandle({ ...updtInptHandle, status: 'Inactive' });
    } else {
      setUpdtInptHandle({ ...updtInptHandle, status: 'Active', scheduleTime:'', });
    }
  };

  
  const updateData = async (e) => {
    e.preventDefault();
    console.log(updtInptHandle)

    // console.log(updtInptHandle, "updtInptHandle")
    const { id, phone, title, description, scheduleTime, status, recurringType, endDate  } = updtInptHandle;

    const phonePattern = /^[0-9]+$/;
    if (!phonePattern.test(phone) || !title || !description || !scheduleTime) {
      alert("Please fill empty fields correctly before Update The Task.");
      return;
    }
    
    if (checkedIs) {
      if (!recurringType || !endDate ) {
        alert("Please fill empty fields correctly before Update The Task.");
        return;
      }
    }

    try {
      const sendData = await axios.put(`http://localhost:9898/api/tasks/${id}`, { phone, title, description, scheduleTime, status, recurringType, endDate })
      // const sendData = await axios.put(`https://tasknotifyapi.web2rise.in/api/tasks/${id}`, { phone, title, description, scheduleTime })
      if (sendData.data.status === "success") {
        getData()
        setUpdtInptHandle({ phone: "", title: "", description: "", scheduleTime: "" })
        if(checkedIs){
          setCheckedIs(!checkedIs)
        }
      }
      console.log(sendData)
    } catch (error) {
      console.log(error, "Data Not Updated")
    }
  }



  const closeModal = () => {
    setHandleInput({
      phone: "",
      title: "",
      description: "",
      scheduleTime: ""
    })
    setUpdtInptHandle({
      phone: "",
      title: "",
      description: "",
      scheduleTime: ""
    })
  }
// console.log(getTask, "getTask")
  useEffect(() => {
    getData()
  }, []);

  useEffect(() => {
    handleSearchFilter();
    // eslint-disable-next-line
  }, [searchQuery]);

  return (
    <>
      <div className='display_Head'>
        <a className="create_btn" data-bs-toggle="modal" href="#exampleModalToggle" type="button" onClick={closeModal}>Add New</a>
        <input type="search" className="search_feild" placeholder="Search phone..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}/>
        {/* <a className="logout_btn">Logout</a> */}
        <select onChange={handleActiveFilter}>
          <option value="all">Select Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <ul className="user_manage">
        <li><b>Sr. no.</b></li>
        <li><b>Phone</b></li>
        <li><b>Title</b></li>
        <li><b>Description</b></li>
        <li><b>Schedule Time</b></li>
        <li><b>End Time</b></li>
        <li><b>Rec Type</b></li>
        <li><b>Status</b></li>
        <li><b>View</b></li>
        <li><b>Edit</b></li>
        <li><b>Delete</b></li>

        {filteredUsers.map((val, i) => {
          return (<React.Fragment key={i}>
            <li>{1 + i}.</li>
            <li>{val.phone}</li>
            <li>{val.title}</li>
            <li>{val.description}</li>
            <li>{formattedDate(val.scheduleTime)}</li>
            <li>{val.endDate===null ? 'Null': formattedDate(val.endDate)}</li>
            <li>{val.recurringType===null ? 'Null': val.recurringType}</li>
            <li>{val.status}</li>
            <li><i className="fa fa-eye" aria-hidden="true"></i></li>
            <li><button type="button" data-bs-toggle="modal" data-bs-target="#exampleModalToggleedit" onClick={() => editData(val)}><i className="fa fa-pencil-square-o" aria-hidden="true"></i></button></li>
            {filteredUsers.length === 1 ? <li><div > <i style={{ cursor: "no-drop", color: "#ccc" }} className="fa fa-trash" aria-hidden="true" ></i></div></li> : <li><div onClick={() => deleteData(val.id)}> <i className="fa fa-trash" aria-hidden="true"></i> </div></li>}
          </React.Fragment>)
        })}
      </ul>

      <div className="modal fade" id="exampleModalToggle" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalToggleLabel">Add Task</h5>
                <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}>x</button>
              </div>
              <div className="modal-body user_add">
                <div className="first_fields">
                  <div className="form_input">
                    <label><b>Phone<span>*</span></b></label>
                    <input type="tel" name="phone" minLength="10" maxLength="10" onChange={handleField} value={handleInput.phone} />
                  </div>
                  <div className="dateandtime">
                    <label><b>Start Date & Time<span>*</span></b></label>
                    <input type="datetime-local" name="scheduleTime" onChange={handleField} value={handleInput.scheduleTime} />
                  </div>
                </div>
                <div className="form_input">
                  <label><b>Title<span>*</span></b></label>
                  <input type="text" name="title" onChange={handleField} value={handleInput.title} />
                </div>
                <div className="form_input">
                  <label><b>Description<span>*</span></b></label>
                  <textarea type="textarea" name="description" onChange={handleField} value={handleInput.description} ></textarea>
                </div>
                <div className="form_input forreminddate">
                  <div className="selectreminder">
                    <input type="checkbox" checked={isChecked} onChange={handleCheckboxChange} />
                  {isChecked ?
                    <div className="startDateoptions">
                      <div className="optionsReminder">
                        <div>
                          <label><b>Recurrying Type<span>*</span></b></label>
                          <select name="recurringType" onChange={handleField} value={handleInput.recurringType}>
                            <option></option>
                            <option value="PER_MINUTE">Per Minute</option>
                            <option value="PER_HOUR">Per Hour</option>
                            <option value="DAILY">Per Day</option>
                            <option value="MONTHLY">Per Week</option>
                            <option value="WEEKLY">Per Month</option>
                            <option value="YEARLY">Per Year</option>
                          </select>
                        </div>

                        <div>
                          <label><b>End Date & Time<span>*</span></b></label>
                          <input type="datetime-local" name="endDate" onChange={handleField} value={handleInput.endDate} />
                        </div>
                      </div>
                    </div> : ''}
                  </div>
                </div>
              </div>
              <div className="modal-footer user_addbtn">
                <button data-bs-dismiss="modal" aria-label="Close" onClick={submitForm} > Submit </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div className="modal fade" id="exampleModalToggleedit" aria-hidden="true" aria-labelledby="exampleModalToggleLabel" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title" id="exampleModalToggleLabel">Update Task</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close" onClick={closeModal}>x</button>
            </div>
            <div className="modal-body user_add">
              <div className="first_fields">
                <div className="form_input">
                  <label><b>Phone<span>*</span></b></label>
                  <input type="tel" name="phone" minLength="10" maxLength="10" onChange={updtHandle} value={updtInptHandle.phone} />
                </div>
                <div className="dateandtime">
                  <label><b>Set Date & Time<span>*</span></b></label>
                  <input type="datetime-local" name="scheduleTime" onChange={updtHandle} value={updtInptHandle.scheduleTime} />
                </div>
              </div>
              <div className="form_input">
                <label><b>Title<span>*</span></b></label>
                <input type="text" name="title" onChange={updtHandle} value={updtInptHandle.title} />
              </div>
              <div className="form_input">
                <label><b>Description<span>*</span></b></label>
                <textarea type="textarea" name="description" onChange={updtHandle} value={updtInptHandle.description} ></textarea>
              </div>

              <div className="form_input forreminddate">
                <div className="selectreminder">
                  {/* <input type="checkbox" /> */}
                  <input type="checkbox" checked={checkedIs} onChange={handleEditCheckboxChange} />
                </div>
                <div className="acitveBtn">
                    <input className='input-switch' type="checkbox" id="demo" checked={isActive} onChange={handleActiveChange}/>
                    <label className="label-switch" htmlFor="demo"></label>
                    <span className="info-text"></span>
                </div>
              </div>
              
              {checkedIs ?
                <div className="form_input forreminddate">
                <div className="selectreminder">
                  <div className="startDateoptions">
                    <div className="optionsReminder">
                      <div>
                        <label><b>Reminder Format<span>*</span></b></label>
                        <select name="recurringType" value={updtInptHandle.recurringType} onChange={updtHandle}>
                            <option></option>
                            <option value="PER_MINUTE">Per Minute</option>
                            <option value="PER_HOUR">Per Hour</option>
                            <option value="DAILY">Per Day</option>
                            <option value="MONTHLY">Per Week</option>
                            <option value="WEEKLY">Per Month</option>
                            <option value="YEARLY">Per Year</option>
                        </select>
                      </div>
                      <div>
                        <label><b>Start Date & Time<span>*</span></b></label>
                        <input type="datetime-local" name="endDate" onChange={updtHandle} value={updtInptHandle.endDate} />
                      </div>
                    </div>
                    </div>
                    </div>
                  </div> : ''
                  }
            </div>
            <div className="modal-footer user_addbtn">
              <button data-bs-dismiss="modal" aria-label="Close" onClick={updateData}> Update </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default TaskSchedule
