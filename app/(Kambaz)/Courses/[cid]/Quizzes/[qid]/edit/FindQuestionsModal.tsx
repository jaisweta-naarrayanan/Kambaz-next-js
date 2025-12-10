import React, { useEffect, useState } from "react";
import { Modal, Button, ListGroup, Form } from "react-bootstrap";
import { Question } from "@/app/(Kambaz)/Database/types";
import * as client from "../../Questions/client";

interface FindQuestionsModalProps {
  show: boolean;
  onHide: () => void;
  onAddQuestions: (selectedQuestions: Question[]) => void;
  courseId: string;
}

export default function FindQuestionsModal({
  show,
  onHide,
  onAddQuestions,
  courseId,
}: FindQuestionsModalProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (show && courseId) {
      const fetchQuestions = async () => {
        const data = await client.getQuestionsForCourse(courseId);
        setQuestions(data);
      };
      fetchQuestions();
    }
  }, [show, courseId]);

  const handleCheckboxChange = (questionId: string) => {
    const newSelected = new Set(selectedQuestionIds);
    if (newSelected.has(questionId)) {
      newSelected.delete(questionId);
    } else {
      newSelected.add(questionId);
    }
    setSelectedQuestionIds(newSelected);
  };

  const handleAdd = () => {
    const selected = questions.filter((q) => selectedQuestionIds.has(q._id));
    onAddQuestions(selected);
    setSelectedQuestionIds(new Set());
    onHide();
  };

  return (
    <Modal show={show} onHide={onHide} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Find Questions</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <ListGroup>
          {questions.map((question) => (
            <ListGroup.Item key={question._id} className="d-flex align-items-start">
              <Form.Check
                type="checkbox"
                id={`question-${question._id}`}
                checked={selectedQuestionIds.has(question._id)}
                onChange={() => handleCheckboxChange(question._id)}
                className="me-3 mt-1"
              />
              <div>
                <div className="fw-bold">{question.title}</div>
                <div
                  className="text-muted small"
                  dangerouslySetInnerHTML={{ __html: question.question }}
                />
              </div>
            </ListGroup.Item>
          ))}
          {questions.length === 0 && (
            <div className="text-center p-3 text-muted">No questions found for this course.</div>
          )}
        </ListGroup>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleAdd} disabled={selectedQuestionIds.size === 0}>
          Add Selected Questions
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
