import Link from "next/link";
import Image from "next/image";
export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (4)</h2> <hr />
      <div id="wd-dashboard-courses">
        <div className="wd-dashboard-course">
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/reactjs.png" alt ="" width={200} height={150} />
            <div>
              <h5> CS1234 React JS </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer{" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/webd.png" alt ="" width={200} height={150} />
            <div>
              <h5> CS1235 Web Development </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer II {" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <div className="wd-dashboard-course"> 
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/mongodb.png" alt ="" width={200} height={150} />
            <div>
              <h5> CS1236 Mongo DB </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer III {" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
        <br />
        <div className="wd-dashboard-course"> 
          <Link href="/Courses/1234" className="wd-dashboard-course-link">
            <Image src="/images/sysdesign.png" alt ="" width={200} height={150} />
            <div>
              <h5> CS1237 System Design </h5>
              <p className="wd-dashboard-course-title">
                Full Stack software developer IV {" "}
              </p>
              <button> Go </button>
            </div>
          </Link>
        </div>
      </div>
    </div>
);}

