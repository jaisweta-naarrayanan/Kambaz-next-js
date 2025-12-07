"use client";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { setQuizzes } from "./reducer";
import * as client from "./client";
import { useEffect, useState } from "react";
import { Button, Dropdown } from "react-bootstrap";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { GiNotebook } from "react-icons/gi";
import { Quiz } from "@/app/(Kambaz)/Database/types";
import { getQuizAvailability, formatDateForDisplay } from "./utils";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes: reduxQuizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  // Check if user is faculty
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

  // Handle quiz deletion
  const handleDelete = async (quizId: string) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      await client.deleteQuiz(cid as string, quizId);
      const updatedQuizzes = await client.getQuizzesForCourse(cid as string);
      dispatch(setQuizzes(updatedQuizzes));
    }
  };

  // Handle publish/unpublish toggle
  const handleTogglePublish = async (quiz: Quiz) => {
    await client.publishQuiz(cid as string, quiz._id, !quiz.published);
    const updatedQuizzes = await client.getQuizzesForCourse(cid as string);
    dispatch(setQuizzes(updatedQuizzes));
  };

  // Handle create new quiz
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

  // Filter quizzes for the current course
  const courseQuizzes = reduxQuizzes.filter(
    (quiz: Quiz) => quiz.course === cid
  );

  // For students, only show published quizzes
  const visibleQuizzes = isFaculty
    ? courseQuizzes
    : courseQuizzes.filter((quiz: Quiz) => quiz.published);

  return (
    <div id="wd-quizzes">
      {/* Search and Buttons Row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "300px" }}>
          <CiSearch
            className="position-absolute me-3"
            style={{ left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }}
          />
          <input
            placeholder="Search for Quiz"
            id="wd-search-quiz"
            className="form-control ps-5"
          />
        </div>
        {isFaculty && (
          <div>
            <button
              id="wd-add-quiz"
              className="btn btn-danger"
              onClick={handleAddQuiz}
            >
              <BsPlus className="fs-4" /> Quiz
            </button>
          </div>
        )}
      </div>

      {/* Quizzes List */}
      {visibleQuizzes.length === 0 ? (
        <div className="text-center py-5">
          <p className="text-muted">
            {isFaculty
              ? 'No quizzes yet. Click "+ Quiz" to create one.'
              : "No quizzes available yet."}
          </p>
        </div>
      ) : (
        <ul id="wd-quiz-list" className="list-group rounded-0">
          {/* Quiz Header */}
          <li className="wd-quiz-list-item list-group-item p-3 ps-1 fs-5 border-gray">
            <div className="d-flex align-items-center">
              <BsGripVertical className="me-2 fs-3" />
              <GoTriangleDown className="me-2" />
              <strong id="wd-quizzes-title">QUIZZES</strong>
              {isFaculty && (
                <div className="ms-auto">
                  <Button variant="outline-secondary" size="sm" className="border-0 me-1">
                    <FaPlus />
                  </Button>
                  <Button variant="outline-secondary" size="sm" className="border-0">
                    <IoEllipsisVertical />
                  </Button>
                </div>
              )}
            </div>
          </li>

          {/* Quiz Items */}
          {visibleQuizzes.map((quiz: Quiz) => (
            <li key={quiz._id} className="wd-quiz-list-item wd-quiz list-group-item p-3 ps-1">
              <div className="d-flex align-items-start">
                <BsGripVertical className="me-2 fs-5" />
                <GiNotebook className="me-3 fs-4 text-success" />
                <div className="flex-grow-1">
                  <Link
                    href={`/Courses/${cid}/Quizzes/${quiz._id}`}
                    className="wd-quiz-link text-dark text-decoration-none fw-bold"
                  >
                    {quiz.title}
                  </Link>
                  <div className="text-muted small">
                    <strong>{getQuizAvailability(quiz).message}</strong> |{" "}
                    <strong>Due</strong> {formatDateForDisplay(quiz.dueDate)} | {quiz.points} pts | Questions TBD
                  </div>
                </div>
                <div className="d-flex align-items-center">
                  {isFaculty ? (
                    <>
                      {quiz.published ? (
                        <FaCheckCircle
                          className="text-success me-3 fs-5"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTogglePublish(quiz)}
                          title="Published (click to unpublish)"
                        />
                      ) : (
                        <span
                          className="me-3 fs-5"
                          style={{ cursor: "pointer" }}
                          onClick={() => handleTogglePublish(quiz)}
                          title="Unpublished (click to publish)"
                        >
                          🚫
                        </span>
                      )}
                      <Dropdown>
                        <Dropdown.Toggle
                          variant="link"
                          className="text-dark p-0 border-0"
                          id={`dropdown-${quiz._id}`}
                        >
                          <IoEllipsisVertical className="fs-4" />
                        </Dropdown.Toggle>
                        <Dropdown.Menu>
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
                    <span className="text-muted small">View →</span>
                  )}
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}