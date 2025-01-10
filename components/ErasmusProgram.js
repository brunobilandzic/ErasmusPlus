import axios from "axios";
import Link from "next/link";
import { notFound } from "next/navigation";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";

const ErasmusPrograms = ({}) => {
  const [erasmusPrograms, setErasmusPrograms] = useState([]);
  const [message, setMessage] = useState("");
  const user = useSelector((state) => state.auth.user);
  const [allErasmusPrograms, setAllErasmusPrograms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  let role, uId;

  if (user) {
    role = user.role;
    uId = user[role]?.university;
  }

  const token =
    typeof window != "undefined" && window.localStorage.getItem("token");

  useEffect(() => {
    const fetchErasmusPrograms = async () => {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs", {
        headers: { Authorization: `Bearer ${token}` },
      });

      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    };
    fetchErasmusPrograms();
  }, [uId]);

  const toggleAll = async () => {
    const isAll = !allErasmusPrograms;
    setAllErasmusPrograms(isAll);

    if (isAll) {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs");
      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    } else {
      setIsLoading(true);
      const response = await axios.get("/api/erasmus/programs", {
        params: {
          uId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setErasmusPrograms(response.data?.erasmusPrograms);
      setMessage(response.data?.message);
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div>
          {user && (
            <div onClick={toggleAll} className="button">
              {allErasmusPrograms
                ? "Show university programs"
                : "Show all programs"}
            </div>
          )}

          <div className="info">
            showing {message}{" "}
            <div>
              {erasmusPrograms?.reduce(
                (totalLength, universityPrograms) =>
                  totalLength + universityPrograms.programs.length,
                0
              )}{" "}
              programs {erasmusPrograms?.length} universities
            </div>
          </div>
          <div className="">
            {erasmusPrograms?.map((universityPrograms, i) => (
              <ErasmusProgramItem
                key={uuid()}
                universityPrograms={universityPrograms}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const ErasmusProgramItem = ({ universityPrograms }) => {
  const { university, programs } = universityPrograms;
  return (
    <div className="border  p-4 w-full mb-6">
      <div className="mb-2">
        <div className="text-lg font-bold ">{university?.name}</div>
        <div>{university?.location}</div>
      </div>

      <div className="flex flex-col gap-2">
        {programs?.map((erasmusProgram, i) => (
          <Link key={uuid()} href={`/erasmus/${erasmusProgram._id}`}>
            <div key={uuid()} className="border-b cursor-pointer p-4">
              <div className="">
                {erasmusProgram.month}/{erasmusProgram.year}{" "}
                {erasmusProgram.name}
              </div>
              <div>visit</div> <div>{erasmusProgram.description}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const ErasmusProgram = () => {
  const router = useRouter();
  const { id } = router.query;
  const role = useSelector((state) => state.auth.user?.role);
  const [erasmusProgram, setErasmusProgram] = useState(null);

  useEffect(() => {
    console.log("Erasmus Program:", erasmusProgram);
  }, [erasmusProgram]);

  const fetchErasmusProgram = async () => {
    const response = await axios.get("/api/erasmus/programs", {
      params: {
        eId: id,
      },
    });
    if (!response.data?.erasmusProgram) {
      notFound();
    }
    setErasmusProgram(response.data?.erasmusProgram);
  };

  useEffect(() => {
    if (id) {
      fetchErasmusProgram();
    }
  }, [id]);

  if (!erasmusProgram) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="text-center my-5 text-xl font-bolder">Erasmus Info:</div>
      <div className="border p-4">
        <div>Erasmus Program {erasmusProgram.name}</div>
        <div>
          {erasmusProgram.year}/{erasmusProgram.month}
        </div>
        <i>{erasmusProgram.description}</i>
      </div>
      <div>
        <div className="text-center my-5 text-xl font-bolder">
          University Info:
        </div>
        <div className="border p-4">
          <div>
            {erasmusProgram.university.name},{" "}
            {erasmusProgram.university.students.length} students and{" "}
            {erasmusProgram.university.professors.length} professors.
          </div>
          <div>{erasmusProgram.university.location}</div>
          <div>
            <div>
              Coordinator is {erasmusProgram.university.coordinator.user.name}
            </div>
          </div>
        </div>
      </div>
      {role == "coordinator" && (
        <>
          <div className="text-center my-5 text-xl font-bolder">
            Applications:
          </div>
          <div className="border p-4">
            <div>{erasmusProgram.applications.length} applications</div>
          </div>
        </>
      )}
    </div>
  );
};

export default ErasmusPrograms;
