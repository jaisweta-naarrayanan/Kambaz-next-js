"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/app/(Kambaz)/store";
import { setAssignments } from "../reducer";
import * as client from "../client";
import { Form, Button } from "react-bootstrap";
import { Assignment } from "@/app/(Kambaz)/Database/types";

export default function AssignmentEditor() {
  const { aid, cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { assignments } = useSelector((state: RootState) => state.assignmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);

  // Check if user is faculty
  const isFaculty = (currentUser as any)?.role === "FACULTY";

  // Find the assignment by ID if editing
  const existingAssignment = aid !== "new"
    ? assignments.find((a: Assignment) => a._id === aid)
    : null;

  // Initialize form state
  const [assignment, setAssignment] = useState<any>({
    title: existingAssignment?.title || "",
    description: existingAssignment?.description || "",
    points: existingAssignment?.points || 100,
    dueDate: existingAssignment?.dueDate || "2024-05-13T23:59",
    availableFrom: existingAssignment?.availableFrom || "2024-05-06T00:00",
  });

  // Redirect students trying to create new assignments
  useEffect(() => {
    if (!isFaculty && aid === "new") {
      router.push(`/Courses/${cid}/Assignments`);
    }
  }, [isFaculty, aid, cid, router]);

  const handleSave = async () => {
    if (aid === "new") {
      await client.createAssignment(cid as string, { ...assignment, course: cid });
    } else {
      await client.updateAssignment(cid as string, { ...assignment, _id: aid, course: cid });
    }
    // Fetch updated assignments and update Redux
    const updatedAssignments = await client.getAssignmentsForCourse(cid as string);
    dispatch(setAssignments(updatedAssignments));
    router.push(`/Courses/${cid}/Assignments`);
  };

  const handleCancel = () => {
    router.push(`/Courses/${cid}/Assignments`);
  };

  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control
            id="wd-name"
            type="text"
            value={assignment.title}
            onChange={(e) => setAssignment({ ...assignment, title: e.target.value })}
            readOnly={!isFaculty}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            value={assignment.description}
            onChange={(e) => setAssignment({ ...assignment, description: e.target.value })}
            readOnly={!isFaculty}
          />
        </Form.Group>

        <Form.Group as="div" className="row mb-3">
          <Form.Label className="col-sm-3 col-form-label text-end">
            Points
          </Form.Label>
          <div className="col-sm-9">
            <Form.Control
              id="wd-points"
              type="number"
              value={assignment.points}
              onChange={(e) => setAssignment({ ...assignment, points: parseInt(e.target.value) })}
              readOnly={!isFaculty}
            />
          </div>
        </Form.Group>

        <Form.Group as="div" className="row mb-3">
          <Form.Label className="col-sm-3 col-form-label text-end">
            Assignment Group
          </Form.Label>
          <div className="col-sm-9">
            <Form.Select id="wd-group" defaultValue="ASSIGNMENTS">
              <option value="ASSIGNMENTS">ASSIGNMENTS</option>
              <option value="QUIZZES">QUIZZES</option>
              <option value="EXAMS">EXAMS</option>
              <option value="PROJECT">PROJECT</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group as="div" className="row mb-3">
          <Form.Label className="col-sm-3 col-form-label text-end">
            Display Grade as
          </Form.Label>
          <div className="col-sm-9">
            <Form.Select id="wd-display-grade-as" defaultValue="Percentage">
              <option value="Percentage">Percentage</option>
              <option value="Points">Points</option>
              <option value="Letter">Letter Grade</option>
            </Form.Select>
          </div>
        </Form.Group>

        <Form.Group as="div" className="row mb-3">
          <Form.Label className="col-sm-3 col-form-label text-end">
            Submission Type
          </Form.Label>
          <div className="col-sm-9">
            <div className="border rounded p-3">
              <Form.Select id="wd-submission-type" defaultValue="Online" className="mb-3">
                <option value="Online">Online</option>
                <option value="Paper">Paper</option>
                <option value="External">External Tool</option>
              </Form.Select>

              <Form.Label className="fw-bold mb-2">Online Entry Options</Form.Label>

              <Form.Check
                type="checkbox"
                id="wd-text-entry"
                label="Text Entry"
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="wd-website-url"
                label="Website URL"
                defaultChecked
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="wd-media-recordings"
                label="Media Recordings"
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="wd-student-annotation"
                label="Student Annotation"
                className="mb-2"
              />

              <Form.Check
                type="checkbox"
                id="wd-file-upload"
                label="File Uploads"
              />
            </div>
          </div>
        </Form.Group>

        <Form.Group as="div" className="row mb-3">
          <Form.Label className="col-sm-3 col-form-label text-end">
            Assign
          </Form.Label>
          <div className="col-sm-9">
            <div className="border rounded p-3">
              <Form.Label htmlFor="wd-assign-to" className="fw-bold">
                Assign to
              </Form.Label>
              <Form.Control
                id="wd-assign-to"
                type="text"
                defaultValue="Everyone"
                className="mb-3"
              />

              <Form.Label htmlFor="wd-due-date" className="fw-bold">
                Due
              </Form.Label>
              <Form.Control
                id="wd-due-date"
                type="datetime-local"
                value={assignment.dueDate}
                onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                className="mb-3"
                readOnly={!isFaculty}
              />

              <div className="row">
                <div className="col-md-6">
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <Form.Control
                    id="wd-available-from"
                    type="datetime-local"
                    value={assignment.availableFrom}
                    onChange={(e) => setAssignment({ ...assignment, availableFrom: e.target.value })}
                    readOnly={!isFaculty}
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">
                    Until
                  </Form.Label>
                  <Form.Control
                    id="wd-available-until"
                    type="datetime-local"
                    value={assignment.dueDate}
                    onChange={(e) => setAssignment({ ...assignment, dueDate: e.target.value })}
                    readOnly={!isFaculty}
                  />
                </div>
              </div>
            </div>
          </div>
        </Form.Group>

        <hr />

        {isFaculty && (
          <div className="d-flex justify-content-end gap-2">
            <Button variant="secondary" onClick={handleCancel}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleSave}>
              Save
            </Button>
          </div>
        )}
      </Form>
    </div>
  );
}