"use client";
import { Form, Button } from "react-bootstrap";

export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor" className="p-4">
      <Form>
        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-name">Assignment Name</Form.Label>
          <Form.Control
            id="wd-name"
            type="text"
            defaultValue="A1"
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label htmlFor="wd-description">Description</Form.Label>
          <Form.Control
            as="textarea"
            id="wd-description"
            rows={10}
            defaultValue={`The assignment is available online

Submit a link to the landing page of your Web application running on Netlify.

The landing page should include the following:

- Your full name and section
- Links to each of the lab assignments
- Link to the Kanbas application
- Links to all relevant source code repositories

The Kanbas application should include a link to navigate back to the landing page.`}
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
              defaultValue={100}
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
                defaultValue="2024-05-13T23:59"
                className="mb-3"
              />

              <div className="row">
                <div className="col-md-6">
                  <Form.Label htmlFor="wd-available-from" className="fw-bold">
                    Available from
                  </Form.Label>
                  <Form.Control
                    id="wd-available-from"
                    type="datetime-local"
                    defaultValue="2024-05-06T00:00"
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label htmlFor="wd-available-until" className="fw-bold">
                    Until
                  </Form.Label>
                  <Form.Control
                    id="wd-available-until"
                    type="datetime-local"
                    defaultValue="2024-05-20T23:59"
                  />
                </div>
              </div>
            </div>
          </div>
        </Form.Group>

        <hr />

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button variant="danger">Save</Button>
        </div>
      </Form>
    </div>
  );
}