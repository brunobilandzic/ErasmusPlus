import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";

const ApplicationsPage = () => {
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
  return <UserAplications />;
};

export const CoordinatorsApplications = ({ fetchedData }) => {
  const [programsApplications, setProgramsApplications] = useState(fetchedData);
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
    if (fetchedData) return;
    const fetchApplications = async () => {
      const response = await axios.get("/api/erasmus/applications", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setProgramsApplications(response.data?.universityProgramsApplications);
    };
    fetchApplications();
  }, [token]);

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

const CoordinatorErasmusApplications = ({
  name,
  description,
  month,
  year,
  applications,
  _id,
}) => {
  const [expandApplications, setExpandApplications] = useState(false);

  const toggleExpand = () => {
    setExpandApplications(!expandApplications);
  };

  return (
    <div className="border p-4">
      <Link href={`erasmus/${_id}`}>
        <div className="border p-4">
          <div>{name}</div>
          <div>{description}</div>
          <div>
            {month}/{year}
          </div>
        </div>
      </Link>
      <div className="button-no-m" onClick={toggleExpand}>
        <div>{applications.length} applications</div>
      </div>
      {expandApplications && (
        <div className="flex flex-col gap-4 border p-4">
          {applications.map((application) => (
            <CoordinatorErasmusApplication
              key={application._id}
              {...application}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const CoordinatorErasmusApplication = ({ _id, student, professor, status }) => {
  const username = student?.user?.name || professor?.user?.name;
  const role = student ? "student" : "professor";
  return (
    <Link href={`/applications/${_id}`}>
      <div className="cursor-pointer border p-4">
        <div>
          {role} - {username} - {status}
        </div>
      </div>
    </Link>
  );
};

export const ApplicationPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const [application, setApplication] = useState(null);
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    if (!id || !token) return;
    const fetchApplication = async () => {
      try {
        const response = await axios.get(`/api/erasmus/applications/`, {
          params: {
            id,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setApplication(response.data?.application);
      } catch (error) {
        console.log("error:", error.status);
        if (error.status === 401) {
          alert("Unauthorized");
          router.push("/login");
          return;
        }
      }
    };
    fetchApplication();
  }, [id, token]);

  if (!application) return <div>Loading...</div>;

  return (
    <>
      <div className="page-head">Application </div>
      <div className="border p-4 flex gap-4 flex-col">
        {!application && <div>Loading...</div>}
        {application && application.student && (
          <StudentInfo student={application.student} />
        )}
        {application && application.professor && (
          <ProfessorInfo professor={application.professor} />
        )}
        <ErasmusInfo erasmus={application.erasmus} />
        <ApplicationInfo
          status={application.status}
          comment={application.comment}
        />
        {role == "coordinator" && (
          <ApplicationActions application={application} />
        )}
      </div>
    </>
  );
};

const ProfessorInfo = ({ professor }) => {
  if (!professor) return null;

  return (
    <div className="professor-info border p-4 w-full">
      <h2 className="font-bold text-xl">Professor Information</h2>
      <div>Username: {professor.user.username}</div>
      <div>University: {professor.university.name}</div>
      <div>Applications: {professor.applications.length}</div>
    </div>
  );
};

export const StudentInfo = ({ student }) => {
  if (!student) return null;

  return (
    <div className="border p-4">
      <h2 className="font-bold text-xl">Student Information</h2>
      <div>Username: {student.user.username}</div>
      <div>Name: {student.user.name}</div>
      <div>University: {student.university.name}</div>
      <div>Grade Average: {student.grade_average}</div>
      <div>First Mobility: {student.first_mobility ? "Yes" : "No"}</div>
      <div>Motivation Letter Score: {student.motivation_letter_score}</div>
      <div>
        English Language Proficiency: {student.english_language_proficiency}
      </div>
      <div>
        Host Country Language Proficiency:{" "}
        {student.host_country_language_proficiency}
      </div>
      <div>
        Initiated LLP Agreement:{" "}
        {student.initiated_llp_agreement ? "Yes" : "No"}
      </div>
      <div>ESN Membership: {student.esn_membership ? "Yes" : "No"}</div>
      <div>Applications: {student.applications.length}</div>
    </div>
  );
};

const ApplicationInfo = ({ status, comment }) => {
  return (
    <div className=" border p-4 ">
      <div>{comment}</div>
      <div>{status}</div>
    </div>
  );
};

const ErasmusInfo = ({ erasmus }) => {
  if (!erasmus) return null;

  return (
    <div className="border p-4">
      <div className="font-bold">
        {erasmus.name} - {erasmus.month}/{erasmus.year}
      </div>
      <div></div>
      <div>{erasmus.description}</div>
    </div>
  );
};

const ApplicationActions = ({ application }) => {
  const router = useRouter();
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");
  const [status, setStatus] = useState(application?.status);

  const changeStatus = (e) => {
    setStatus(e.target.value);
  };

  useEffect(() => {
    console.log("changing status to:", application?.status);
    setStatus(application?.status);
  }, [application]);

  const sudmitStatus = async () => {
    if (!status) return;
    if (status == application.status) return;
    const response = await axios.put(
      `/api/erasmus/applications/`,
      { status },
      {
        params: { id: application._id },
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    console.log(response.data);
    alert("Status changed to", status);
  };
  return (
    <div className="w-full my-4">
      {application?.status != "rejected" && (
        <div className="flex flex-col gap-4">
          <select
            className="select"
            defaultValue={application?.status}
            onChange={changeStatus}>
            {["pending", "accepted", "rejected"].map((stat) => (
              <option key={stat} value={stat}>
                {stat}
              </option>
            ))}
          </select>
          <button className="button-no-m" onClick={sudmitStatus}>
            Change Status
          </button>
        </div>
      )}
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
      <NewApplicationButton />
      <ApplicationList applications={applications} />
    </div>
  );
};

export const ApplicationList = ({ applications }) => {
  return (
    <div className="flex flex-col gap-4">
      {applications?.map((application) => (
        <ApplicationItem key={application._id} {...application} />
      ))}
    </div>
  );
};

export const ApplicationItem = ({ status, comment, erasmus, _id }) => {
  const { name: progName, month, year, university, description } = erasmus;

  return (
    <Link href={`/applications/${_id}`}>
      <div className="cursor-pointer border p-4">
        <div className="mb-2">
          <div className="font-bold">
            {year}/{month}
          </div>
          <div className="text-lg font-bold ">{university?.name}</div>
          <div>{university?.location}</div>
          <i>{progName}</i>
          <i>{description}</i>
        </div>
        <div>
          <div>{comment}</div>
          <div>{status}</div>
        </div>
      </div>
    </Link>
  );
};

const NewApplicationButton = () => {
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
  const [application, setApplication] = useState({ ...blankApplication });
  const router = useRouter();

  useEffect(() => {
    if (!user || !role) {
      router.push("/login");
    } else
      setApplication({
        ...application,
        [role]: user[role]._id,
      });
  }, [user, role]);

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
    const { erasmusId } = router.query;
    if (erasmusId) {
      setApplication({
        ...application,
        erasmus: erasmusId,
        [role]: user[role]._id,
      });
    }
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

export default ApplicationsPage;
