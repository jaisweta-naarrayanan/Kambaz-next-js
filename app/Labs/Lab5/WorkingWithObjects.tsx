"use client";
import React, { useState } from "react";
import { FormControl } from "react-bootstrap";
const HTTP_SERVER = process.env.NEXT_PUBLIC_HTTP_SERVER;
export default function WorkingWithObjects() {
  const [assignment, setAssignment] = useState({
    id: 1, title: "NodeJS Assignment",
    description: "Create a NodeJS server with ExpressJS",
    due: "2021-10-10", completed: false, score: 0,
  });
  const [moduleName, setModuleName] = useState("");
  const [moduleDescription, setModuleDescription] = useState("");
  const ASSIGNMENT_API_URL = `${HTTP_SERVER}/lab5/assignment`;
  const MODULE_API_URL = `${HTTP_SERVER}/lab5/module`;

  return (
    <div id="wd-working-with-objects">
      <h3>Working With Objects</h3>
      <h4>Retrieving Objects</h4>
      <a id="wd-retrieve-assignments" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment`}>
        Get Assignment
      </a><hr/>
      <h4>Retrieving Properties</h4>
      <a id="wd-retrieve-assignment-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/assignment/title`}>
        Get Title
      </a><hr/>
      <h4>Modifying Properties</h4>
      <a id="wd-update-assignment-title"
         className="btn btn-primary float-end"
         href={`${ASSIGNMENT_API_URL}/title/${assignment.title}`}>
        Update Title </a>
      <FormControl className="w-75" id="wd-assignment-title"
        value={assignment.title} onChange={(e) =>
          setAssignment({ ...assignment, title: e.target.value })}/>
      <hr />
      {/* Update Score */}
      <div className="mb-2">
        <label htmlFor="wd-assignment-score" className="me-2">Score:</label>
        <FormControl
          id="wd-assignment-score"
          type="number"
          className="d-inline w-auto me-2"
          value={assignment.score}
          onChange={e => setAssignment({ ...assignment, score: Number(e.target.value) })}
        />
        <a
          id="wd-update-assignment-score"
          className="btn btn-success"
          href={`${ASSIGNMENT_API_URL}/score/${assignment.score}`}
        >
          Update Score
        </a>
      </div>
      {/* Update Completed */}
      <div className="mb-2">
        <label htmlFor="wd-assignment-completed" className="me-2">Completed:</label>
        <input
          id="wd-assignment-completed"
          type="checkbox"
          className="form-check-input me-2"
          checked={assignment.completed}
          onChange={e => setAssignment({ ...assignment, completed: e.target.checked })}
        />
        <a
          id="wd-update-assignment-completed"
          className="btn btn-warning"
          href={`${ASSIGNMENT_API_URL}/completed/${assignment.completed}`}
        >
          Update Completed
        </a>
      </div>
      <hr />
      <h4>Working with Module Object</h4>
      {/* New: Get Module Name */}
      <a id="wd-retrieve-module" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/module`}>
        Get Module
      </a><hr/>
      <a id="wd-retrieve-module-title" className="btn btn-primary"
         href={`${HTTP_SERVER}/lab5/module/name`}>
        Get Module Title
      </a><hr/>
      {/* Edit Module Description */}
      <div className="mb-2">
        <label htmlFor="wd-module-description" className="me-2">Module Description:</label>
        <FormControl
          id="wd-module-description"
          type="text"
          className="d-inline w-50 me-2"
          value={moduleDescription}
          onChange={e => setModuleDescription(e.target.value)}
        />
        <a
          id="wd-update-module-description"
          className="btn btn-info mb-2"
          href={`${MODULE_API_URL}/description/${encodeURIComponent(moduleDescription)}`}
        >
          Update Module Description
        </a>
      </div>
      <hr/>
    </div>
  );
}