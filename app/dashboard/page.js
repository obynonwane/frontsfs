"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({
    title: "",
    description: "",
    severity: "",
  });
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    startDate: null,
    endDate: null,
    severity: "Low",
  });

  useEffect(() => {
    async function retrieveProjectDetail() {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }

        const response = await axios.get(
          "https://sfsapi-f7a49b940304.herokuapp.com/api/tasks"
        );
        const listOfTasks = response.data.tasks;
        setTasks(listOfTasks);
      } catch (error) {
        setError(error);
        handleLogout();
      }
    }

    retrieveProjectDetail();
  }, []);

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(
        `https://sfsapi-f7a49b940304.herokuapp.com/api/tasks/${taskId}`
      );
      if (response.status === 200) {
        // Remove the deleted task from the tasks state
        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleEdit = (taskId) => {
    const taskToEdit = tasks.find((task) => task.id === taskId);
    if (taskToEdit) {
      setEditingTaskId(taskId);
      setEditedTask({
        title: taskToEdit.title,
        description: taskToEdit.description,
        severity: taskToEdit.severity,
        startDate: taskToEdit.start_date,
        endDate: taskToEdit.end_date,
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `https://sfsapi-f7a49b940304.herokuapp.com/api/tasks/${editingTaskId}`,
        editedTask
      );
      if (response.status === 200) {
        // Update the edited task in the tasks state
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === editingTaskId
              ? {
                  ...task,
                  title: editedTask.title,
                  description: editedTask.description,
                  severity: editedTask.severity,
                }
              : task
          )
        );
        setEditingTaskId(null);
        setEditedTask({ title: "", description: "", severity: "" });
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleCreate = async () => {
    if (newTask.title.trim() === "") {
      setError("Task title cannot be empty.");
      return;
    }

    if (newTask.description.trim() === "") {
      setError("Task description cannot be empty.");
      return;
    }

    if (newTask.severity === "") {
      setError("Please select a severity for the task.");
      return;
    }

    if (newTask.startDate === null) {
      setError("Please enter a start date for the task.");
      return;
    }

    if (newTask.endDate === null) {
      setError("Please enter an end date for the task.");
      return;
    }
    try {
      const response = await axios.post(
        "https://sfsapi-f7a49b940304.herokuapp.com/api/tasks",
        newTask
      );
      if (response.status === 201) {
        // Add the created task to the tasks state
        const createdTask = response.data.task;
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTask({
          title: "",
          description: "",
          startDate: null,
          endDate: null,
          severity: "Low",
        });
      }
      setError("");
    } catch (error) {
      setError(error);
    }
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  // if (error) {
  //   // Handle error case here
  //   return <div>Error occurred: {error.message}</div>;
  // }

  return (
    <div className="relative overflow-x-auto mx-20 mt-5">
      <nav className="py-10 mb-12 flex justify-between">
        <h1 className="text-xl font-burtons dark:text-white">SFS Finance</h1>
      </nav>
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 text-white bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
      <div className="mb-4">
        {error && <p className="text-red-500 text-xs italic">{error}</p>}

        <input
          type="text"
          value={newTask.title}
          onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
          placeholder="Enter task title"
          className="border-2 border-gray-300 rounded px-4 py-2 mr-2"
        />
        <input
          type="text"
          value={newTask.description}
          onChange={(e) =>
            setNewTask({ ...newTask, description: e.target.value })
          }
          placeholder="Enter task description"
          className="border-2 border-gray-300 rounded px-4 py-2 mr-2"
        />
        <select
          value={newTask.severity}
          onChange={(e) => setNewTask({ ...newTask, severity: e.target.value })}
          className="border-2 border-gray-300 rounded px-4 py-2 mr-2"
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>
        <input
          type="date"
          value={newTask.startDate}
          onChange={(e) =>
            setNewTask({ ...newTask, startDate: e.target.value })
          }
          placeholder="Start Date"
          className="border-2 border-gray-300 rounded px-4 py-2 mr-2"
        />
        <input
          type="date"
          value={newTask.endDate}
          onChange={(e) => setNewTask({ ...newTask, endDate: e.target.value })}
          placeholder="End Date"
          className="border-2 border-gray-300 rounded px-4 py-2 mr-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </div>
      {/* Display message if no tasks */}
      {tasks.length === 0 && <p>No tasks available.</p>}
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              ID
            </th>
            <th scope="col" className="px-6 py-3">
              Task
            </th>
            <th scope="col" className="px-6 py-3">
              Description
            </th>
            <th scope="col" className="px-6 py-3">
              Severity
            </th>
            <th scope="col" className="px-6 py-3">
              Start Date
            </th>
            <th scope="col" className="px-6 py-3">
              End Date
            </th>
            <th scope="col" className="px-6 py-3">
              Edit
            </th>
            <th scope="col" className="px-6 py-3">
              Delete
            </th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr
              key={task.id}
              className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
            >
              <th
                scope="row"
                className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
              >
                {task.id}
              </th>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTask.title}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, title: e.target.value })
                    }
                    className="border-2 border-blue-500"
                  />
                ) : (
                  task.title
                )}
              </td>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <input
                    type="text"
                    value={editedTask.description}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        description: e.target.value,
                      })
                    }
                    className="border-2 border-blue-500"
                  />
                ) : (
                  task.description
                )}
              </td>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <select
                    value={editedTask.severity}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, severity: e.target.value })
                    }
                    className="border-2 border-blue-500"
                  >
                    <option value="Low">Low</option>
                    <option value="Medium">Medium</option>
                    <option value="High">High</option>
                  </select>
                ) : (
                  task.severity
                )}
              </td>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <input
                    type="date"
                    value={editedTask.startDate}
                    onChange={(e) =>
                      setEditedTask({
                        ...editedTask,
                        startDate: e.target.value,
                      })
                    }
                    className="border-2 border-blue-500"
                  />
                ) : (
                  task.start_date
                )}
              </td>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <input
                    type="date"
                    value={editedTask.endDate}
                    onChange={(e) =>
                      setEditedTask({ ...editedTask, endDate: e.target.value })
                    }
                    className="border-2 border-blue-500"
                  />
                ) : (
                  task.end_date
                )}
              </td>
              <td className="px-6 py-4">
                {editingTaskId === task.id ? (
                  <button
                    onClick={handleSave}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(task.id)}
                    className="bg-blue-500 text-white px-2 py-1 rounded"
                  >
                    Edit
                  </button>
                )}
              </td>
              <td className="px-6 py-4">
                <button
                  onClick={() => handleDelete(task.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
