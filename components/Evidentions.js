import axios from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { v4 as uuid } from "uuid";
import { useRouter } from "next/router";
import { StudentInfo } from "./Application";

export default function EvidentionsPage() {
  const [erasmusPrograms, setErasmusPrograms] = useState([]);
  const [studentEvidentions, setStudentEvidentions] = useState([]);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;
  const role = useSelector((state) => state.auth.user?.role);

  useEffect(() => {
    if (!token) return;
    const fetchEvidentions = async () => {
      const res = await axios.get("/api/erasmus/evidentions", {
        headers: { Authorization: `Bearer ${token}` },
      });

      role == "coordinator" && setErasmusPrograms(res.data.erasmusPrograms);
    };

    fetchEvidentions();
  }, [token]);

  return (
    <div className="w-full ">
      {role == "coordinator" && (
        <CoordinatorEvidentions erasmusPrograms={erasmusPrograms} />
      )}
    </div>
  );
}

const CoordinatorEvidentions = ({ erasmusPrograms }) => {
  return (
    <div className="flex flex-col gap-4 border  p-4">
      {erasmusPrograms.map((program) => (
        <ProgramEvidentions program={program} key={uuid()} />
      ))}
    </div>
  );
};

const ProgramEvidentions = ({ program }) => {
  console.log(program.evidentions);
  return (
    <div className="flex flex-col gap-4 border p-4  ">
      <Link href={`erasmus/${program._id}`}>
        <div className="border p-4">
          <div className="hover:font-bold cursor-pointer">{program.name}</div>
          <div className="">
            {program.evidentions.length == 0 && <div>No evidentions</div>}
          </div>
        </div>
      </Link>
      {program.evidentions.length > 0 && (
        <div className="border p-4">
          {program.evidentions.map((evidention) => (
            <EvidentionItem evidention={evidention} key={uuid()} />
          ))}
        </div>
      )}
    </div>
  );
};

export const EvidentionItem = ({ programName, evidention }) => {
  return (
    <Link href={`evidentions/${evidention._id}`}>
      {" "}
      <div>
        <div className="cursor-pointer hover:font-bold pb-2">
          {evidention.student
            ? `Student ${evidention.student.user.name}`
            : `Professor ${evidention.professor.user.name}`}
        </div>
      </div>
    </Link>
  );
};

export const EvidentionPage = ({}) => {
  const router = useRouter();
  const { id } = router.query;
  const [evidention, setEvidention] = useState(null);
  const [loading, setLoading] = useState(true);
  const token =
    typeof window !== "undefined" ? localStorage.getItem("token") : null;

  useEffect(() => {
    if (!id || !token) return;
    const fetchEvidention = async () => {
      try {
        const res = await axios.get(`/api/erasmus/evidentions`, {
          params: {
            evId: id,
          },
          headers: { Authorization: `Bearer ${token}` },
        });
        setEvidention(res.data);
        console.log(res.data);
      } catch (error) {
        console.error("Failed to fetch evidention", error);
      } finally {
        setLoading(false);
      }
    };

    fetchEvidention();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (!evidention) return <div>No evidention found</div>;
  return (
    <div className="w-full">
      <div className="page-head ">Evidention</div>
      <div className="border flex flex-col gap-4 p-4">
        {evidention.student && <StudentInfo student={evidention.student} />}
        <div>
          {evidention.professor && (
            <>
              <strong>Professor:</strong> {evidention.professor.user.name}
            </>
          )}
          <div className="border p-4 flex flex-col justify-around">
            <h2 className="text-xl font-bold">Evidention Details</h2>
            <div>
              <strong>Program:</strong> {evidention.erasmus.name}{" "}
              <div>{evidention.erasmus.description}</div>
            </div>

            <div>
              <strong>Created At:</strong>{" "}
              {new Date(evidention.createdAt).toLocaleDateString()}
            </div>

            <div>
              <strong>Comment</strong> {evidention.comment}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const NewEvidention = () => {
  const blankEvidention = {
    comment: "",
    rating: 0,
  };
  const router = useRouter();
  const { aId } = router.query;
  const [application, setApplication] = useState(null);
  const [evidention, setEvidention] = useState(blankEvidention);
  const token = typeof window !== "undefined" && localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    const fetchApplication = async () => {
      const res = await axios.get(`/api/erasmus/applications`, {
        params: {
          id: aId,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setApplication(res.data.application.student.id);
      console.log(res.data.application);
      console.log({
        student: res.data.application.student?._id,
        professor: res.data.application.professor?.id,
        erasmus: res.data.application.erasmus.id,
      });
      setEvidention({
        ...evidention,
        student: res.data.application.student?._id,
        professor: res.data.application.professor?._id,
        erasmus: res.data.application.erasmus._id,
      });
    };

    fetchApplication();
  }, [aId]);

  const handleChange = (e) => {
    setEvidention({ ...evidention, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (!token) alert("no token");
    const res = await axios.post(`/api/erasmus/evidentions`, evidention, {
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log(res.data);
    alert("submitted evidention");
  };

  return (
    <div className="w-full flex flex-col gap-4">
      {JSON.stringify(evidention)}
      <div>
        <div>Comment</div>
        <textarea
          rows={5}
          className="w-full"
          name="comment"
          value={evidention.comment}
          onChange={handleChange}
          type="textarea"
          placeholder="comment"
        />
        <div>Rating</div>
        <input
          type="number"
          onChange={handleChange}
          name="rating"
          value={evidention.rating}
        />
        <div onClick={handleSubmit} className="button">
          Submit
        </div>
      </div>
    </div>
  );
};
