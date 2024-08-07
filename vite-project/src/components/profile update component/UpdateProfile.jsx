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

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    setIdToken(token);
    if (token) {
      console.log("Authenticated user found");
      fetchUserData(token);
    } else {
      console.log("User not authenticated.");
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const response = await axios.post(
        `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4`,
        { idToken: token },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      const user = response.data.users[0];
      setFullName(user.displayName || "");
      setPhotoURL(user.photoUrl || "");
      console.log("User data fetched successfully.");
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  const handleUserDetailsUpdate = (e) => {
    e.preventDefault();

    const updateData = {
      idToken,
      displayName: fullName,
      photoUrl: photoURL,
      returnSecureToken: true,
    };

    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBNymitO08g1U1_ag01P8DyC06xjcZc3R4",
        updateData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log("success", response);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  return (
    <div>
      <h4>Winners never quit, Quitters never win.</h4>
      <hr />

      <form onSubmit={handleUserDetailsUpdate}>
        <h2>Contact Details</h2>
        <button
          type="button"
          onClick={() => {
            navigate(-1);
          }}
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
            onChange={(e) => {
              setFullName(e.target.value);
            }}
          />
        </div>

        <div>
          <TbWorld />
          <h3>Profile Photo URL</h3>
          <input
            type="text"
            required
            value={photoURL}
            onChange={(e) => {
              setPhotoURL(e.target.value);
            }}
          />
        </div>

        <button type="submit">Update</button>
      </form>
      <hr />
    </div>
  );
};

export default UpdateProfile;
