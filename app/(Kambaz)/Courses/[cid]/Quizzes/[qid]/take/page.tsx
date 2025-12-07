"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import * as quizClient from "../../client";
import * as questionClient from "../../Questions/client";
import * as attemptClient from "../../Attempts/client";
import { Quiz, Question } from "@/app/(Kambaz)/Database/types";
import { Button, Form, Alert } from "react-bootstrap";
import { getQuizAvailability, formatDateLong } from "../../utils";

export default function QuizTaking() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [attempts, setAttempts] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [quizStarted, setQuizStarted] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (cid && qid) {
        const quizData = await quizClient.getQuizById(cid as string, qid as string);
        const questionsData = await questionClient.getQuestionsForQuiz(qid as string);
        const attemptsData = await attemptClient.getAttemptsForStudent(qid as string);

        setQuiz(quizData);
        setQuestions(quizData.shuffleAnswers ? shuffleArray([...questionsData]) : questionsData);
        setAttempts(attemptsData);
      }
    };
    fetchData();
  }, [cid, qid]);

  useEffect(() => {
    if (quizStarted && quiz?.timeLimit && timeRemaining === null) {
      setTimeRemaining(quiz.timeLimit * 60); // Convert to seconds
    }
  }, [quizStarted, quiz, timeRemaining]);

  useEffect(() => {
    if (timeRemaining !== null && timeRemaining > 0 && quizStarted) {
      const timer = setTimeout(() => setTimeRemaining(timeRemaining - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeRemaining === 0) {
      handleSubmit();
    }
  }, [timeRemaining, quizStarted]);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

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
    return totalScore;
  };

  const handleSubmit = async () => {
    const score = calculateScore();
    const attemptNumber = attempts.length + 1;

    const attempt = {
      quiz: qid,
      answers: Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      })),
      score,
      attemptNumber,
    };

    const savedAttempt = await attemptClient.submitQuizAttempt(qid as string, attempt);
    router.push(`/Courses/${cid}/Quizzes/${qid}/attempts/${savedAttempt._id}`);
  };

  if (!quiz || questions.length === 0) {
    return <div className="p-4">Loading quiz...</div>;
  }

  // Check availability
  const availabilityInfo = getQuizAvailability(quiz);

  if (!availabilityInfo.isAvailable) {
    return (
      <div className="p-4">
        <Alert variant={availabilityInfo.status === "closed" ? "danger" : "warning"}>
          {availabilityInfo.message}
        </Alert>
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  // Check attempts limit
  if (quiz.multipleAttempts && attempts.length >= quiz.howManyAttempts) {
    return (
      <div className="p-4">
        <Alert variant="info">
          You have used all {quiz.howManyAttempts} attempts for this quiz.
        </Alert>
        <Button variant="primary" onClick={() => router.push(`/Courses/${cid}/Quizzes/${qid}/attempts/${attempts[0]._id}`)}>
          View Last Attempt
        </Button>
        <Button variant="secondary" className="ms-2" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Back to Quizzes
        </Button>
      </div>
    );
  }

  if (!quizStarted) {
    return (
      <div className="p-4">
        <h3>{quiz.title}</h3>
        <div className="border rounded p-4 mb-4">
          {quiz.description && <div className="mb-3" dangerouslySetInnerHTML={{ __html: quiz.description }} />}
          <div className="mb-2">
            <strong>Quiz Type:</strong> {quiz.quizType}
          </div>
          <div className="mb-2">
            <strong>Points:</strong> {quiz.points}
          </div>
          <div className="mb-2">
            <strong>Number of Questions:</strong> {questions.length}
          </div>
          <div className="mb-2">
            <strong>Time Limit:</strong> {quiz.timeLimit} minutes
          </div>
          {quiz.multipleAttempts && (
            <div className="mb-2">
              <strong>Attempts:</strong> {attempts.length} / {quiz.howManyAttempts} used
            </div>
          )}
          <div className="mb-2">
            <strong>Due Date:</strong> {formatDateLong(quiz.dueDate)}
          </div>
        </div>

        <Alert variant="info">
          <strong>Instructions:</strong>
          <ul className="mb-0 mt-2">
            <li>Answer all questions to the best of your ability.</li>
            {quiz.oneQuestionAtATime && <li>You will see one question at a time.</li>}
            {quiz.timeLimit && <li>You have {quiz.timeLimit} minutes to complete this quiz.</li>}
            {quiz.lockQuestionsAfterAnswering && <li>Questions will be locked after answering.</li>}
            {quiz.multipleAttempts && <li>You have {quiz.howManyAttempts - attempts.length} attempts remaining.</li>}
          </ul>
        </Alert>

        <div className="d-flex gap-2">
          <Button variant="danger" onClick={() => setQuizStarted(true)}>
            Start Quiz
          </Button>
          <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div id="wd-quiz-taking" className="p-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{quiz.title}</h3>
        {timeRemaining !== null && (
          <div className={`badge ${timeRemaining < 60 ? "bg-danger" : "bg-primary"} fs-5`}>
            Time Remaining: {formatTime(timeRemaining)}
          </div>
        )}
      </div>

      {quiz.oneQuestionAtATime ? (
        // One question at a time mode
        <div>
          <div className="mb-3">
            <strong>
              Question {currentQuestionIndex + 1} of {questions.length}
            </strong>
          </div>
          {renderQuestion(questions[currentQuestionIndex])}

          <div className="d-flex justify-content-between mt-4">
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
              <Button variant="danger" onClick={handleSubmit}>
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

          <div className="d-flex justify-content-end gap-2 mt-4">
            <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSubmit}>
              Submit Quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );

  function renderQuestion(question: Question, index?: number) {
    const questionNumber = index !== undefined ? index + 1 : currentQuestionIndex + 1;

    return (
      <div className="border rounded p-4 mb-3">
        <div className="d-flex justify-content-between align-items-start mb-3">
          <h5>Question {questionNumber}</h5>
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
            />
            <Form.Check
              type="radio"
              name={`question-${question._id}`}
              label="False"
              value="false"
              checked={answers[question._id] === false}
              onChange={() => handleAnswerChange(question._id, false)}
            />
          </div>
        )}

        {question.type === "Fill in the Blank" && (
          <Form.Control
            type="text"
            value={answers[question._id] || ""}
            onChange={(e) => handleAnswerChange(question._id, e.target.value)}
            placeholder="Type your answer here"
          />
        )}
      </div>
    );
  }
}
