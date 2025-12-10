"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import * as quizClient from "../client";
import { Quiz } from "@/app/(Kambaz)/Database/types";
import { Button } from "react-bootstrap";
import { getQuizAvailability, formatDateLong } from "../utils";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [quiz, setQuiz] = useState<Quiz | null>(null);

  const isFaculty = (currentUser as any)?.role === "FACULTY";

  useEffect(() => {
    const fetchQuiz = async () => {
      if (cid && qid) {
        const data = await quizClient.getQuizById(cid as string, qid as string);
        setQuiz(data);
      }
    };
    fetchQuiz();
  }, [cid, qid]);

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const availabilityInfo = getQuizAvailability(quiz);

  return (
    <div id="wd-quiz-details" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{quiz.title}</h3>
        <div>
          {isFaculty ? (
            <>
              <Button
                variant="secondary"
                className="me-2"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/preview`)}
              >
                Preview
              </Button>
              <Button
                variant="danger"
                onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}
              >
                Edit
              </Button>
            </>
          ) : (
            <Button
              variant="danger"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
            >
              Take Quiz
            </Button>
          )}
        </div>
      </div>

      <div className="border rounded p-4">
        <h5 className="fw-bold">Quiz Details</h5>
        <hr />

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Quiz Type</div>
          <div className="col-md-9">{quiz.quizType}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Points</div>
          <div className="col-md-9">{quiz.points}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Number of Questions</div>
          <div className="col-md-9">{quiz.questionCount || 0}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Assignment Group</div>
          <div className="col-md-9">{quiz.assignmentGroup}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Shuffle Answers</div>
          <div className="col-md-9">{quiz.shuffleAnswers ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Time Limit</div>
          <div className="col-md-9">{quiz.timeLimit} Minutes</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Multiple Attempts</div>
          <div className="col-md-9">{quiz.multipleAttempts ? "Yes" : "No"}</div>
        </div>

        {quiz.multipleAttempts && (
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Number of Attempts</div>
            <div className="col-md-9">{quiz.howManyAttempts}</div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Show Correct Answers</div>
          <div className="col-md-9">{quiz.showCorrectAnswers}</div>
        </div>

        {quiz.accessCode && (
          <div className="row mb-3">
            <div className="col-md-3 fw-bold">Access Code</div>
            <div className="col-md-9">{quiz.accessCode}</div>
          </div>
        )}

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">One Question at a Time</div>
          <div className="col-md-9">{quiz.oneQuestionAtATime ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Webcam Required</div>
          <div className="col-md-9">{quiz.webcamRequired ? "Yes" : "No"}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Lock Questions After Answering</div>
          <div className="col-md-9">{quiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</div>
        </div>

        <hr />

        <h5 className="fw-bold mb-3">Due Dates</h5>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Due Date</div>
          <div className="col-md-9">{formatDateLong(quiz.dueDate)}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Available From</div>
          <div className="col-md-9">{formatDateLong(quiz.availableDate)}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Available Until</div>
          <div className="col-md-9">{formatDateLong(quiz.availableUntilDate)}</div>
        </div>

        <div className="row mb-3">
          <div className="col-md-3 fw-bold">Status</div>
          <div className="col-md-9">
            {quiz.published ? "Published" : "Unpublished"} | {availabilityInfo.message}
          </div>
        </div>
      </div>

      <div className="mt-4">
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}
