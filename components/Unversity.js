import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";
import axios from "axios";
import { ErasmusProgramItem } from "./ErasmusProgram";

export default function UniversityPage() {
  const [showUserCompatible, setShowUserCompatible] = useState(true);
  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  return (
    <div className=" ">
      {token && (
        <>
          <ToggleCompatible
            showUserCompatible={showUserCompatible}
            setShowUserCompatible={setShowUserCompatible}
          />
          <div className="text-sm text-gray-500 mb-4">
            Showing {showUserCompatible ? "compatible" : "all"} universities
          </div>
        </>
      )}
      {token && showUserCompatible ? (
        <CompatibleUniversities token={token} />
      ) : (
        <Universities />
      )}
    </div>
  );
}

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

function Universities() {
  const [universities, setUniversities] = useState([]);

  useEffect(() => {
    const fetchUniversities = async () => {
      const response = await axios.get("/api/erasmus/universities");
      setUniversities(response.data?.universities);
    };
    fetchUniversities();
  }, []);
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
      console.log(response.data?.university);
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
