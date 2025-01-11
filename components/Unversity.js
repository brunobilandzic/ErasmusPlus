import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { ErasmusProgramItem } from "./ErasmusProgram";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import Link from "next/link";
import {  CoordinatorsApplications } from "./Application";

export default function AllUniversityPage() {
  const [showUserCompatible, setShowUserCompatible] = useState(true);
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");
  const [universities, setUniversities] = useState([]);
  const [allUniversities, setAllUniversities] = useState([]);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const handleChange = (e) => {
    setSelectedUniversity(e.target.value);
  };

  const handleSearch = (e) => {
    setSelectedUniversity(e.target.value);
    if (e.target.value === "all") {
      fetchUniversities();
      return;
    }
    const filteredUniversities = allUniversities.filter(
      (university) => university._id === e.target.value
    );
    setUniversities(filteredUniversities);
  };
  const fetchUniversities = async () => {
    const response = await axios.get("/api/erasmus/universities");
    setUniversities(response.data?.universities);
  };

  const getAllUniversities = async () => {
    const response = await axios.get("/api/erasmus/universities");
    setAllUniversities(response.data?.universities);
  };

  useEffect(() => {
    fetchUniversities();
    getAllUniversities();
  }, []);

  return (
    <div className=" ">
      <div>
        {!showUserCompatible && (
          <select
            onChange={handleSearch}
            value={selectedUniversity}
            className="select">
            <option value="all">All</option>
            {allUniversities.map((university) => {
              return (
                <option key={uuid()} value={university._id}>
                  {university.name}
                </option>
              );
            })}
          </select>
        )}
      </div>
      {token && (
        <>
          <ToggleCompatible
            showUserCompatible={showUserCompatible}
            setShowUserCompatible={setShowUserCompatible}
          />
          <div className="info">
            Showing {showUserCompatible ? "compatible" : "all"} universities
          </div>
        </>
      )}
      {token && showUserCompatible ? (
        <CompatibleUniversities token={token} />
      ) : (
        <Universities universities={universities} />
      )}
    </div>
  );
}

const Heading = ({ role, name }) => {
  return (
    <div className="flex flex-col items-center mb-4">
      <div className="page-head ">My University</div>
      <div className="info">
        {name}- acting as {role}
      </div>
    </div>
  );
};
export const UniversityPage = () => {
  const [university, setUniversity] = useState(null);
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");
  const router = useRouter();
  const id = router.query.id;
  const [applications, setApplications] = useState([]);
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    const fetchUniversity = async () => {
      const response = await axios.get("/api/erasmus/universities", {
        params: {
          uId: id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setUniversity(response.data?.university);
      setApplications(response.data?.applications);
    };
    token && fetchUniversity();
  }, [token, id]);

  if (!university) return <div>Loading...</div>;

  return (
    <>
      <Heading name={university.name} role={role} />
      <UniversityInfo university={university} />
      {role == "coordinator" && <Applications applications={applications} />}
    </>
  );
};

const Applications = ({ applications }) => {
  return (
    <div className="border p-4 mt-4 w-full">
      <div className="font-bold text-center mb-4">Applications</div>
      <CoordinatorsApplications fetchedData={applications} />
    </div>
  );
};

const UniversityInfo = ({ university }) => {
  if (!university) return null;
  console.log(university.students?.length);
  return (
    <div className=" border p-4 w-full">
      <div className="mb-8">
        <div className="font-bold">{university.name}</div>
        <div>Location: {university.location}</div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="border p-4 ">
          Students:
          <ul className="mt-4 grid grid-cols-2">
            {university.students.map((student) => (
              <li key={student._id}>{student.user.name}</li>
            ))}
          </ul>
        </div>
        <div className="border p-4 ">
          Professors:
          <ul className="mt-4">
            {university.professors.map((professor) => (
              <li key={professor._id}>{professor.user.name}</li>
            ))}
          </ul>
        </div>
        <div className="border p-4 ">
          Erasmus Programs:
          <ul className="mt-4">
            {university.erasmusPrograms.map((program) => (
              <Link
                className="cursor-pointer hover:text-gray-200"
                key={program._id}
                href={`/erasmus/${program._id}`}>
                <li key={program._id}>{program.name}</li>
              </Link>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

const ToggleCompatible = ({ showUserCompatible, setShowUserCompatible }) => {
  return (
    <div
      className="button"
      onClick={() => setShowUserCompatible(!showUserCompatible)}>
      {showUserCompatible
        ? "Show All Universities"
        : "Show Compatible Universities"}
    </div>
  );
};

function Universities({ universities }) {
  return (
    <div className="">
      {universities?.map((universityPrograms) => (
        <ErasmusProgramItem
          key={uuid()}
          universityPrograms={{
            university: universityPrograms,
            programs: universityPrograms.erasmusPrograms,
          }}
        />
      ))}
    </div>
  );
}

export const CompatibleUniversities = ({ uId, token }) => {
  const [university, setUniversity] = useState([]);

  useEffect(() => {
    const fetchUniversity = async () => {
      const response = await axios.get("/api/erasmus/universities", {
        params: {
          uId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniversity(response.data?.university);
    };
    fetchUniversity();
  }, [token]);

  return (
    <div className="">
      {university?.compatibleUniversities?.map((universityPrograms) => (
        <ErasmusProgramItem
          key={uuid()}
          universityPrograms={{
            university: universityPrograms,
            programs: universityPrograms.erasmusPrograms,
          }}
        />
      ))}
    </div>
  );
};
