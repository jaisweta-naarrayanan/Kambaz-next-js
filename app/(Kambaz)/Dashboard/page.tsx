"use client"
import { useState } from "react";
import Link from "next/link";
import { Row, Col, Card, CardImg, CardBody, CardTitle, CardText, Button, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { addNewCourse, deleteCourse, updateCourse } from "../Courses/reducer";
import { enrollCourse, unenrollCourse } from "../Database/enrollments/reducer";
import { RootState } from "../store";

export default function Dashboard() {
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const dispatch = useDispatch();
  
  // State to toggle between showing all courses vs enrolled courses
  const [showAllCourses, setShowAllCourses] = useState(false);
  
  const isFaculty = (currentUser as any)?.role === "FACULTY";
  
  // Convert course into a state variable so we can change it
  // and force a redraw of the UI
  const [course, setCourse] = useState<any>({
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
  
  // Check if user is enrolled in a course
  const isEnrolled = (courseId: string) => {
    return enrollments.some(
      (enrollment: any) =>
        enrollment.user === (currentUser as any)?._id &&
        enrollment.course === courseId
    );
  };

  // Handle enroll action
  const handleEnroll = (courseId: string) => {
    dispatch(enrollCourse({ userId: (currentUser as any)?._id, courseId }));
  };

  // Handle unenroll action
  const handleUnenroll = (courseId: string) => {
    dispatch(unenrollCourse({ userId: (currentUser as any)?._id, courseId }));
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
              onClick={() => dispatch(addNewCourse(course))}
            >
              Add
            </button>
            <button 
              className="btn btn-warning float-end me-2"
              id="wd-update-course-click"
              onClick={() => dispatch(updateCourse(course))}
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
                            dispatch(deleteCourse(course._id));
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
    </div>);}

