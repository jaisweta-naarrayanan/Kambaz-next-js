"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as quizClient from "../../client";
import * as questionClient from "../../Questions/client";
import { Quiz, Question } from "@/app/(Kambaz)/Database/types";
import { Button, Form, Alert } from "react-bootstrap";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAnswerCorrectMap, setIsAnswerCorrectMap] = useState<{ [key: string]: boolean }>({});

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

  const handleMultiBlankChange = (questionId: string, variable: string, value: string) => {
    const currentAnswer = answers[questionId] || {};
    setAnswers({
      ...answers,
      [questionId]: { ...currentAnswer, [variable]: value },
    });
  };

  const calculateScore = () => {
    let totalScore = 0;
    const newIsAnswerCorrectMap: { [key: string]: boolean } = {};

    questions.forEach((q) => {
      const userAnswer = answers[q._id];
      let isCorrect = false;

      if (userAnswer === undefined) {
        isCorrect = false;
      } else if (q.type === "Multiple Choice") {
        isCorrect = userAnswer === q.correctAnswer;
      } else if (q.type === "True/False") {
        isCorrect = userAnswer === q.correctAnswer;
      } else if (q.type === "Fill in the Blank" && q.possibleAnswers) {
        // Check if all blanks are correct
        if (typeof userAnswer === 'object') {
          const allCorrect = q.possibleAnswers.every(pa => {
            const userVal = userAnswer[pa.variable] || "";
            return pa.answers.some(ans =>
              q.caseSensitive
                ? ans === userVal
                : ans.toLowerCase() === userVal.toLowerCase()
            );
          });
          isCorrect = allCorrect;
        }
      }

      if (isCorrect) {
        totalScore += q.points;
      }
      newIsAnswerCorrectMap[q._id] = isCorrect;
    });

    setScore(totalScore);
    setIsAnswerCorrectMap(newIsAnswerCorrectMap);
    setShowResults(true);
  };

  if (!quiz || questions.length === 0) {
    return <div className="p-4">Loading quiz...</div>;
  }

  const renderQuestion = (question: Question, index?: number) => {
    const questionNumber = index !== undefined ? index + 1 : currentQuestionIndex + 1;
    const isCorrect = isAnswerCorrectMap[question._id];

    return (
      <div
        key={question._id}
        className={`mb-4 p-4 border rounded ${showResults ? (isCorrect ? "border-success bg-light" : "border-danger bg-light") : "bg-light"
          }`}
      >
        {/* Question Header */}
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5 className="mb-0">
            Question {questionNumber} {showResults && (isCorrect ? "✅" : "❌")}
          </h5>
          <span className="badge bg-secondary">{question.points} pts</span>
        </div>

        {/* Question Text & Inputs */}
        <div className="mb-3">
          {question.type === "Fill in the Blank" ? (
            <div>
              {/* Render text with inputs for variables */}
              {question.question.split(/(\[.*?\])/g).map((part, i) => {
                const match = part.match(/\[(.*?)\]/);
                if (match) {
                  const variable = match[1];
                  return (
                    <span key={i} className="d-inline-block mx-1">
                      <Form.Control
                        type="text"
                        size="sm"
                        style={{ width: "150px", display: "inline-block" }}
                        value={(answers[question._id] && answers[question._id][variable]) || ""}
                        onChange={(e) => handleMultiBlankChange(question._id, variable, e.target.value)}
                        disabled={showResults}
                      />
                    </span>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: question.question || question.title }} />
          )}
        </div>

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

        {/* Results: Correct Answers for Fill in the Blank */}
        {showResults && question.type === "Fill in the Blank" && question.possibleAnswers && (
          <div className="mt-3 p-3 bg-white border rounded">
            <h6 className="text-success fw-bold mb-2">Correct Answers:</h6>
            <ul className="mb-0 list-unstyled">
              {question.possibleAnswers.map(pa => (
                <li key={pa.variable} className="mb-1">
                  <strong>[{pa.variable}]:</strong> {pa.answers.join(" or ")}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  };

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
      {quiz.oneQuestionAtATime ? (
        // One question at a time mode
        <div>
          <div className="mb-3">
            <strong>
              Question {currentQuestionIndex + 1} of {questions.length}
            </strong>
          </div>
          {renderQuestion(questions[currentQuestionIndex])}

          <div className="d-flex justify-content-between mt-4 border-top pt-3">
            <Button
              variant="secondary"
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
            >
              Previous
            </Button>
            {currentQuestionIndex < questions.length - 1 ? (
              <Button variant="primary" onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}>
                Next
              </Button>
            ) : (
              <Button variant="secondary" onClick={calculateScore}>
                Submit Quiz
              </Button>
            )}
          </div>
        </div>
      ) : (
        // All questions at once mode
        <div>
          <Form>
            {questions.map((question, index) => (
              <div key={question._id}>
                {renderQuestion(question, index)}
              </div>
            ))}
          </Form>

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
        </div>
      )}

      {showResults && (
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
