"use client"; // This is a client component
import React, { useEffect } from "react";
import axios from "axios";
export default function Page() {
  useEffect(() => {
    async function retriveProjectDetail() {
      try {
        const storedToken = localStorage.getItem("token");

        if (storedToken) {
          // Set the token in the Axios header
          axios.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
        }
        const response = await axios.get(`http://127.0.0.1:8000/api/tasks`);
        console.log(response);
      } catch (error) {}
    }

    retriveProjectDetail();
  }, []);
  return <div>Welcome</div>;
}
