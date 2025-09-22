export default function AssignmentEditor() {
  return (
    <div id="wd-assignments-editor">
      <label htmlFor="wd-name"> <strong>Assignment Name</strong></label>
      <br/> <br/> 
      <input id="wd-name" value="A1 - ENV + HTML" /><br /><br />
      <textarea id="wd-description">
        The assignment is available online Submit a link to the landing page of your Web application running on Netlify. The landing page should include the following: Your full name and section Links to each of the lab assignments Link to the Kanbas application Links to all relevant source code repositories The Kanbas application should include a link to navigate back to the landing page.
      </textarea>
      <br />
      <table>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-points">Points</label>
          </td>
          <td>
            <input id="wd-points" defaultValue={100} />
          </td>
        </tr >
        <br/>
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assignment-group">Assignment Group</label>
          </td>
          <td>
            <select>
              <option defaultValue="ASSIGNMENTS">ASSIGNMENTS</option>
            </select>
          </td>
        </tr >
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-display-grade">Display Grade as </label>
          </td>
          <td>
            <select>
              <option defaultValue="Percentage">Percentage</option>
            </select>
          </td>
        </tr >
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-submission-type">Submission Type</label>
          </td>
          <td>
            <tr> 
              <td>
                <select>
                  <option defaultValue="Online">Online</option>
                </select> 
              </td>
            </tr>
            <br />
            <tr>
              <td>
                <label htmlFor="wd-online-entry-options">Online Entry Option</label>
                <br/>
                <input type="checkbox"/> Text Entry <br/>
                <input type="checkbox"/> Website URL <br/>
                <input type="checkbox"/> Media Recordings <br/>
                <input type="checkbox"/> Student Annotation <br/>
                <input type="checkbox"/> File Uploads <br>
                </br>
              </td>
            </tr>          
          </td>
        </tr >
        <br />
        <tr>
          <td align="right" valign="top">
            <label htmlFor="wd-assign">Assign </label>
          </td>
          <td>
            <tr>
              <td>
                <label htmlFor="wd-assign-to">Assign to</label>
                <br /><input id="wd-assign-to" value={'Everyone'} />
              </td>
            </tr>
            <br />
            <tr>
              <td align="left" valign="top">
                <label htmlFor="wd-due">Due</label>
                <br />
                <input type="date"
                      defaultValue="2024-05-13"
                      id="wd-due"/><br/>

              </td>
            </tr>
            <br />
            <tr>
              <td align="left" valign="top">
                <label htmlFor="wd-available-from">Available From</label>
                <br />
                <input type="date"
                      defaultValue="2024-05-06"
                      id="wd-available-from"/><br/>
              </td>
              <td align="left" valign="top">
                <label htmlFor="wd-until">Until</label>
                <br />
                <input type="date"
                      defaultValue="2024-05-20"
                      id="wd-until"/><br/>
              </td>
            </tr>
          </td>
        </tr >
      </table>

      <div style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <footer style={{ display: "flex", justifyContent: "center", gap: ".5rem", padding: "1rem" }}>
        <button type="button">Cancel</button>
        <button type="submit">Save</button>
      </footer>
    </div>
    </div>
);}
