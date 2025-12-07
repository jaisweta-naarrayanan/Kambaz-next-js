"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as quizClient from "../../client";
import * as questionClient from "../../Questions/client";
import { Quiz, Question } from "@/app/(Kambaz)/Database/types";
import { Button, Form, Alert } from "react-bootstrap";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      if (cid && qid) {
        const quizData = await quizClient.getQuizById(cid as string, qid as string);
        const questionsData = await questionClient.getQuestionsForQuiz(qid as string);
        setQuiz(quizData);
        setQuestions(questionsData);
      }
    };
    fetchData();
  }, [cid, qid]);

  const handleAnswerChange = (questionId: string, answer: any) => {
    setAnswers({ ...answers, [questionId]: answer });
  };

  const calculateScore = () => {
    let totalScore = 0;
    questions.forEach((q) => {
      const userAnswer = answers[q._id];
      if (userAnswer === undefined) return;

      if (q.type === "Multiple Choice" && userAnswer === q.correctAnswer) {
        totalScore += q.points;
      } else if (q.type === "True/False" && userAnswer === q.correctAnswer) {
        totalScore += q.points;
      } else if (q.type === "Fill in the Blank" && q.possibleAnswers) {
        const isCorrect = q.possibleAnswers.some((ans) =>
          q.caseSensitive
            ? ans === userAnswer
            : ans.toLowerCase() === userAnswer.toLowerCase()
        );
        if (isCorrect) totalScore += q.points;
      }
    });
    setScore(totalScore);
    setShowResults(true);
  };

  const isAnswerCorrect = (question: Question): boolean => {
    const userAnswer = answers[question._id];
    if (userAnswer === undefined) return false;

    if (question.type === "Multiple Choice" || question.type === "True/False") {
      return userAnswer === question.correctAnswer;
    } else if (question.type === "Fill in the Blank" && question.possibleAnswers) {
      return question.possibleAnswers.some((ans) =>
        question.caseSensitive
          ? ans === userAnswer
          : ans.toLowerCase() === userAnswer.toLowerCase()
      );
    }
    return false;
  };

  if (!quiz || questions.length === 0) {
    return <div className="p-4">Loading quiz...</div>;
  }

  return (
    <div id="wd-quiz-preview" className="p-4">
      {/* Quiz Title */}
      <h2 className="mb-3">{quiz.title}</h2>

      {/* Preview Alert */}
      <Alert variant="light" className="border" style={{ backgroundColor: "#fce8e8", borderColor: "#f8d7da" }}>
        <span className="text-danger">⚠</span> This is a preview of the published version of the quiz
      </Alert>

      {/* Quiz Started Info */}
      {!showResults && (
        <p className="text-muted mb-3">Started: {new Date().toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
          hour12: true
        })}</p>
      )}

      {/* Quiz Instructions */}
      {quiz.description && (
        <>
          <h4 className="mb-3 pb-2 border-bottom">Quiz Instructions</h4>
          <div className="mb-4" dangerouslySetInnerHTML={{ __html: quiz.description }} />
        </>
      )}

      {/* Questions */}
      <Form>
        {questions.map((question, index) => (
          <div
            key={question._id}
            className={`mb-4 p-4 border rounded ${showResults ? (isAnswerCorrect(question) ? "border-success bg-light" : "border-danger bg-light") : "bg-light"
              }`}
          >
            {/* Question Header */}
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5 className="mb-0">
                Question {index + 1} {showResults && (isAnswerCorrect(question) ? "✅" : "❌")}
              </h5>
              <span className="badge bg-secondary">{question.points} pts</span>
            </div>

            {/* Question Text */}
            <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question || question.title }} />

            {/* Question Type: Multiple Choice */}
            {question.type === "Multiple Choice" && question.choices && (
              <div>
                {question.choices.map((choice, choiceIndex) => (
                  <Form.Check
                    key={choiceIndex}
                    type="radio"
                    name={`question-${question._id}`}
                    label={choice}
                    value={choiceIndex}
                    checked={answers[question._id] === choiceIndex}
                    onChange={() => handleAnswerChange(question._id, choiceIndex)}
                    disabled={showResults}
                    className={
                      showResults && question.correctAnswer === choiceIndex ? "text-success fw-bold" : ""
                    }
                  />
                ))}
              </div>
            )}

            {/* Question Type: True/False */}
            {question.type === "True/False" && (
              <div>
                <Form.Check
                  type="radio"
                  name={`question-${question._id}`}
                  label="True"
                  value="true"
                  checked={answers[question._id] === true}
                  onChange={() => handleAnswerChange(question._id, true)}
                  disabled={showResults}
                  className={showResults && question.correctAnswer === true ? "text-success fw-bold" : ""}
                />
                <Form.Check
                  type="radio"
                  name={`question-${question._id}`}
                  label="False"
                  value="false"
                  checked={answers[question._id] === false}
                  onChange={() => handleAnswerChange(question._id, false)}
                  disabled={showResults}
                  className={showResults && question.correctAnswer === false ? "text-success fw-bold" : ""}
                />
              </div>
            )}

            {/* Question Type: Fill in the Blank */}
            {question.type === "Fill in the Blank" && (
              <div>
                <Form.Control
                  type="text"
                  value={answers[question._id] || ""}
                  onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                  disabled={showResults}
                  placeholder="Type your answer here"
                />
                {showResults && question.possibleAnswers && (
                  <div className="mt-2 text-success">
                    <strong>Correct answers:</strong> {question.possibleAnswers.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </Form>

      {/* Action Buttons */}
      {!showResults ? (
        <div className="border-top pt-3">
          <div className="d-flex justify-content-between align-items-center">
            <p className="text-muted mb-0">Quiz saved at {new Date().toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
              hour12: true
            })}</p>
            <Button variant="secondary" onClick={calculateScore}>
              Submit Quiz
            </Button>
          </div>
        </div>
      ) : (
        <div className="border rounded p-4 bg-light mt-4">
          <h4>Preview Results</h4>
          <p className="mb-3">
            <strong>Score:</strong> {score} / {quiz.points} ({((score / quiz.points) * 100).toFixed(1)}%)
          </p>
          <Button variant="outline-secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
            <span style={{ fontSize: "14px" }}>🔗</span> Keep Editing This Quiz
          </Button>
        </div>
      )}
    </div>
  );
}
