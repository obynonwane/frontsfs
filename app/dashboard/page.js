"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Page() {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [editedTask, setEditedTask] = useState({ title: "", description: "" });
  const [newTask, setNewTask] = useState({ title: "", description: "" });

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
      });
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.put(
        `http://127.0.0.1:8000/api/tasks/${editingTaskId}`,
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
                }
              : task
          )
        );
        setEditingTaskId(null);
        setEditedTask({ title: "", description: "" });
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleCreate = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/tasks",
        newTask
      );
      if (response.status === 201) {
        // Add the created task to the tasks state
        const createdTask = response.data.task;
        setTasks((prevTasks) => [...prevTasks, createdTask]);
        setNewTask({ title: "", description: "" });
      }
    } catch (error) {
      setError(error);
    }
  };

  const handleLogout = () => {
    // Clear the token from localStorage and redirect to the login page
    localStorage.removeItem("token");
    window.location.href = "/";
  };

  if (error) {
    // Handle error case here
    return <div>Error occurred: {error.message}</div>;
  }

  return (
    <div className="relative overflow-x-auto mx-20">
      <button
        onClick={handleLogout}
        className="absolute top-4 right-4 text-white bg-red-600 px-4 py-2 rounded"
      >
        Logout
      </button>
      <div className="mb-4">
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
        <button
          onClick={handleCreate}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Create Task
        </button>
      </div>
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
                  className="text-red-600"
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
