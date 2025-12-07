"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import * as client from "../Courses/client";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse, setCourses } from "../Courses/reducer";
import { setEnrollments as setEnrollmentsInStore } from "../Database/enrollments/reducer";
import { RootState } from "../store";
import * as enrollmentsClient from "../Database/enrollments/client";
import { Enrollment } from "../Database/enrollments/types";
import { Course } from "../Database/types";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  // Track enrolled course IDs instead of enrollment objects
  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>([]);
  const dispatch = useDispatch();

  // State to toggle between showing all courses vs enrolled courses
  const [showAllCourses, setShowAllCourses] = useState(false);

  const isFaculty = (currentUser && typeof currentUser === "object" && "role" in currentUser)
    ? (currentUser as { role?: string }).role === "FACULTY"
    : false;

  // Convert course into a state variable so we can change it
  // and force a redraw of the UI
  const [course, setCourse] = useState<Course>({
    _id: "0",
    name: "New Course",
    number: "New Number",
    startDate: "2023-09-10",
    endDate: "2023-12-15",
    department: "New Department",
    credits: 3,
    image: "/images/reactjs.jpg",
    description: "New Description"
  });

  // Fetch courses and enrollments when user or showAllCourses changes
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        let courses;
        if (showAllCourses) {
          courses = await client.fetchAllCourses();
        } else {
          courses = await client.findMyCourses();
        }
        dispatch(setCourses(courses));
      } catch (error) {
        console.error(error);
      }
    };
    fetchCourses();
    const fetchEnrollments = async () => {
      if (currentUser && typeof currentUser === "object" && "_id" in currentUser) {
        try {
          const enrolledCourses = await enrollmentsClient.getEnrollmentsForUser((currentUser as { _id: string })._id);
          // Extract course IDs from the returned courses
          const courseIds = enrolledCourses.map((course: any) => course._id);
          setEnrolledCourseIds(courseIds);
          // Populate Redux store with enrolled courses for course layout check
          dispatch(setEnrollmentsInStore(enrolledCourses));
        } catch {
          setEnrolledCourseIds([]);
        }
      } else {
        setEnrolledCourseIds([]);
      }
    };
    fetchEnrollments();
  }, [currentUser, showAllCourses, dispatch]);

  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.includes(courseId);
  };

  const onAddNewCourse = async () => {
    const newCourse = await client.createCourse(course);
    dispatch(setCourses([...courses, newCourse]));
  };
  const onDeleteCourse = async (courseId: string) => {
    await client.deleteCourse(courseId);
    dispatch(setCourses(courses.filter((course) => course._id !== courseId)));
  };
  const onUpdateCourse = async () => {
    await client.updateCourse(course);
    dispatch(setCourses(courses.map((c) => {
      if (c._id === course._id) { return course; }
      else { return c; }
    })));
  };


  // Handle enroll action
  const handleEnroll = async (courseId: string) => {
    if (!currentUser || typeof currentUser !== "object" || !("_id" in currentUser)) return;
    try {
      await enrollmentsClient.enrollUserInCourse((currentUser as { _id: string })._id, courseId);
      // Refresh enrolled course IDs
      const enrolledCourses = await enrollmentsClient.getEnrollmentsForUser((currentUser as { _id: string })._id);
      const courseIds = enrolledCourses.map((course: any) => course._id);
      setEnrolledCourseIds(courseIds);
      // Update Redux store
      dispatch(setEnrollmentsInStore(enrolledCourses));
    } catch {
      // Optionally show error
    }
  };

  // Handle unenroll action
  const handleUnenroll = async (courseId: string) => {
    if (!currentUser || typeof currentUser !== "object" || !("_id" in currentUser)) return;
    try {
      await enrollmentsClient.unenrollUserFromCourse((currentUser as { _id: string })._id, courseId);
      // Refresh enrolled course IDs
      const enrolledCourses = await enrollmentsClient.getEnrollmentsForUser((currentUser as { _id: string })._id);
      const courseIds = enrolledCourses.map((course: any) => course._id);
      setEnrolledCourseIds(courseIds);
      // Update Redux store
      dispatch(setEnrollmentsInStore(enrolledCourses));
    } catch {
      // Optionally show error
    }
  };

  // Filter courses based on showAllCourses state
  const displayedCourses = showAllCourses
    ? courses
    : courses.filter((course) => isEnrolled(course._id));

  return (
    <div className="p-4" id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      {isFaculty && (
        <>
          <h5>New Course
            <button
              className="btn btn-primary float-end"
              id="wd-add-new-course-click"
              onClick={onAddNewCourse}
            >
              Add
            </button>
            <button
              className="btn btn-secondary float-end me-2"
              id="wd-update-course-click"
              onClick={onUpdateCourse}
            >
              Update
            </button>
          </h5>
          <br />
          {/* Add input elements for each of fields in course state variable */}
          <Form.Control
            value={course.name}
            className="mb-2"
            onChange={(e) => setCourse({ ...course, name: e.target.value })}
          />
          <Form.Control
            as="textarea"
            value={course.description}
            rows={3}
            onChange={(e) => setCourse({ ...course, description: e.target.value })}
          />
          <hr />
        </>
      )}
      <h2 id="wd-dashboard-published">
        Published Courses ({displayedCourses.length})
        <button
          onClick={() => setShowAllCourses(!showAllCourses)}
          className="btn btn-primary float-end"
          id="wd-enrollments-button"
        >
          {showAllCourses ? "My Courses" : "All Courses"}
        </button>
      </h2>
      <hr />
      <div id="wd-dashboard-courses">
        <Row>
          {displayedCourses.map((course) => (
            <Col key={course._id} className="wd-dashboard-course mb-4" style={{ width: "300px" }}>
              <Card className="h-100">
                <Link href={`/Courses/${course._id}/Home`}
                  className="wd-dashboard-course-link text-decoration-none text-dark" >
                  <CardImg src={course.image || "/images/reactjs.jpg"} variant="top" width="100%" height={160} />
                  <CardBody className="card-body">
                    <CardTitle className="wd-dashboard-course-title text-nowrap overflow-hidden">
                      {course.name} </CardTitle>
                    <CardText className="wd-dashboard-course-description overflow-hidden" style={{ height: "100px" }}>
                      {course.description} </CardText>

                    {isEnrolled(course._id) && (
                      <Button variant="primary"> Go </Button>
                    )}

                    {/* Show Enroll/Unenroll buttons */}
                    {isEnrolled(course._id) ? (
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          handleUnenroll(course._id);
                        }}
                        variant="danger"
                        className="float-end"
                        id="wd-unenroll-course-click"
                      >
                        Unenroll
                      </Button>
                    ) : (
                      <Button
                        onClick={(event) => {
                          event.preventDefault();
                          handleEnroll(course._id);
                        }}
                        variant="success"
                        className="float-end"
                        id="wd-enroll-course-click"
                      >
                        Enroll
                      </Button>
                    )}

                    {/* Faculty-only buttons */}
                    {isFaculty && (
                      <>
                        <Button
                          onClick={(event) => {
                            event.preventDefault();
                            onDeleteCourse(course._id);
                          }}
                          variant="danger"
                          className="float-end me-2"
                          id="wd-delete-course-click"
                        >
                          Delete
                        </Button>
                        <Button
                          id="wd-edit-course-click"
                          onClick={(event) => {
                            event.preventDefault();
                            setCourse(course);
                          }}
                          variant="warning"
                          className="me-2 float-end"
                        >
                          Edit
                        </Button>
                      </>
                    )}
                  </CardBody>
                </Link>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>);
}

