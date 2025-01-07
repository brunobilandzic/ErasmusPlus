import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import axios from "axios";

export const ApplicationForm = () => {
  const user = useSelector((state) => state.auth.user);
  const role = useSelector((state) => state.auth.user.role);
  const [availableErasmus, setAvailableErasmus] = useState([]);

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
  const [application, setApplication] = useState({
    erasmus: "",
    comment: "",
  });

  useEffect(() => {
    if (!user || !role) return;
    setApplication({
      ...application,
      [role]: user[role]._id,
    });
  }, [user, role]);

  if (!["student", "professor"].includes(role)) return null;

  const handleChange = (e) => {
    setApplication({
      ...application,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(application);
  };

  return (
    <div className="w-full flex flex-col items-center gap-4">
      <div>{getApplicationDescription(availableErasmus)}</div>
      <SelectErasmus availableErasmus={availableErasmus} />

      <ApplicationFields
        application={application}
        handleChange={handleChange}
      />
      <div onClick={handleSubmit}>submit</div>
    </div>
  );
};

const SelectErasmus = ({ availableErasmus }) => {
  return (
    <select>
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
