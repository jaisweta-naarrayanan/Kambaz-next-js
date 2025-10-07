"use client";
import Link from "next/link";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";

export default function Dashboard() {
  return (
    <div id="wd-dashboard">
      <h1 id="wd-dashboard-title">Dashboard</h1> <hr />
      <h2 id="wd-dashboard-published">Published Courses (8)</h2> <hr />
      <div id="wd-dashboard-courses">
        <Row xs={1} md={5} className="g-4">
          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1234" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/reactjs.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1234 React JS
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1235" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/webd.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1235 Web Development
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer II
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1236" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/mongodb.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1236 Mongo DB
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer III
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1237" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/sysdesign.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1237 System Design
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Full Stack software developer IV
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1238" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/cpp.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1238 C++ Programming
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Advanced object-oriented programming
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1239" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/python.jpeg" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1239 Python for Data Science
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Data analysis and machine learning with Python
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1240" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/java.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1240 Java Enterprise
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    Building scalable enterprise applications
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>

          <Col className="wd-dashboard-course" style={{ width: "300px" }}>
            <Card>
              <Link 
                href="/Courses/1241" 
                className="wd-dashboard-course-link text-decoration-none text-dark"
              >
                <Card.Img 
                  variant="top" 
                  src="/images/devops.png" 
                  width="100%" 
                  height={160}
                />
                <Card.Body>
                  <Card.Title className="wd-dashboard-course-title text-nowrap overflow-hidden">
                    CS1241 DevOps & Cloud
                  </Card.Title>
                  <Card.Text 
                    className="wd-dashboard-course-description overflow-hidden" 
                    style={{ height: "100px" }}
                  >
                    CI/CD, Docker, Kubernetes, and AWS
                  </Card.Text>
                  <Button variant="primary">Go</Button>
                </Card.Body>
              </Link>
            </Card>
          </Col>
        </Row>
      </div>
    </div>
  );
}