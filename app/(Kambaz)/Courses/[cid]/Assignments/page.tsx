"use client";
import Link from "next/link";
import { Button } from "react-bootstrap";
import { FaPlus, FaCheckCircle } from "react-icons/fa";
import { BsGripVertical, BsPlus } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { GoTriangleDown } from "react-icons/go";
import { CiSearch } from "react-icons/ci";
import { MdOutlineAssignment } from "react-icons/md";

export default function Assignments() {
  return (
    <div id="wd-assignments">
    {/* Search and Buttons Row */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="position-relative" style={{ width: "300px" }}>
          <CiSearch className="position-absolute me-3" style={{ left: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "20px" }} />
          <input
            placeholder="Search..."
            id="wd-search-assignment"
            className="form-control ps-5"
          />
        </div>
        <div>
          <button id="wd-add-assignment-group" className="btn btn-secondary me-2">
            <BsPlus className="fs-4" /> Group
          </button>
          <button id="wd-add-assignment" className="btn btn-danger">
            <BsPlus className="fs-4" /> Assignment
          </button>
        </div>
      </div>

      {/* Assignments List */}
      <ul id="wd-assignment-list" className="list-group rounded-0">
        {/* Assignment Header */}
        <li className="wd-assignment-list-item list-group-item p-3 ps-1 fs-5 border-gray">
          <div className="d-flex align-items-center">
            <BsGripVertical className="me-2 fs-3" />
            <GoTriangleDown className="me-2" />
            <strong id="wd-assignments-title">ASSIGNMENTS</strong>
            <span className="ms-2 text-muted" style={{ fontSize: "0.9rem" }}>40% of Total</span>
            <div className="ms-auto">
              <Button variant="outline-secondary" size="sm" className="border-0 me-1">
                <FaPlus />
              </Button>
              <Button variant="outline-secondary" size="sm" className="border-0">
                <IoEllipsisVertical />
              </Button>
            </div>
          </div>
        </li>

        {/* Assignment 1 */}
                {/* Assignment Items */}
        <li className="wd-assignment-list-item wd-assignment list-group-item p-3 ps-1">
          <div className="d-flex align-items-start">
            <BsGripVertical className="me-2 fs-5" />
            <MdOutlineAssignment className="me-3 fs-4 text-success" />
            <div className="flex-grow-1">
              <Link
                href="/Courses/1234/Assignments/123"
                className="wd-assignment-link text-dark text-decoration-none fw-bold"
              >
                A1
              </Link>
              <div className="text-muted small">
                <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 6 at 12:00am |{" "}
                <strong>Due</strong> May 13 at 11:59pm | 100 pts
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success me-2 fs-5" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </li>

        <li className="wd-assignment-list-item wd-assignment list-group-item p-3 ps-1">
          <div className="d-flex align-items-start">
            <BsGripVertical className="me-2 fs-5" />
            <MdOutlineAssignment className="me-3 fs-4 text-success" />
            <div className="flex-grow-1">
              <Link
                href="/Courses/1234/Assignments/124"
                className="wd-assignment-link text-dark text-decoration-none fw-bold"
              >
                A2
              </Link>
              <div className="text-muted small">
                <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 13 at 12:00am |{" "}
                <strong>Due</strong> May 20 at 11:59pm | 100 pts
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success me-2 fs-5" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </li>

        <li className="wd-assignment-list-item wd-assignment list-group-item p-3 ps-1">
          <div className="d-flex align-items-start">
            <BsGripVertical className="me-2 fs-5" />
            <MdOutlineAssignment className="me-3 fs-4 text-success" />
            <div className="flex-grow-1">
              <Link
                href="/Courses/1234/Assignments/125"
                className="wd-assignment-link text-dark text-decoration-none fw-bold"
              >
                A3
              </Link>
              <div className="text-muted small">
                <span className="text-danger">Multiple Modules</span> | <strong>Not available until</strong> May 20 at 12:00am |{" "}
                <strong>Due</strong> May 27 at 11:59pm | 100 pts
              </div>
            </div>
            <div className="d-flex align-items-center">
              <FaCheckCircle className="text-success me-2 fs-5" />
              <IoEllipsisVertical className="fs-4" />
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
}

