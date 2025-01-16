import React, { useContext, useEffect, useMemo, useState } from "react";
import { FaTrashAlt } from "react-icons/fa";
import Card from "components/card";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import StudentResultsTable from "./StudentResultTable"; // Import the StudentResultsTable component
import { AuthContext } from "components/Auth-context";
import { message } from "antd";
import { useNavigate } from "react-router-dom";

const TestsTable = () => {
  const [selectedStudent, setSelectedStudent] = useState(null); // Track the selected student for viewing results
  const [selectedTest, setSelectedTest] = useState(null); // Track the selected student for viewing results
  const [showResultPage, setShowResultPage] = useState(false);
  const [scores, setScores] = useState([]);
  const [tests, setTests] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedTestId, setSelectedTestId] = useState(null); // Track the selected testId
  const navigate = useNavigate();
  const auth = useContext(AuthContext);

  useEffect(() => {
    const fetchScores = async () => {
      try {
        // Fetch the student information
        const studentsResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/student/get/all/students`
        );
        if (!studentsResponse.ok) {
          throw new Error(`HTTP error! Status: ${studentsResponse.status}`);
        }
        const studentsData = await studentsResponse.json();
        setStudents(studentsData.students);

        // Fetch the scores for the authenticated user (assuming it's the same as the student)
        const scoreResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/score/get/all/scores`
        );
        if (!scoreResponse.ok) {
          throw new Error(`HTTP error! Status: ${scoreResponse.status}`);
        }
        const scoreData = await scoreResponse.json();

        // Filter scores based on studentId
        const filteredScores = scoreData.scores.filter((score) =>
          studentsData.students.find(
            (student) => student.studentId === score.studentId
          )
        );

        // Append student details to each score
        const scoresWithStudentDetails = filteredScores.map((score) => {
          const student = studentsData.students.find(
            (student) => student.studentId === score.studentId
          );
          return {
            ...score,
            firstName: student.firstName,
            lastName: student.lastName,
            studentId: student.studentId,
          };
        });

        setScores(scoresWithStudentDetails);

        // Fetch all tests
        const testResponse = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/api/beta/test/get/all/tests`
        );
        if (!testResponse.ok) {
          throw new Error(`HTTP error! Status: ${testResponse.status}`);
        }
        const testData = await testResponse.json();
        setTests(testData.tests);
      } catch (err) {
        message.error("Error fetching scores and tests:", err.message);
      }
    };
    fetchScores();
  }, []);

  const handleViewResults = (testId, questionPaperId) => {
    navigate(`result-page/${testId}/${questionPaperId}`);
  };

  const handleTestSelect = (event) => {
    setSelectedTestId(event.target.value);
  };

  const filteredScores = useMemo(() => {
    if (!selectedTestId) return scores;
    return scores.filter((score) => score.testId === selectedTestId);
  }, [scores, selectedTestId]);

  const data = useMemo(() => {
    return filteredScores.map((score) => ({
      testId: score.testId,
      studentId: score.studentId,
      firstName: score.firstName,
      lastName: score.lastName,
      marks: score.marks,
      maxscore: score.maxscore,
      viewButton: (
        <button
          className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
          onClick={() => handleViewResults(score.testId, score.questionPaperId)}
        >
          View
        </button>
      ),
    }));
  }, [filteredScores]);
  console.log(filteredScores);

  const columns = useMemo(
    () => [
      {
        Header: "Test Id",
        accessor: "testId",
      },
      {
        Header: "Student Id",
        accessor: "studentId",
      },
      {
        Header: "First Name",
        accessor: "firstName",
      },
      {
        Header: "Last Name",
        accessor: "lastName",
      },
      {
        Header: "Marks",
        accessor: "marks",
      },

      {
        Header: "Max marks",
        accessor: "maxscore",
      },
      // {
      //   Header: "Date",
      //   accessor: "date",
      // },
      // {
      //   Header: "View",
      //   accessor: "viewButton",
      //   Cell: ({ row }) => (
      //     <button
      //       className="rounded-full bg-blue-500 px-4 py-2 text-white hover:bg-blue-700"
      //       onClick={() =>
      //         handleViewResults(
      //           row.original.testId,
      //           row.original.questionPaperId
      //         )
      //       }
      //     >
      //       View
      //     </button>
      //   ),
      // },
    ],
    []
  );

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = tableInstance;

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <>
        {showResultPage ? (
          <StudentResultsTable
            student={selectedStudent}
            test={selectedTest}
            setShowResultPage={setShowResultPage}
          />
        ) : (
          <>
            <header className="relative flex items-center justify-between">
              <div className="text-xl font-bold text-navy-700 dark:text-white">
                Tests Results
              </div>
              <div>
                <select onChange={handleTestSelect} value={selectedTestId}>
                  <option value="">All Tests</option>
                  {tests.map((test) => (
                    <option key={test.testId} value={test.testId}>
                      {test.testId}
                    </option>
                  ))}
                </select>
              </div>
            </header>
            <div>
              <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
                <table {...getTableProps()} className="w-full">
                  <thead>
                    {headerGroups.map((headerGroup, index) => (
                      <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                        {headerGroup.headers.map((column, index) => (
                          <th
                            {...column.getHeaderProps(
                              column.getSortByToggleProps()
                            )}
                            key={index}
                            className="border-b border-gray-200 pb-[10px] pr-14 text-start dark:!border-navy-700"
                          >
                            <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
                              {column.render("Header")}
                            </div>
                          </th>
                        ))}
                      </tr>
                    ))}
                  </thead>
                  <tbody {...getTableBodyProps()}>
                    {page.map((row, index) => {
                      prepareRow(row);
                      return (
                        <tr {...row.getRowProps()} key={index}>
                          {row.cells.map((cell, index) => (
                            <td
                              className="pb-[20px] pt-[14px] sm:text-[14px]"
                              {...cell.getCellProps()}
                              key={index}
                            >
                              {cell.render("Cell")}
                            </td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-between">
                <div>
                  <button
                    onClick={() => gotoPage(0)}
                    disabled={!canPreviousPage}
                  >
                    {"<<"}
                  </button>{" "}
                  <button
                    onClick={() => previousPage()}
                    disabled={!canPreviousPage}
                  >
                    {"<"}
                  </button>{" "}
                  <button onClick={() => nextPage()} disabled={!canNextPage}>
                    {">"}
                  </button>{" "}
                  <button
                    onClick={() => gotoPage(pageCount - 1)}
                    disabled={!canNextPage}
                  >
                    {">>"}
                  </button>{" "}
                </div>
                <div>
                  Page{" "}
                  <strong>
                    {pageIndex + 1} of {pageOptions.length}
                  </strong>{" "}
                </div>
              </div>
            </div>
          </>
        )}
      </>
    </Card>
  );
};

export default TestsTable;
