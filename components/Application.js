import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

const ApplicationPage = () => {
  const role = useSelector((state) => state.auth.user?.role);
  const router = useRouter();

  useEffect(() => {
    if (!role) {
      router.push("/login");
    }
  }, [role]);

  if (role === "coordinator") {
    return <CoordinatorsApplications />;
  }
};

const CoordinatorsApplications = () => {
  const [programsApplications, setProgramsApplications] = useState([]);
  const router = useRouter();
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
  }, []);
  useEffect(() => {
    const fetchApplications = async () => {
      const response = await axios.get("/api/erasmus/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgramsApplications(response.data?.universityProgramsApplications);
    };
    fetchApplications();
  }, []);

  return (
    <div>
      <div className="grid grid-cols-1 gap-4">
        {programsApplications?.map((program) => (
          <CoordinatorErasmusApplications key={program._id} {...program} />
        ))}
      </div>
    </div>
  );
};
const UserAplications = () => {
  const [applications, setApplications] = useState([]);
  const router = useRouter();
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  useEffect(() => {
    if (!token) {
      router.push("/login");
      return;
    }
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
      <NewApplication />
      <div className="flex flex-col gap-4">
        {applications?.map((application) => (
          <UserApplicationItem key={application._id} {...application} />
        ))}
      </div>
    </div>
  );
};

const UserApplicationItem = ({ status, comment, erasmus }) => {
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

const CoordinatorErasmusApplications = ({
  name,
  description,
  month,
  year,
  applications,
  _id,
}) => {
  return (
    <Link href={`erasmus/${_id}`}>
      <div className="border p-4">
        <div>{name}</div>
        <div>{description}</div>
        <div>
          {month}/{year}
        </div>
        {applications.length} applications
      </div>
    </Link>
  );
};
const NewApplication = () => {
  const router = useRouter();

  return (
    <div
      className="button"
      onClick={() => {
        router.push("applications/new");
      }}>
      New Application
    </div>
  );
};

export const ApplicationForm = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.user?.role);
  const [availableErasmus, setAvailableErasmus] = useState([]);
  const [application, setApplication] = useState(blankApplication);

  useEffect(() => {
    const fetchErasmus = async () => {
      const response = await axios.get("/api/erasmus/programs", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setAvailableErasmus(response.data?.erasmusPrograms);
      console.log(response.data?.erasmusPrograms);
    };
    fetchErasmus();
  }, []);

  useEffect(() => {
    if (!user || !role || !user[role]) return;

    setApplication({
      ...application,
      [role]: user[role]._id,
    });
  }, [user, role]);

  useEffect(() => {
    if (!availableErasmus.length) return;
    setApplication({
      ...application,
      erasmus: availableErasmus[0].programs[0]._id,
    });
  }, [availableErasmus]);

  if (!["student", "professor"].includes(role)) return null;

  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(`submitting application:`, application);
    const response = await axios.post(
      "/api/erasmus/applications",
      application,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    console.log("response:\n", response.data);
    setApplication({
      ...blankApplication,
      [role]: user[role]._id,
    });
    alert("Application submitted");
  };

  const handleSelectChange = (e) => {
    setApplication({
      ...application,
      erasmus: e.target.value,
    });
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div>{getApplicationDescription(availableErasmus)}</div>
      <SelectErasmus
        application={application}
        availableErasmus={availableErasmus}
        handleSelectChange={handleSelectChange}
      />

      <ApplicationFields
        application={application}
        handleChange={handleChange}
      />
      <div className="button" onClick={handleSubmit}>
        Submit application
      </div>
    </div>
  );
};

const SelectErasmus = ({
  availableErasmus,
  application,
  handleSelectChange,
}) => {
  return (
    <select value={application.erasmus} onChange={handleSelectChange}>
      {availableErasmus.map((uni) => (
        <optgroup key={uni._id} label={uni.university.name}>
          {uni.programs.map((prog) => (
            <option key={prog._id} value={prog._id}>
              {getDescription(uni.university.name, prog)}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  );
};

const ApplicationFields = ({ application, handleChange }) => {
  return (
    <div className="w-full">
      <textarea
        className="w-full"
        rows={5}
        placeholder="comment"
        type="text"
        name="comment"
        value={application.comment}
        onChange={handleChange}
      />
    </div>
  );
};

const getDescription = (uniName, erasmus) => {
  return `${uniName} - ${erasmus.name} - ${erasmus.month}/${erasmus.year}`;
};

const getApplicationDescription = (availableErasmus) => {
  return `You can choose between ${
    availableErasmus.length
  } universities and their 
        ${availableErasmus.reduce(
          (acc, curr) => acc + curr.programs.length,
          0
        )} 
        programs`;
};

const blankApplication = {
  erasmus: "",
  comment: "",
};

export default ApplicationPage;
