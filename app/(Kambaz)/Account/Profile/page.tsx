"use client";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { Button, FormControl } from "react-bootstrap";
import { useRouter } from "next/navigation";
import * as client from "../client";

export default function Profile() {
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const router = useRouter();
  const [profile, setProfile] = useState<any>(currentUser || {});

  useEffect(() => {
    if (!currentUser) {
      router.push("/Account/Signin");
    } else {
      setProfile(currentUser);
    }
  }, [currentUser, router]);

  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    setProfile(updatedProfile);
  };

  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/Account/Signin");
  };

  if (!currentUser) return null;

  return (
    <div className="wd-profile-screen p-4" style={{ maxWidth: "500px" }}>
      <h3>Profile</h3>
      <div>
        <FormControl
          id="wd-username"
          className="mb-2"
          value={profile.username || ""}
          placeholder="Enter username"
          onChange={(e) => setProfile({ ...profile, username: e.target.value })}
        />
        <FormControl
          id="wd-password"
          className="mb-2"
          value={profile.password || ""}
          placeholder="Enter password"
          onChange={(e) => setProfile({ ...profile, password: e.target.value })}
        />
        <FormControl
          id="wd-firstname"
          className="mb-2"
          value={profile.firstName || ""}
          placeholder="Enter first name"
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
        />
        <FormControl
          id="wd-lastname"
          className="mb-2"
          value={profile.lastName || ""}
          placeholder="Enter last name"
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
        />
        <FormControl
          id="wd-dob"
          className="mb-2"
          type="date"
          value={profile.dob || ""}
          placeholder="Enter date of birth"
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })}
        />
        <FormControl
          id="wd-email"
          className="mb-2"
          value={profile.email || ""}
          placeholder="Enter email"
          onChange={(e) => setProfile({ ...profile, email: e.target.value })}
        />
        <select
          className="form-control mb-2"
          id="wd-role"
          value={profile.role || "USER"}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}
        >
          <option value="USER">User (default)</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </select>
        <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> 
          Update </button>
        <Button onClick={signout} className="w-100 mb-2" variant="danger" id="wd-signout-btn">
          Sign out
        </Button>
      </div>
    </div>
  );
}