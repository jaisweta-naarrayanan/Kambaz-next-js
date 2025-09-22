export default function Modules() {
  return (
    <div>
      <button>Collapse All</button>
      <button>Expand All</button>
      <button>View Progress</button>
      <select id="wd-select-one-genre">
        <option value="Publish All">Publish All</option>
        <option value="Publish None">Publish None</option>
        <option defaultValue="Publish All">
            Publish All</option>
      </select>
      <button>+ Module</button>
      <ul id="wd-modules">
        <li className="wd-module">
          <div className="wd-title">Week 1</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">LEARNING OBJECTIVES</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to the course</li>
                <li className="wd-content-item">Learn what is Web Development</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 2</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">Building React applications</span>
              <ul className="wd-content">
                <li className="wd-content-item">Setting Up development Environment</li>
                <li className="wd-content-item">Introduction to HTML</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 3</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">Building Interfaces</span>
              <ul className="wd-content">
                <li className="wd-content-item">Introduction to CSS</li>
                <li className="wd-content-item">Basics of JavaScript</li>
              </ul>
            </li>
          </ul>
        </li>
        <li className="wd-module">
          <div className="wd-title">Week 4</div>
          <ul className="wd-lessons">
            <li className="wd-lesson">
              <span className="wd-title">Designing Pages</span>
              <ul className="wd-content">
                <li className="wd-content-item">Advanced Design</li>
                <li className="wd-content-item">Backend DB integration</li>
              </ul>
            </li>
          </ul>
        </li>
      </ul>
    </div>
);}

