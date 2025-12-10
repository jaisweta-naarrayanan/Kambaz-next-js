"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { setQuizzes } from "./reducer";
import { setAttempts } from "./Attempts/reducer";
import * as client from "./client";
import * as attemptClient from "./Attempts/client";
import { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical, BsPlus, BsSearch } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { GiNotebook } from "react-icons/gi";
import { Quiz } from "@/app/(Kambaz)/Database/types";
import { getQuizAvailability, formatDateForDisplay } from "./utils";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes: reduxQuizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { attempts: reduxAttempts } = useSelector((state: RootState) => state.quizAttemptsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [searchTerm, setSearchTerm] = useState("");

  const isFaculty = (currentUser as any)?.role === "FACULTY";

  useEffect(() => {
    const fetchQuizzes = async () => {
      if (cid) {
        const data = await client.getQuizzesForCourse(cid as string);
        dispatch(setQuizzes(data));
      }
    };
    fetchQuizzes();
  }, [cid, dispatch]);

  useEffect(() => {
    const fetchAllAttempts = async () => {
      if (!isFaculty && cid) {
        const courseQuizzes: Quiz[] = reduxQuizzes.filter((quiz: Quiz) => quiz.course === cid);
        const allAttempts: any = [];

        for (const quiz of courseQuizzes) {
          try {
            const attempts = await attemptClient.getAttemptsForStudent(quiz._id);
            allAttempts.push(...attempts);
          } catch (error) {
            // Quiz may not have attempts yet
          }
        }
        dispatch(setAttempts(allAttempts));
      }
    };
    fetchAllAttempts();
  }, [isFaculty, cid, reduxQuizzes, dispatch]);

  const handleDelete = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await client.deleteQuiz(cid as string, quizId);
      const updatedQuizzes = await client.getQuizzesForCourse(cid as string);
      dispatch(setQuizzes(updatedQuizzes));
    }
  };

  const handleTogglePublish = async (quiz: Quiz) => {
    await client.publishQuiz(cid as string, quiz._id, !quiz.published);
    const updatedQuizzes = await client.getQuizzesForCourse(cid as string);
    dispatch(setQuizzes(updatedQuizzes));
  };

  const handleAddQuiz = async () => {
    const newQuiz = {
      title: "Unnamed Quiz",
      description: "",
      quizType: "Graded Quiz",
      points: 0,
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      timeLimit: 20,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "immediately",
      showCorrectAnswersDate: "",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      published: false,
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      availableDate: new Date().toISOString(),
      availableUntilDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    };
    const createdQuiz = await client.createQuiz(cid as string, newQuiz);
    router.push(`/Courses/${cid}/Quizzes/${createdQuiz._id}/edit`);
  };

  const courseQuizzes: Quiz[] = reduxQuizzes.filter((quiz: Quiz) => quiz.course === cid);
  const visibleQuizzes: Quiz[] = isFaculty ? courseQuizzes : courseQuizzes.filter((quiz: Quiz) => quiz.published);
  const filteredQuizzes: Quiz[] = visibleQuizzes
    .filter((quiz: Quiz) => quiz.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a: Quiz, b: Quiz) => new Date(a.availableDate).getTime() - new Date(b.availableDate).getTime());

  const getStudentScore = (quizId: string) => {
    if (isFaculty || reduxAttempts.length === 0) return null;
    const quizAttempts: any[] = reduxAttempts.filter((a: any) => a.quiz === quizId);
    if (quizAttempts.length === 0) return null;
    return quizAttempts[0];
  };

  return (
    <div id="wd-quizzes" className="p-3">
      {/* Search and Buttons Row */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <div className="position-relative" style={{ width: "250px" }}>
          <BsSearch
            className="position-absolute"
            style={{ left: "12px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: "#6c757d" }}
          />
          <input
            placeholder="Search for Quiz"
            id="wd-search-quiz"
            className="form-control form-control-sm ps-5"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ fontSize: "14px" }}
          />
        </div>
        {isFaculty && (
          <div>
            <button
              id="wd-add-quiz"
              className="btn btn-danger btn-sm"
              onClick={handleAddQuiz}
              style={{ fontSize: "14px" }}
            >
              <BsPlus className="fs-5" style={{ marginBottom: "2px" }} /> Quiz
            </button>
          </div>
        )}
      </div>

      {/* Quizzes List */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted" style={{ fontSize: "14px" }}>
            {searchTerm
              ? `No quizzes found matching "${searchTerm}"`
              : isFaculty
                ? 'No quizzes yet. Click "+ Quiz" to create one.'
                : "No quizzes available yet."}
          </p>
        </div>
      ) : (
        <ul id="wd-quiz-list" className="list-group rounded-0">
          {/* Quiz Header */}
          <li className="wd-quiz-list-item list-group-item p-3 ps-2 border-gray" style={{ backgroundColor: "#f5f5f5" }}>
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2" style={{ fontSize: "20px", color: "#6c757d" }} />
              <GoTriangleDown className="me-2" style={{ fontSize: "16px" }} />
              <strong id="wd-quizzes-title" style={{ fontSize: "16px" }}>Assignment Quizzes</strong>
              {isFaculty && (
                <div className="ms-auto">
                  <Button variant="link" size="sm" className="text-dark p-0 border-0 me-2">
                    <BsPlus style={{ fontSize: "20px" }} />
                  </Button>
                  <Button variant="link" size="sm" className="text-dark p-0 border-0">
                    <IoEllipsisVertical style={{ fontSize: "18px" }} />
                  </Button>
                </div>
              )}
            </div>
          </li>

          {/* Quiz Items */}
          {filteredQuizzes.map((quiz: Quiz) => {
            const studentAttempt = getStudentScore(quiz._id);
            const availabilityInfo = getQuizAvailability(quiz);

            return (
              <li
                key={quiz._id}
                className="wd-quiz-list-item list-group-item p-0"
                style={{ borderLeft: "4px solid #28a745" }}
              >
                <div className="d-flex align-items-center p-3 ps-2">
                  <BsGripVertical className="me-2" style={{ fontSize: "20px", color: "#6c757d" }} />
                  <GiNotebook className="me-3" style={{ fontSize: "24px", color: "#28a745" }} />
                  <div className="flex-grow-1">
                    <Link
                      href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                      className="wd-quiz-link text-dark text-decoration-none"
                      style={{ fontSize: "16px", fontWeight: "600" }}
                    >
                      {quiz.title}
                    </Link>
                    <div className="mt-1" style={{ fontSize: "13px", color: "#6c757d" }}>
                      <span style={{ fontWeight: "600" }}>{availabilityInfo.message}</span>
                      <span className="mx-1">|</span>
                      <span style={{ fontWeight: "600" }}>Due</span> {formatDateForDisplay(quiz.dueDate)}
                      <span className="mx-1">|</span>
                      {quiz.points} pts
                      <span className="mx-1">|</span>
                      {quiz.questionCount || 0} Questions
                      {studentAttempt && (
                        <>
                          <span className="mx-1">|</span>
                          <span style={{ fontWeight: "600" }}>Score: {studentAttempt.score}/{quiz.points}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    {isFaculty ? (
                      <>
                        {quiz.published ? (
                          <FaCheckCircle
                            className="text-success me-3"
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => handleTogglePublish(quiz)}
                            title="Published (click to unpublish)"
                          />
                        ) : (
                          <span
                            className="me-3"
                            style={{ fontSize: "20px", cursor: "pointer" }}
                            onClick={() => handleTogglePublish(quiz)}
                            title="Unpublished (click to publish)"
                          >
                            🚫
                          </span>
                        )}
                        <Dropdown>
                          <Dropdown.Toggle
                            as="button"
                            className="btn btn-link text-dark p-0 border-0"
                            id={`dropdown-${quiz._id}`}
                          >
                            <IoEllipsisVertical style={{ fontSize: "20px" }} />
                          </Dropdown.Toggle>
                          <Dropdown.Menu align="end">
                            <Dropdown.Item onClick={() => router.push(`/Courses/${cid}/Quizzes/${quiz._id}/edit`)}>
                              Edit
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(quiz._id)}>
                              Delete
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleTogglePublish(quiz)}>
                              {quiz.published ? "Unpublish" : "Publish"}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </>
                    ) : (
                      <FaCheckCircle className="text-success" style={{ fontSize: "20px" }} />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}