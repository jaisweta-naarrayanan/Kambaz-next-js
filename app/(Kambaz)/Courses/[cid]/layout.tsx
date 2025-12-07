"use client";
import { ReactNode, useState, useEffect } from "react";
import { FaAlignJustify } from "react-icons/fa";
import CourseNavigation from "./Navigation";
import { useSelector, useDispatch } from "react-redux";
import { useParams, useRouter } from "next/navigation";
import { RootState } from "../../store";
import * as enrollmentsClient from "../../Database/enrollments/client";
import { setEnrollments } from "../../Database/enrollments/reducer";

export default function CoursesLayout({ children }: { children: ReactNode }) {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { courses } = useSelector((state: RootState) => state.coursesReducer);
  const { enrollments } = useSelector((state: RootState) => state.enrollmentsReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const course = courses.find((course: any) => course._id === cid);
  const [showSidebar, setShowSidebar] = useState(true);
  const [enrollmentsLoaded, setEnrollmentsLoaded] = useState(false);

  // Fetch enrollments on mount
  useEffect(() => {
    const fetchEnrollments = async () => {
      if (currentUser && typeof currentUser === "object" && "_id" in currentUser) {
        try {
          const enrolledCourses = await enrollmentsClient.getEnrollmentsForUser((currentUser as { _id: string })._id);
          dispatch(setEnrollments(enrolledCourses));
          setEnrollmentsLoaded(true);
        } catch (error) {
          console.error("Failed to fetch enrollments:", error);
          setEnrollmentsLoaded(true); // Mark as loaded even on error to allow access
        }
      } else if (!currentUser) {
        // No user logged in, mark as loaded to prevent infinite waiting
        setEnrollmentsLoaded(true);
      }
    };
    fetchEnrollments();
  }, [currentUser, dispatch]); // Removed enrollments.length dependency

  // Check if user is enrolled in this course
  // Note: enrollments now contains enrolled courses (not enrollment objects) from MongoDB
  const isEnrolled = enrollments.some(
    (enrolledCourse: any) => enrolledCourse._id === cid
  );

  // Redirect to Dashboard if user is not enrolled (only after enrollments are loaded)
  useEffect(() => {
    if (enrollmentsLoaded && !isEnrolled && currentUser) {
      router.push("/Dashboard");
    }
  }, [enrollmentsLoaded, isEnrolled, currentUser, router]);

  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify
          className="me-4 fs-4 mb-1"
          style={{ cursor: "pointer" }}
          onClick={() => setShowSidebar(!showSidebar)}
        />
        {course?.name}
      </h2>
      <hr />
      <div className="d-flex">
        {showSidebar && (
          <div className="d-none d-md-block">
            <CourseNavigation cid={cid as string} />
          </div>
        )}
        <div className="flex-fill">{children}</div>
      </div>
    </div>
  );
}
