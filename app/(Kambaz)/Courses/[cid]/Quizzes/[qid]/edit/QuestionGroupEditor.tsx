import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { QuestionGroup } from "@/app/(Kambaz)/Database/types";

interface QuestionGroupEditorProps {
  group: QuestionGroup;
  onSave: (group: QuestionGroup) => void;
  onCancel: () => void;
}

export default function QuestionGroupEditor({
  group,
  onSave,
  onCancel,
}: QuestionGroupEditorProps) {
  const [editedGroup, setEditedGroup] = useState<QuestionGroup>(group);

  return (
    <div className="border rounded p-4 mb-3 bg-light">
      <h5 className="mb-3">Question Group</h5>
      <Form>
        <Form.Group className="mb-3">
          <Form.Label>Group Name</Form.Label>
          <Form.Control
            type="text"
            value={editedGroup.title}
            onChange={(e) => setEditedGroup({ ...editedGroup, title: e.target.value })}
          />
        </Form.Group>

        <div className="row mb-3">
          <div className="col-md-6">
            <Form.Label>Pick</Form.Label>
            <Form.Control
              type="number"
              value={editedGroup.pickCount}
              onChange={(e) => setEditedGroup({ ...editedGroup, pickCount: parseInt(e.target.value) || 1 })}
              min="1"
            />
            <Form.Text className="text-muted">questions</Form.Text>
          </div>
          <div className="col-md-6">
            <Form.Label>Points per Question</Form.Label>
            <Form.Control
              type="number"
              value={editedGroup.pointsPerQuestion}
              onChange={(e) => setEditedGroup({ ...editedGroup, pointsPerQuestion: parseInt(e.target.value) || 0 })}
              min="0"
            />
          </div>
        </div>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => onSave(editedGroup)}>
            Save Group
          </Button>
        </div>
      </Form>
    </div>
  );
}
