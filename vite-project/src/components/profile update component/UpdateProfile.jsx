import React, { useEffect, useState } from "react";
import "./updateprofile.css";
import { FaGithub } from "react-icons/fa";
import { TbWorld } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const UpdateProfile = () => {
  const [fullName, setFullName] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [idToken, setIdToken] = useState("");
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState(""); 

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      setIdToken(token);
      console.log("Authenticated user found");
      fetchUserData(token);
    } else {
      console.log("User not authenticated.");
      setError("User is not authenticated. Please log in again.");
    }
  }, []);

  const fetchUserData = async (token) => {
    setLoading(true);
    setError(""); 

    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4`,
        { idToken: token },
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      );
      
      const user = response.data.users[0];
      setFullName(user.displayName || "");
      setPhotoURL(user.photoUrl || "");
      console.log("User data fetched successfully.");
    } catch (error) {
      console.error("Error fetching user data:", error);
      setError("Failed to load user data. Please try again.");
    } finally {
      setLoading(false); // Stop loading
    }
  };

  const handleUserDetailsUpdate = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const updateData = {
      idToken,
      displayName: fullName,
      photoUrl: photoURL
    };

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          }
        }
      )
      .then((response) => {
        console.log("Profile updated successfully", response);
        setLoading(false);
        alert("Profile updated successfully");
      })
      .catch((error) => {
        console.log("Error updating profile:", error);
        setError("Failed to update profile. Please try again.");
        setLoading(false);
      });
  };

  return (
    <div>
      <h4>Winners never quit, Quitters never win.</h4>
      <hr />

      {error && <p style={{ color: "red" }}>{error}</p>} {/* Display error message */}

      <form onSubmit={handleUserDetailsUpdate}>
        <h2>Contact Details</h2>
        <button
          type="button"
          onClick={() => navigate(-1)}
        >
          Cancel
        </button>

        <div>
          <FaGithub />
          <h3>Full Name:</h3>
          <input
            type="text"
            required
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            disabled={loading} // Disable input when loading
          />
        </div>

        <div>
          <TbWorld />
          <h3>Profile Photo URL</h3>
          <input
            type="text"
            required
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
            disabled={loading} // Disable input when loading
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update"}
        </button>
      </form>
      <hr />
    </div>
  );
};

export default UpdateProfile;
