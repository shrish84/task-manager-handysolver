import React, { useEffect, useState } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import "../App.css";

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [tempTaskData, setTempTaskData] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    id: "",
    title: "",
    status: "",
    assignedMembers: "",
    dueDate: "",
    isAssigned: "",
    estimatedHours: "",
    priority: "",
  });

  const fetchTasks = async () => {
    const res = await axios.get(
      `http://localhost:5000/tasks?_page=${page}&_limit=100`
    );
    setTasks(res.data);
  };

  useEffect(() => {
    fetchTasks();
  }, [page]);

  const moveTask = (dragIndex, hoverIndex) => {
    const updatedTasks = [...tasks];
    const [draggedTask] = updatedTasks.splice(dragIndex, 1);
    updatedTasks.splice(hoverIndex, 0, draggedTask);
    setTasks(updatedTasks);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/tasks/${id}`);
    fetchTasks();
  };

  const handleEditClick = (task) => {
    setEditingTaskId(task.id);
    setTempTaskData(task);
  };

  const handleCancelClick = () => {
    setEditingTaskId(null);
    setTempTaskData({});
  };

  const handleSaveClick = async () => {
    await axios.put(
      `http://localhost:5000/tasks/${editingTaskId}`,
      tempTaskData
    );
    fetchTasks();
    setEditingTaskId(null);
    setTempTaskData({});
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTempTaskData({
      ...tempTaskData,
      [name]:  value,
    });
  };

  const handleIdSearch = async (id) => {
    if (!id) {
      fetchTasks();
      return;
    }
    try {
      const res = await axios.get(`http://localhost:5000/tasks/${id}`);
      setTasks([res.data]);
    } catch (error) {
      console.error("Task not found");
      setTasks([]);
    }
  };

  const TaskRow = ({ task, index, moveTask }) => {
    const [, ref] = useDrag({
      type: "task",
      item: { index },
    });
    const [, drop] = useDrop({
      accept: "task",
      hover: (draggedItem) => {
        if (draggedItem.index !== index) {
          moveTask(draggedItem.index, index);
          draggedItem.index = index;
        }
      },
    });

    const isEditing = editingTaskId === task.id;

    return (
      <tr ref={(node) => ref(drop(node))}>
        {isEditing ? (
          <>
            <td>{task.id}</td>
            <td>
              <input
                name="title"
                value={tempTaskData.title}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <select
                name="status"
                value={tempTaskData.status}
                onChange={handleInputChange}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </td>
            <td>
              <select
                name="assignedMembers"
                value={tempTaskData.assignedMembers}
                onChange={handleInputChange}
              >
                <option value="Team member 1">Team member 1</option>
                <option value="Team member 2">Team member 2</option>
                <option value="Team member 3">Team member 3</option>
                <option value="Team member 4">Team member 4</option>
              </select>
            </td>
            <td>
              <input
                name="dueDate"
                type="date"
                value={tempTaskData.dueDate}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <select
                name="isAssigned"
                value={tempTaskData.isAssigned.toString()}
                onChange={handleInputChange}
              >
                <option value="True">True</option>
                <option value="False">False</option>
              </select>
            </td>
            <td>
              <input
                name="estimatedHours"
                type="number"
                value={tempTaskData.estimatedHours}
                onChange={handleInputChange}
              />
            </td>
            <td>
              <select
                name="priority"
                value={tempTaskData.priority}
                onChange={handleInputChange}
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </td>
            <td className="icons">
              <i onClick={handleSaveClick} class="fa-solid fa-check"></i>
              <i onClick={handleCancelClick} class="fa-solid fa-xmark"></i>
            </td>
          </>
        ) : (
          <>
            <td>{task.id}</td>
            <td>{task.title}</td>
            <td>{task.status}</td>
            <td>{task.assignedMembers}</td>
            <td>{task.dueDate}</td>
            <td>{task.isAssigned ? "True" : "False"}</td>
            <td>{task.estimatedHours}</td>
            <td>{task.priority}</td>
            <td className="icons">
              <i
                onClick={() => handleEditClick(task)}
                className="fas fa-edit"
              ></i>
              <i
                onClick={() => handleDelete(task.id)}
                className="fas fa-trash-alt"
              ></i>
            </td>
          </>
        )}
      </tr>
    );
  };

  const filteredTasks = tasks.filter((task) => {
    return Object.keys(filters).every((key) => {
      if (filters[key] === "") return true;
      if (key === "isAssigned") {
        return task[key] ? "True" === filters[key] : "False" === filters[key];
      } else {
        return task[key]
          .toString()
          .toLowerCase()
          .includes(filters[key].toLowerCase());
      }
    });
  });
  const totalPages = Math.ceil(filteredTasks.length / 10);

  const getPageNumbers = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={i === page ? "active" : "deactive"}
        >
          {i}
        </button>
      );
    }
    return pageNumbers;
  };
  return (
    <>
      <div className="main">
        <h1 className="heading">Task Management Table</h1>
      </div>
      <div className="container">
        <TaskForm task={null} fetchTasks={fetchTasks} />
        <div className="task-list">
          <DndProvider backend={HTML5Backend}>
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Task ID</th>
                    <th>Task Title</th>
                    <th>Status</th>
                    <th>Assigned Members</th>
                    <th>Due Date</th>
                    <th>Is Assigned</th>
                    <th>Estimated Hours</th>
                    <th>Priority</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      <input
                        value={filters.id}
                        onChange={(e) =>
                          setFilters({ ...filters, id: e.target.value })
                        }
                        placeholder="Search by task ID"
                        className="filter-input"
                        type="number"
                        onBlur={() => handleIdSearch(filters.id)}
                      />
                    </td>
                    <td>
                      <input
                        value={filters.title}
                        onChange={(e) =>
                          setFilters({ ...filters, title: e.target.value })
                        }
                        placeholder="Search by title"
                        className="filter-input"
                      />
                    </td>
                    <td>
                      <select
                        value={filters.status}
                        onChange={(e) =>
                          setFilters({ ...filters, status: e.target.value })
                        }
                        className="filter-dropdown"
                      >
                        <option value="">Search by status</option>
                        <option value="Not Started">Not Started</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td>
                      <select
                        value={filters.assignedMembers}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            assignedMembers: e.target.value,
                          })
                        }
                        className="filter-dropdown"
                      >
                        <option value="">Search by assigned member</option>
                        <option value="Member 1">Team Member 1</option>
                        <option value="Member 2">Team Member 2</option>
                        <option value="Member 3">Team Member 3</option>
                        <option value="Member 3">Team Member 4</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="date"
                        value={filters.dueDate}
                        onChange={(e) =>
                          setFilters({ ...filters, dueDate: e.target.value })
                        }
                        className="filter-input"
                      />
                    </td>
                    <td>
                      <select
                        value={filters.isAssigned}
                        onChange={(e) =>
                          setFilters({ ...filters, isAssigned: e.target.value })
                        }
                        className="filter-dropdown"
                      >
                        <option value="">Search by is assigned</option>
                        <option value="True">True</option>
                        <option value="False">False</option>
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={filters.estimatedHours}
                        onChange={(e) =>
                          setFilters({
                            ...filters,
                            estimatedHours: e.target.value,
                          })
                        }
                        placeholder="Search by estimated hours"
                        className="filter-input"
                      />
                    </td>
                    <td>
                      <select
                        value={filters.priority}
                        onChange={(e) =>
                          setFilters({ ...filters, priority: e.target.value })
                        }
                        className="filter-dropdown"
                      >
                        <option value="">Search by priority</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </td>
                  </tr>
                  {filteredTasks
                    .slice((page - 1) * 10, page * 10)
                    .map((task, index) => (
                      <TaskRow
                        key={task.id}
                        index={index}
                        task={task}
                        moveTask={moveTask}
                      />
                    ))}
                </tbody>
              </table>
            </div>
          </DndProvider>
          <div className="pagination">{getPageNumbers()}</div>
        </div>
      </div>
    </>
  );
};

export default TaskList;
