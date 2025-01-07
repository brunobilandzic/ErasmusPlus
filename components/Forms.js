import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

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
