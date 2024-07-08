import React, { useState } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../App.css';

const TaskForm = ({ task, fetchTasks }) => {
  const [formData, setFormData] = useState(task || {
    title: '',
    status: '',
    assignedMembers: '',
    dueDate: '',
    isAssigned: false,
    estimatedHours: '',
    priority: ''
  });

  const statusOptions = ['Pending', 'In Progress', 'Completed'];
  const priorityOptions = ['Low', 'Medium', 'High'];
  const isAssignedOptions = ['true', 'false']; 
  const assignedMembersOptions = ['Team member 1', 'Team member 2', 'Team member 3', 'Team member 4'];

  const handleChange = (e) => {
    const { name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const validate = () => {
    if (!formData.title) {
      toast.error('Title is required');
      return false;
    }
    if (!formData.status) {
      toast.error('Status is required');
      return false;
    }
    if (!formData.assignedMembers) {
      toast.error('Assigned Members is required');
      return false;
    }
    if (!formData.dueDate) {
      toast.error('Due Date is required');
      return false;
    }
    if (!formData.priority) {
      toast.error('Priority is required');
      return false;
    }
    if (!formData.estimatedHours) {
      toast.error('Estimated Hours is required');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    if (task) {
      await axios.put(`http://localhost:5000/tasks/${task.id}`, formData);
    } else {
      await axios.post('http://localhost:5000/tasks', formData);
    }
    fetchTasks();
    toast.success('Task saved successfully!');
    setFormData({
      title: '',
      status: '',
      assignedMembers: '',
      dueDate: '',
      isAssigned: false,
      estimatedHours: '',
      priority: ''
    });
  };

  return (
    <>
      <ToastContainer position="bottom-right" />
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label>Task Title</label>
          <input
            name="title"
            value={formData.title}
            onChange={handleChange}
            type="text"
          />
        </div>
        <div className="form-group">
          <label>Status</label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
          >
            <option value="">Select Status</option>
            {statusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Assigned Members</label>
          <select
            name="assignedMembers"
            value={formData.assignedMembers}
            onChange={handleChange}
          >
            <option value="">Select Members</option>
            {assignedMembersOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Due Date</label>
          <input
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            type="date"
          />
        </div>
        <div className="form-group">
          <label>Is Assigned</label>
          <select
            name="isAssigned"
            value={formData.isAssigned.toString()}
            onChange={handleChange}
          >
            {isAssignedOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Estimated Hours</label>
          <input
            name="estimatedHours"
            value={formData.estimatedHours}
            onChange={handleChange}
            type="number"
          />
        </div>
        <div className="form-group">
          <label>Priority</label>
          <select
            name="priority"
            value={formData.priority}
            onChange={handleChange}
          >
            <option value="">Select Priority</option>
            {priorityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="button-container">
          <button type="submit">Save</button>
        </div>
      </form>
    </>
  );
};

export default TaskForm;
