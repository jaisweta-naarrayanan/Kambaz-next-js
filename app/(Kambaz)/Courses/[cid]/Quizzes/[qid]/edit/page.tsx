"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { setQuestions } from "../../Questions/reducer";
import * as quizClient from "../../client";
import * as questionClient from "../../Questions/client";
import { Quiz, Question } from "@/app/(Kambaz)/Database/types";
import { Button, Form, Tabs, Tab } from "react-bootstrap";
import { FaPlus, FaTrash, FaEdit } from "react-icons/fa";
import { BsSearch } from "react-icons/bs";

// Utility function to format date for datetime-local input
const formatDateForInput = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  return date.toISOString().slice(0, 16);
};

import FindQuestionsModal from "./FindQuestionsModal";
import QuestionGroupEditor from "./QuestionGroupEditor";
import * as groupClient from "../../QuestionGroups/client";
import { QuestionGroup } from "@/app/(Kambaz)/Database/types";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { questions: reduxQuestions } = useSelector((state: RootState) => state.questionsReducer);

  const isFaculty = (currentUser as any)?.role === "FACULTY";

  const [quiz, setQuiz] = useState<any>({
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
    dueDate: formatDateForInput(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()),
    availableDate: formatDateForInput(new Date().toISOString()),
    availableUntilDate: formatDateForInput(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString()),
  });

  const [activeTab, setActiveTab] = useState("details");
  const [editingQuestion, setEditingQuestion] = useState<Question | null>(null);
  const [showQuestionEditor, setShowQuestionEditor] = useState(false);
  const [showFindQuestionsModal, setShowFindQuestionsModal] = useState(false);

  const [groups, setGroups] = useState<QuestionGroup[]>([]);
  const [editingGroup, setEditingGroup] = useState<QuestionGroup | null>(null);
  const [showGroupEditor, setShowGroupEditor] = useState(false);

  useEffect(() => {
    if (!isFaculty) {
      router.push(`/Courses/${cid}/Quizzes`);
      return;
    }

    const fetchQuiz = async () => {
      if (qid && qid !== "new") {
        const data = await quizClient.getQuizById(cid as string, qid as string);
        setQuiz({
          ...data,
          dueDate: formatDateForInput(data.dueDate),
          availableDate: formatDateForInput(data.availableDate),
          availableUntilDate: formatDateForInput(data.availableUntilDate),
          showCorrectAnswersDate: data.showCorrectAnswersDate ? formatDateForInput(data.showCorrectAnswersDate) : "",
        });

        const questionsData = await questionClient.getQuestionsForQuiz(qid as string);
        dispatch(setQuestions(questionsData));

        const groupsData = await groupClient.getGroupsForQuiz(qid as string);
        setGroups(groupsData);
      }
    };
    fetchQuiz();
  }, [cid, qid, isFaculty, router, dispatch]);

  const handleSave = async (publish = false) => {
    const quizData = {
      ...quiz,
      dueDate: new Date(quiz.dueDate).toISOString(),
      availableDate: new Date(quiz.availableDate).toISOString(),
      availableUntilDate: new Date(quiz.availableUntilDate).toISOString(),
      showCorrectAnswersDate: quiz.showCorrectAnswersDate ? new Date(quiz.showCorrectAnswersDate).toISOString() : "",
    };

    if (qid === "new") {
      const created = await quizClient.createQuiz(cid as string, quizData);
      if (publish) {
        await quizClient.publishQuiz(cid as string, created._id, true);
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.push(`/Courses/${cid}/Quizzes/${created._id}`);
      }
    } else {
      await quizClient.updateQuiz(cid as string, { ...quizData, _id: qid });
      if (publish) {
        await quizClient.publishQuiz(cid as string, qid as string, true);
        router.push(`/Courses/${cid}/Quizzes`);
      } else {
        router.push(`/Courses/${cid}/Quizzes/${qid}`);
      }
    }
  };

  const handleAddQuestion = () => {
    setEditingQuestion({
      _id: "new",
      quiz: qid as string,
      title: "New Question",
      type: "Multiple Choice",
      points: 1,
      question: "",
      choices: ["", "", "", ""],
      correctAnswer: 0,
    });
    setShowQuestionEditor(true);
  };

  const handleEditQuestion = (question: Question) => {
    setEditingQuestion(question);
    setShowQuestionEditor(true);
  };

  const handleDeleteQuestion = async (questionId: string) => {
    if (window.confirm("Are you sure you want to delete this question?")) {
      await questionClient.deleteQuestion(qid as string, questionId);
      const updated = await questionClient.getQuestionsForQuiz(qid as string);
      dispatch(setQuestions(updated));

      const totalPoints = updated.reduce((sum: number, q: Question) => sum + q.points, 0);
      setQuiz({ ...quiz, points: totalPoints });
    }
  };

  const handleSaveQuestion = async (question: Question) => {
    if (question._id === "new") {
      await questionClient.createQuestion(qid as string, question);
    } else {
      await questionClient.updateQuestion(qid as string, question);
    }

    const updated = await questionClient.getQuestionsForQuiz(qid as string);
    dispatch(setQuestions(updated));

    const totalPoints = updated.reduce((sum: number, q: Question) => sum + q.points, 0);
    setQuiz({ ...quiz, points: totalPoints });

    setShowQuestionEditor(false);
    setEditingQuestion(null);
  };

  const handleAddQuestionsFromBank = async (selectedQuestions: Question[]) => {
    // Create copies of selected questions for this quiz
    for (const question of selectedQuestions) {
      const newQuestion = {
        ...question,
        _id: undefined, // Let backend assign new ID
        quiz: qid,
      };
      // Remove _id to ensure createQuestion treats it as new
      delete (newQuestion as any)._id;
      await questionClient.createQuestion(qid as string, newQuestion);
    }

    const updated = await questionClient.getQuestionsForQuiz(qid as string);
    dispatch(setQuestions(updated));

    const totalPoints = updated.reduce((sum: number, q: Question) => sum + q.points, 0);
    setQuiz({ ...quiz, points: totalPoints });
  };

  // Group Handlers
  const handleAddGroup = () => {
    setEditingGroup({
      _id: "new",
      title: "New Question Group",
      quiz: qid as string,
      course: cid as string,
      pointsPerQuestion: 1,
      pickCount: 1,
    });
    setShowGroupEditor(true);
  };

  const handleEditGroup = (group: QuestionGroup) => {
    setEditingGroup(group);
    setShowGroupEditor(true);
  };

  const handleSaveGroup = async (group: QuestionGroup) => {
    if (group._id === "new") {
      await groupClient.createGroup(qid as string, group);
    } else {
      await groupClient.updateGroup(qid as string, group._id, group);
    }
    const updatedGroups = await groupClient.getGroupsForQuiz(qid as string);
    setGroups(updatedGroups);
    setShowGroupEditor(false);
    setEditingGroup(null);
  };

  const handleDeleteGroup = async (groupId: string) => {
    if (window.confirm("Are you sure you want to delete this group? Questions in this group will be ungrouped.")) {
      await groupClient.deleteGroup(qid as string, groupId);
      const updatedGroups = await groupClient.getGroupsForQuiz(qid as string);
      setGroups(updatedGroups);

      // Ideally we should also update questions to remove group reference, 
      // but backend deleteGroup could handle this or we just leave them orphaned (they will show as ungrouped)
    }
  };

  const quizQuestions = reduxQuestions.filter((q: Question) => q.quiz === qid);
  const ungroupedQuestions = quizQuestions.filter((q: Question) => !q.questionGroup);

  return (
    <div id="wd-quiz-editor" className="p-4">
      <h3 className="mb-4">{qid === "new" ? "Create New Quiz" : "Edit Quiz"}</h3>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")} className="mb-3">
        <Tab eventKey="details" title="Details">
          <Form>
            {/* Assignment Name */}
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
                placeholder="Unnamed Quiz"
                className="fs-5"
              />
            </Form.Group>

            {/* Quiz Instructions */}
            <Form.Group className="mb-3">
              <Form.Control
                as="textarea"
                rows={6}
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
                placeholder="Enter quiz instructions..."
              />
            </Form.Group>

            {/* Quiz Type */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Quiz Type
              </Form.Label>
              <div className="col-sm-9">
                <Form.Select
                  value={quiz.quizType}
                  onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                >
                  <option value="Graded Quiz">Graded Quiz</option>
                  <option value="Practice Quiz">Practice Quiz</option>
                  <option value="Graded Survey">Graded Survey</option>
                  <option value="Ungraded Survey">Ungraded Survey</option>
                </Form.Select>
              </div>
            </Form.Group>

            {/* Points */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Points
              </Form.Label>
              <div className="col-sm-9">
                <Form.Control type="number" value={quiz.points} readOnly disabled />
                <Form.Text className="text-muted">
                  Automatically calculated from questions
                </Form.Text>
              </div>
            </Form.Group>

            {/* Assignment Group */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Assignment Group
              </Form.Label>
              <div className="col-sm-9">
                <Form.Select
                  value={quiz.assignmentGroup}
                  onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                >
                  <option value="Quizzes">QUIZZES</option>
                  <option value="Exams">EXAMS</option>
                  <option value="Assignments">ASSIGNMENTS</option>
                  <option value="Project">PROJECT</option>
                </Form.Select>
              </div>
            </Form.Group>

            {/* Options Section */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Options
              </Form.Label>
              <div className="col-sm-9">
                <div className="border rounded p-3">
                  <Form.Check
                    type="checkbox"
                    label="Shuffle Answers"
                    checked={quiz.shuffleAnswers}
                    onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                    className="mb-2"
                  />

                  <div className="row mb-2">
                    <Form.Label className="col-sm-4 col-form-label">Time Limit</Form.Label>
                    <div className="col-sm-8">
                      <div className="input-group">
                        <Form.Control
                          type="number"
                          value={quiz.timeLimit}
                          onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
                        />
                        <span className="input-group-text">Minutes</span>
                      </div>
                    </div>
                  </div>

                  <Form.Check
                    type="checkbox"
                    label="Allow Multiple Attempts"
                    checked={quiz.multipleAttempts}
                    onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                    className="mb-2"
                  />

                  {quiz.multipleAttempts && (
                    <div className="row mb-2 ms-4">
                      <Form.Label className="col-sm-5 col-form-label">How Many Attempts</Form.Label>
                      <div className="col-sm-7">
                        <Form.Control
                          type="number"
                          value={quiz.howManyAttempts}
                          onChange={(e) => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) || 1 })}
                          min="1"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </Form.Group>

            {/* Show Correct Answers */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Show Correct Answers
              </Form.Label>
              <div className="col-sm-9">
                <Form.Select
                  value={quiz.showCorrectAnswers}
                  onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
                  className="mb-2"
                >
                  <option value="immediately">Immediately</option>
                  <option value="after_due_date">After Due Date</option>
                  <option value="after_last_attempt">After Last Attempt</option>
                  <option value="after_specific_date">After Specific Date</option>
                  <option value="never">Never</option>
                </Form.Select>

                {quiz.showCorrectAnswers === "after_specific_date" && (
                  <Form.Control
                    type="datetime-local"
                    value={quiz.showCorrectAnswersDate}
                    onChange={(e) => setQuiz({ ...quiz, showCorrectAnswersDate: e.target.value })}
                  />
                )}
              </div>
            </Form.Group>

            {/* Access Code */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Access Code
              </Form.Label>
              <div className="col-sm-9">
                <Form.Control
                  type="text"
                  value={quiz.accessCode}
                  onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                  placeholder="Leave blank for no access code"
                />
              </div>
            </Form.Group>

            {/* Quiz Restrictions */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Quiz Restrictions
              </Form.Label>
              <div className="col-sm-9">
                <div className="border rounded p-3">
                  <Form.Check
                    type="checkbox"
                    label="One Question at a Time"
                    checked={quiz.oneQuestionAtATime}
                    onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                    className="mb-2"
                  />

                  <Form.Check
                    type="checkbox"
                    label="Webcam Required"
                    checked={quiz.webcamRequired}
                    onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                    className="mb-2"
                  />

                  <Form.Check
                    type="checkbox"
                    label="Lock Questions After Answering"
                    checked={quiz.lockQuestionsAfterAnswering}
                    onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                  />
                </div>
              </div>
            </Form.Group>

            {/* Assign Section */}
            <Form.Group as="div" className="row mb-3">
              <Form.Label className="col-sm-3 col-form-label text-end">
                Assign
              </Form.Label>
              <div className="col-sm-9">
                <div className="border rounded p-3">
                  <Form.Label className="fw-bold mb-2">Due</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={quiz.dueDate}
                    onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                    className="mb-3"
                  />

                  <div className="row mb-3">
                    <div className="col-md-6">
                      <Form.Label className="fw-bold mb-2">Available from</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={quiz.availableDate}
                        onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                      />
                    </div>
                    <div className="col-md-6">
                      <Form.Label className="fw-bold mb-2">Until</Form.Label>
                      <Form.Control
                        type="datetime-local"
                        value={quiz.availableUntilDate}
                        onChange={(e) => setQuiz({ ...quiz, availableUntilDate: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </Form.Group>
          </Form>
        </Tab>

        <Tab eventKey="questions" title="Questions" disabled={qid === "new"}>
          <div className="mb-3 d-flex justify-content-between align-items-center">
            <h5>Manage Questions</h5>
            <div className="d-flex gap-2">
              <Button variant="secondary" onClick={handleAddGroup}>
                <FaPlus /> Group
              </Button>
              <Button variant="secondary" onClick={() => setShowFindQuestionsModal(true)}>
                <BsSearch /> Find Questions
              </Button>
              <Button variant="danger" onClick={handleAddQuestion}>
                <FaPlus /> New Question
              </Button>
            </div>
          </div>

          {qid === "new" && (
            <div className="alert alert-info">
              Please save the quiz first before adding questions.
            </div>
          )}

          {showGroupEditor && editingGroup && (
            <QuestionGroupEditor
              group={editingGroup}
              onSave={handleSaveGroup}
              onCancel={() => {
                setShowGroupEditor(false);
                setEditingGroup(null);
              }}
            />
          )}

          {showQuestionEditor && editingQuestion && (
            <QuestionEditor
              question={editingQuestion}
              onSave={handleSaveQuestion}
              onCancel={() => {
                setShowQuestionEditor(false);
                setEditingQuestion(null);
              }}
              groups={groups}
            />
          )}

          {!showQuestionEditor && !showGroupEditor && quizQuestions.length === 0 && groups.length === 0 && (
            <div className="text-center py-5 text-muted">
              No questions yet. Click "New Question" to add one.
            </div>
          )}

          {/* Render Groups */}
          {groups.map((group) => {
            const groupQuestions = quizQuestions.filter((q: Question) => q.questionGroup === group._id);
            return (
              <div key={group._id} className="card mb-3 border-secondary">
                <div className="card-header bg-secondary text-white d-flex justify-content-between align-items-center">
                  <div>
                    <strong>{group.title}</strong>
                    <span className="ms-3 small">Pick {group.pickCount} questions, {group.pointsPerQuestion} pts each</span>
                  </div>
                  <div>
                    <Button variant="link" className="text-white p-0 me-2" onClick={() => handleEditGroup(group)}>
                      <FaEdit />
                    </Button>
                    <Button variant="link" className="text-white p-0" onClick={() => handleDeleteGroup(group._id)}>
                      <FaTrash />
                    </Button>
                  </div>
                </div>
                <div className="card-body p-0">
                  {groupQuestions.length === 0 ? (
                    <div className="p-3 text-center text-muted small">No questions in this group.</div>
                  ) : (
                    <ul className="list-group list-group-flush">
                      {groupQuestions.map((q: Question, index: number) => (
                        <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center ps-4">
                          <div>
                            <strong>Q:</strong> {q.title} <span className="badge bg-secondary">{q.type}</span>
                          </div>
                          <div>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              className="me-2"
                              onClick={() => handleEditQuestion(q)}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDeleteQuestion(q._id)}
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            );
          })}

          {/* Render Ungrouped Questions */}
          {ungroupedQuestions.length > 0 && (
            <div>
              {groups.length > 0 && <h6 className="mt-4 mb-2">Ungrouped Questions</h6>}
              <ul className="list-group">
                {ungroupedQuestions.map((q: Question, index: number) => (
                  <li key={q._id} className="list-group-item d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Q:</strong> {q.title} <span className="badge bg-secondary">{q.type}</span> - {q.points} pts
                    </div>
                    <div>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-2"
                        onClick={() => handleEditQuestion(q)}
                      >
                        <FaEdit />
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleDeleteQuestion(q._id)}
                      >
                        <FaTrash />
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Tab>
      </Tabs>

      <hr />

      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={() => router.push(`/Courses/${cid}/Quizzes`)}>
          Cancel
        </Button>
        <Button variant="primary" onClick={() => handleSave(false)}>
          Save
        </Button>
        <Button variant="danger" onClick={() => handleSave(true)}>
          Save & Publish
        </Button>
      </div>

      <FindQuestionsModal
        show={showFindQuestionsModal}
        onHide={() => setShowFindQuestionsModal(false)}
        onAddQuestions={handleAddQuestionsFromBank}
        courseId={cid as string}
      />
    </div>
  );
}

// Question Editor Component
function QuestionEditor({
  question,
  onSave,
  onCancel,
  groups,
}: {
  question: Question;
  onSave: (question: Question) => void;
  onCancel: () => void;
  groups: QuestionGroup[];
}) {
  const [editedQuestion, setEditedQuestion] = useState<Question>(question);

  // Parse variables from question text for Fill in Multiple Blanks
  useEffect(() => {
    if (editedQuestion.type === "Fill in the Blank") {
      const regex = /\[(.*?)\]/g;
      const matches = [...editedQuestion.question.matchAll(regex)];
      const variables = matches.map(m => m[1]);

      // Initialize possibleAnswers for new variables
      if (variables.length > 0) {
        const currentAnswers = editedQuestion.possibleAnswers || [];
        const newAnswers = variables.map(variable => {
          const existing = currentAnswers.find(a => a.variable === variable);
          return existing || { variable, answers: [""] };
        });

        // Only update if there's a change to avoid infinite loop
        if (JSON.stringify(newAnswers) !== JSON.stringify(currentAnswers)) {
          setEditedQuestion(prev => ({ ...prev, possibleAnswers: newAnswers }));
        }
      }
    }
  }, [editedQuestion.question, editedQuestion.type]);

  const handleTypeChange = (type: Question["type"]) => {
    if (type === "Multiple Choice") {
      setEditedQuestion({
        ...editedQuestion,
        type,
        choices: ["", "", "", ""],
        correctAnswer: 0,
        possibleAnswers: undefined,
        caseSensitive: undefined,
      });
    } else if (type === "True/False") {
      setEditedQuestion({
        ...editedQuestion,
        type,
        correctAnswer: true,
        choices: undefined,
        possibleAnswers: undefined,
        caseSensitive: undefined,
      });
    } else if (type === "Fill in the Blank") {
      setEditedQuestion({
        ...editedQuestion,
        type,
        possibleAnswers: [], // Will be populated by useEffect based on text
        caseSensitive: false,
        choices: undefined,
        correctAnswer: undefined,
      });
    }
  };

  const handleAddChoice = () => {
    if (editedQuestion.choices) {
      setEditedQuestion({
        ...editedQuestion,
        choices: [...editedQuestion.choices, ""],
      });
    }
  };

  const handleRemoveChoice = (index: number) => {
    if (editedQuestion.choices && editedQuestion.choices.length > 2) {
      const newChoices = editedQuestion.choices.filter((_, i) => i !== index);
      setEditedQuestion({
        ...editedQuestion,
        choices: newChoices,
        correctAnswer: editedQuestion.correctAnswer === index ? 0 : editedQuestion.correctAnswer,
      });
    }
  };

  const handleAddAnswerForVariable = (variableIndex: number) => {
    if (editedQuestion.possibleAnswers) {
      const newPossibleAnswers = [...editedQuestion.possibleAnswers];
      newPossibleAnswers[variableIndex].answers.push("");
      setEditedQuestion({ ...editedQuestion, possibleAnswers: newPossibleAnswers });
    }
  };

  const handleRemoveAnswerForVariable = (variableIndex: number, answerIndex: number) => {
    if (editedQuestion.possibleAnswers) {
      const newPossibleAnswers = [...editedQuestion.possibleAnswers];
      if (newPossibleAnswers[variableIndex].answers.length > 1) {
        newPossibleAnswers[variableIndex].answers = newPossibleAnswers[variableIndex].answers.filter((_, i) => i !== answerIndex);
        setEditedQuestion({ ...editedQuestion, possibleAnswers: newPossibleAnswers });
      }
    }
  };

  const handleAnswerChangeForVariable = (variableIndex: number, answerIndex: number, value: string) => {
    if (editedQuestion.possibleAnswers) {
      const newPossibleAnswers = [...editedQuestion.possibleAnswers];
      newPossibleAnswers[variableIndex].answers[answerIndex] = value;
      setEditedQuestion({ ...editedQuestion, possibleAnswers: newPossibleAnswers });
    }
  };

  return (
    <div className="border rounded p-4 mb-3 bg-light">
      <h5 className="mb-3">Question Editor</h5>

      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Question Title</Form.Label>
          <Form.Control
            type="text"
            value={editedQuestion.title}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, title: e.target.value })}
          />
        </Form.Group>

        <div className="row mb-3">
          <div className="col-md-4">
            <Form.Label>Question Type</Form.Label>
            <Form.Select
              value={editedQuestion.type}
              onChange={(e) => handleTypeChange(e.target.value as Question["type"])}
            >
              <option value="Multiple Choice">Multiple Choice</option>
              <option value="True/False">True/False</option>
              <option value="Fill in the Blank">Fill in Multiple Blanks</option>
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Group</Form.Label>
            <Form.Select
              value={editedQuestion.questionGroup || ""}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, questionGroup: e.target.value || undefined })}
            >
              <option value="">Ungrouped</option>
              {groups.map((g) => (
                <option key={g._id} value={g._id}>
                  {g.title}
                </option>
              ))}
            </Form.Select>
          </div>
          <div className="col-md-4">
            <Form.Label>Points</Form.Label>
            <Form.Control
              type="number"
              value={editedQuestion.points}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, points: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
        </div>

        <Form.Group className="mb-3">
          <Form.Label>Question Text</Form.Label>
          <Form.Text className="text-muted d-block mb-2">
            {editedQuestion.type === "Fill in the Blank"
              ? "Use [variable] to create blanks. Example: 'Roses are [color1], violets are [color2]'"
              : "Enter the question text"}
          </Form.Text>
          <Form.Control
            as="textarea"
            rows={3}
            value={editedQuestion.question}
            onChange={(e) => setEditedQuestion({ ...editedQuestion, question: e.target.value })}
          />
        </Form.Group>

        {editedQuestion.type === "Multiple Choice" && editedQuestion.choices && (
          <div className="mb-3">
            <Form.Label className="fw-bold">Answer Choices</Form.Label>
            <small className="text-muted d-block mb-2">Select the correct answer with the radio button</small>
            {editedQuestion.choices.map((choice, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Check
                  type="radio"
                  name="correctAnswer"
                  checked={editedQuestion.correctAnswer === index}
                  onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: index })}
                  className="me-2"
                />
                <Form.Control
                  type="text"
                  value={choice}
                  onChange={(e) => {
                    const newChoices = [...editedQuestion.choices!];
                    newChoices[index] = e.target.value;
                    setEditedQuestion({ ...editedQuestion, choices: newChoices });
                  }}
                  placeholder={`Choice ${index + 1}`}
                />
                {editedQuestion.choices!.length > 2 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    className="ms-2"
                    onClick={() => handleRemoveChoice(index)}
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline-secondary" size="sm" onClick={handleAddChoice}>
              <FaPlus /> Add Choice
            </Button>
          </div>
        )}

        {editedQuestion.type === "True/False" && (
          <div className="mb-3">
            <Form.Label className="fw-bold">Correct Answer</Form.Label>
            <div>
              <Form.Check
                type="radio"
                label="True"
                name="tfAnswer"
                checked={editedQuestion.correctAnswer === true}
                onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: true })}
              />
              <Form.Check
                type="radio"
                label="False"
                name="tfAnswer"
                checked={editedQuestion.correctAnswer === false}
                onChange={() => setEditedQuestion({ ...editedQuestion, correctAnswer: false })}
              />
            </div>
          </div>
        )}

        {editedQuestion.type === "Fill in the Blank" && editedQuestion.possibleAnswers && (
          <div className="mb-3">
            <Form.Label className="fw-bold">Correct Answers</Form.Label>
            {editedQuestion.possibleAnswers.length === 0 ? (
              <div className="alert alert-warning">
                No blanks detected. Add variables like [color] in the question text above.
              </div>
            ) : (
              editedQuestion.possibleAnswers.map((pa, vIndex) => (
                <div key={vIndex} className="card mb-3 p-3 bg-white">
                  <h6 className="fw-bold text-primary">Blank for [{pa.variable}]</h6>
                  <small className="text-muted d-block mb-2">List all acceptable answers for this blank</small>

                  {pa.answers.map((ans, aIndex) => (
                    <div key={aIndex} className="d-flex align-items-center mb-2">
                      <Form.Control
                        type="text"
                        value={ans}
                        onChange={(e) => handleAnswerChangeForVariable(vIndex, aIndex, e.target.value)}
                        placeholder={`Acceptable Answer ${aIndex + 1}`}
                      />
                      {pa.answers.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          className="ms-2"
                          onClick={() => handleRemoveAnswerForVariable(vIndex, aIndex)}
                        >
                          <FaTrash />
                        </Button>
                      )}
                    </div>
                  ))}
                  <div>
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={() => handleAddAnswerForVariable(vIndex)}
                    >
                      <FaPlus /> Add Another Answer
                    </Button>
                  </div>
                </div>
              ))
            )}

            <Form.Check
              type="checkbox"
              label="Case Sensitive"
              checked={editedQuestion.caseSensitive}
              onChange={(e) => setEditedQuestion({ ...editedQuestion, caseSensitive: e.target.checked })}
              className="mt-3"
            />
          </div>
        )}

        <div className="d-flex justify-content-end gap-2 mt-4">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onSave(editedQuestion)}>
            {question._id === "new" ? "Add Question" : "Update Question"}
          </Button>
        </div>
      </Form>
    </div>
  );
}
