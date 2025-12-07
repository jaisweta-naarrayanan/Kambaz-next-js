"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import * as quizClient from "../../../client";
import * as questionClient from "../../../Questions/client";
import * as attemptClient from "../../../Attempts/client";
import { Quiz, Question, QuizAttempt } from "@/app/(Kambaz)/Database/types";
import { Button, Alert } from "react-bootstrap";
import { formatDateLong } from "../../../utils";

export default function QuizResults() {
  const { cid, qid, attemptId } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [allAttempts, setAllAttempts] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      if (cid && qid && attemptId) {
        const quizData = await quizClient.getQuizById(cid as string, qid as string);
        const questionsData = await questionClient.getQuestionsForQuiz(qid as string);
        const attemptData = await attemptClient.getAttemptById(qid as string, attemptId as string);
        const allAttemptsData = await attemptClient.getAttemptsForStudent(qid as string);

        setQuiz(quizData);
        setQuestions(questionsData);
        setAttempt(attemptData);
        setAllAttempts(allAttemptsData);
      }
    };
    fetchData();
  }, [cid, qid, attemptId]);

  const getStudentAnswer = (questionId: string) => {
    if (!attempt) return undefined;
    const answer = attempt.answers.find((a) => a.questionId === questionId);
    return answer?.answer;
  };

  const isAnswerCorrect = (question: Question, studentAnswer: any): boolean => {
    if (studentAnswer === undefined) return false;

    if (question.type === "Multiple Choice" || question.type === "True/False") {
      return studentAnswer === question.correctAnswer;
    } else if (question.type === "Fill in the Blank" && question.possibleAnswers) {
      return question.possibleAnswers.some((ans) =>
        question.caseSensitive
          ? ans === studentAnswer
          : ans.toLowerCase() === studentAnswer.toLowerCase()
      );
    }
    return false;
  };

  const canRetake = () => {
    if (!quiz || !allAttempts) return false;
    return quiz.multipleAttempts && allAttempts.length < quiz.howManyAttempts;
  };

  if (!quiz || !questions.length || !attempt) {
    return <div className="p-4">Loading results...</div>;
  }

  const percentage = ((attempt.score / quiz.points) * 100).toFixed(1);

  return (
    <div id="wd-quiz-results" className="p-4">
      <div className="mb-4">
        <h3>{quiz.title} - Results</h3>
        <p className="text-muted">
          Attempt {attempt.attemptNumber} of {quiz.howManyAttempts} |{" "}
          Submitted: {formatDateLong(attempt.submittedAt)}
        </p>
      </div>

      {/* Score Summary */}
      <Alert variant={parseFloat(percentage) >= 70 ? "success" : "warning"} className="mb-4">
        <h4 className="mb-3">Your Score</h4>
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h2 className="mb-0">
              {attempt.score} / {quiz.points}
            </h2>
            <p className="mb-0">{percentage}%</p>
          </div>
          {parseFloat(percentage) >= 70 ? (
            <div className="fs-1">✅</div>
          ) : (
            <div className="fs-1">📝</div>
          )}
        </div>
      </Alert>

      {/* Attempts Summary */}
      {quiz.multipleAttempts && (
        <Alert variant="info" className="mb-4">
          <strong>Attempts Used:</strong> {allAttempts.length} / {quiz.howManyAttempts}
          {canRetake() && (
            <p className="mb-0 mt-2">
              You have {quiz.howManyAttempts - allAttempts.length} attempt(s) remaining.
            </p>
          )}
        </Alert>
      )}

      {/* Questions and Answers */}
      <h5 className="mb-3">Question Review</h5>
      {questions.map((question, index) => {
        const studentAnswer = getStudentAnswer(question._id);
        const correct = isAnswerCorrect(question, studentAnswer);

        return (
          <div
            key={question._id}
            className={`border rounded p-4 mb-3 ${correct ? "border-success bg-light" : "border-danger"}`}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5>
                Question {index + 1} {correct ? "✅" : "❌"}
              </h5>
              <div>
                <span className="badge bg-secondary me-2">{question.points} pts</span>
                {correct ? (
                  <span className="badge bg-success">Correct</span>
                ) : (
                  <span className="badge bg-danger">Incorrect</span>
                )}
              </div>
            </div>

            <div className="mb-3">
              <strong>Question:</strong>
              <div dangerouslySetInnerHTML={{ __html: question.question || question.title }} />
            </div>

            {/* Multiple Choice */}
            {question.type === "Multiple Choice" && question.choices && (
              <div>
                <strong>Choices:</strong>
                <ul className="list-unstyled mt-2">
                  {question.choices.map((choice, choiceIndex) => {
                    const isStudentChoice = studentAnswer === choiceIndex;
                    const isCorrectChoice = question.correctAnswer === choiceIndex;

                    return (
                      <li
                        key={choiceIndex}
                        className={`p-2 mb-1 rounded ${isCorrectChoice
                          ? "bg-success text-white"
                          : isStudentChoice
                            ? "bg-danger text-white"
                            : ""
                          }`}
                      >
                        {isStudentChoice && "👤 "}
                        {isCorrectChoice && "✓ "}
                        {choice}
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}

            {/* True/False */}
            {question.type === "True/False" && (
              <div>
                <div className="mb-2">
                  <strong>Your Answer:</strong>{" "}
                  <span className={correct ? "text-success" : "text-danger"}>
                    {studentAnswer !== undefined ? (studentAnswer ? "True" : "False") : "Not answered"}
                  </span>
                </div>
                {!correct && (
                  <div>
                    <strong>Correct Answer:</strong>{" "}
                    <span className="text-success">
                      {question.correctAnswer ? "True" : "False"}
                    </span>
                  </div>
                )}
              </div>
            )}

            {/* Fill in the Blank */}
            {question.type === "Fill in the Blank" && (
              <div>
                <div className="mb-2">
                  <strong>Your Answer:</strong>{" "}
                  <span className={correct ? "text-success" : "text-danger"}>
                    {studentAnswer || "Not answered"}
                  </span>
                </div>
                {!correct && question.possibleAnswers && (
                  <div>
                    <strong>Correct Answers:</strong>{" "}
                    <span className="text-success">{question.possibleAnswers.join(", ")}</span>
                  </div>
                )}
              </div>
            )}
          </div>
        );
      })}

      {/* Action Buttons */}
      <div className="d-flex justify-content-between mt-4">
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
        <div>
          {canRetake() && (
            <Button
              variant="danger"
              className="me-2"
              onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/take`)}
            >
              Retake Quiz ({quiz.howManyAttempts - allAttempts.length} attempts left)
            </Button>
          )}
          <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}`)}>
            View Quiz Details
          </Button>
        </div>
      </div>
    </div>
  );
}
