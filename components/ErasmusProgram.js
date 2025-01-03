import { useEffect } from "react";

const ErasmusPrograms = ({}) => {
    const erasmusPrograms = [
        {
        id: 1,
        month: "September",
        year: 2024,
        name: "Erasmus+",
        description: "Erasmus+ program for students",
        university: {
            name: "University of Warsaw",
        },
        },
        {
        id: 2,
        month: "October",
        year: 2024,
        name: "Erasmus+",
        description: "Erasmus+ program for students",
        university: {
            name: "University of Warsaw",
        },
        },
    ];

  return (
    <div>
      {erasmusPrograms.map((erasmusProgram, i) => (
        <ErasmusProgramItem
          key={erasmusProgram.id}
          erasmusProgram={erasmusProgram}
        />
      ))}
    </div>
  );
};

const ErasmusProgramItem = ({ erasmusProgram }) => {
  return (
    <>
      <div key={erasmusProgram.id}>
        <div>
          {erasmusProgram.month}/{erasmusProgram.year}
        </div>
        <div>{erasmusProgram.name}</div>
        <div>{erasmusProgram.description}</div>
        <div>{erasmusProgram.university?.name}</div>
      </div>
    </>
  );
};

export default ErasmusPrograms;
