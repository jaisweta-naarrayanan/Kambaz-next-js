"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import * as quizClient from "../../client";
import * as questionClient from "../../Questions/client";
import { Quiz, Question } from "@/app/(Kambaz)/Database/types";
import { Button, Form } from "react-bootstrap";

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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3>{quiz.title}</h3>
          <p className="text-muted">Preview Mode - Answers will not be saved</p>
        </div>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </div>

      {quiz.description && (
        <div className="alert alert-info mb-4" dangerouslySetInnerHTML={{ __html: quiz.description }} />
      )}

      <div className="border rounded p-4 mb-4">
        <div className="mb-3">
          <strong>Quiz Type:</strong> {quiz.quizType} | <strong>Points:</strong> {quiz.points} |{" "}
          <strong>Time Limit:</strong> {quiz.timeLimit} minutes
        </div>
        {quiz.multipleAttempts && (
          <div className="mb-2">
            <strong>Multiple Attempts:</strong> Yes ({quiz.howManyAttempts} attempts allowed)
          </div>
        )}
      </div>

      <Form>
        {questions.map((question, index) => (
          <div
            key={question._id}
            className={`border rounded p-4 mb-3 ${showResults ? (isAnswerCorrect(question) ? "border-success" : "border-danger") : ""
              }`}
          >
            <div className="d-flex justify-content-between align-items-start mb-3">
              <h5>
                Question {index + 1} {showResults && (isAnswerCorrect(question) ? "✅" : "❌")}
              </h5>
              <span className="badge bg-secondary">{question.points} pts</span>
            </div>

            <div className="mb-3" dangerouslySetInnerHTML={{ __html: question.question || question.title }} />

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

      {!showResults ? (
        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={calculateScore}>
            Submit Preview
          </Button>
        </div>
      ) : (
        <div className="border rounded p-4 bg-light">
          <h4>Preview Results</h4>
          <p className="mb-0">
            <strong>Score:</strong> {score} / {quiz.points} ({((score / quiz.points) * 100).toFixed(1)}%)
          </p>
          <div className="mt-3">
            <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/edit`)}>
              Edit Quiz
            </Button>
            <Button variant="secondary" className="ms-2" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
              Back to Quizzes
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
