import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { ErasmusProgramItem } from "./ErasmusProgram";
import { useRouter } from "next/router";

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

export const UniversityPage = () => {
  const [university, setUniversity] = useState([]);
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");
  const router = useRouter();
  const id = router.query.id;

  useEffect(() => {
    const fetchUniversity = async () => {
      const response = await axios.get("/api/erasmus/universities", {
        params: {
          uId: id,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setUniversity(response.data?.university);
    };
    token && fetchUniversity();
  }, [token, id]);

  return <>{JSON.stringify(university)}</>;
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
