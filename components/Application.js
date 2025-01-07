import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const Applications = () => {
  const [applications, setApplications] = useState([]);

  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  useEffect(() => {
    const fetchApplications = async () => {
      const response = await axios.get("/api/erasmus/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setApplications(response.data?.applications);
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {applications.map((application) => (
          <ApplicationItem key={application._id} {...application} />
        ))}
      </div>
      <NewApplication />
    </div>
  );
};

const ApplicationItem = ({ status, comment, erasmus }) => {
  const { name: progName, month, year, university, description } = erasmus;

  return (
    <div className="border p-4">
      <div className="mb-2">
        <div className="font-bold">
          {year}/{month}
        </div>
        <div className="text-lg font-bold ">{university.name}</div>
        <div>{university.location}</div>
        <i>{progName}</i>
        <i>{description}</i>
      </div>
      <div>
        <div>{comment}</div>
        <div>{status}</div>
      </div>
    </div>
  );
};

const NewApplication = () => {
  const router = useRouter();

  return (
    <div
      onClick={() => {
        router.push("applications/new");
      }}>
      New Application
    </div>
  );
};
export default Applications;
