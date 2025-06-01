import React, { useState, useEffect } from "react";
import axios from "axios";
import "./ProfileCard.css";

export default function ProfileCard() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    full_name: "",
    phonenumber: "",
    address: "",
    date_of_birth: "",
    gender: "",
    bio: "",
  });
  const [edit, setEdit] = useState(false);
  const [backup, setBackup] = useState({});
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("/mock/profile.json");
        setForm({ ...res.data, bio: "" });
        setBackup({ ...res.data, bio: "" });
      } catch (err) {
        console.error("Cannot load profile.json", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  const handleEdit = () => {
    setBackup(form);
    setEdit(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
    setErrors((prev) => ({
      ...prev,
      [name]: undefined,
    }));
  };

  const validate = () => {
    let err = {};
    if (!form.full_name) err.full_name = "Full name required";
    if (!form.email) err.email = "Email required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      err.email = "Invalid email format";
    if (!form.phonenumber) err.phonenumber = "Phone number required";
    if (!form.gender) err.gender = "Gender required";
    if (!form.address) err.address = "Address required";
    return err;
  };

  const handleSave = () => {
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length === 0) {
      setEdit(false);
      setBackup(form);
      alert("Profile saved!");
    }
  };

  const handleCancel = () => {
    setForm(backup);
    setErrors({});
    setEdit(false);
  };

  if (loading)
    return (
      <div className="profilecard-loading">
        Loading...
      </div>
    );

  return (
    <div className={edit ? "profilecard-edit-mode" : "profilecard-view-mode"}>
      <div className="profilecard-container">
        <div className="profilecard-avatar-wrap">
          <img
            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
              form.full_name || form.username || "User"
            )}&size=128&background=007ACC&color=fff`}
            alt="avatar"
            className="profilecard-avatar"
          />
        </div>
        <div className="profilecard-name">{form.full_name}</div>
        <div className="profilecard-username">@{form.username}</div>

        <form className="profilecard-form" autoComplete="off" onSubmit={e => e.preventDefault()}>
          <div className="profilecard-row">
            <div className="profilecard-field">
              <label>Email:</label>
              {edit ? (
                <input
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="profilecard-input"
                  type="email"
                />
              ) : (
                <div className="profilecard-view-value">{form.email}</div>
              )}
            </div>
            <div className="profilecard-field">
              <label>Phone:</label>
              {edit ? (
                <input
                  name="phonenumber"
                  value={form.phonenumber}
                  onChange={handleChange}
                  className="profilecard-input"
                />
              ) : (
                <div className="profilecard-view-value">{form.phonenumber}</div>
              )}
            </div>
          </div>
          <div className="profilecard-row">
            <div className="profilecard-field">
              <label>Gender:</label>
              {edit ? (
                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                  className="profilecard-input"
                >
                  <option value="">Select</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              ) : (
                <div className="profilecard-view-value">
                  {form.gender === "M"
                    ? "Male"
                    : form.gender === "F"
                      ? "Female"
                      : ""}
                </div>
              )}
            </div>
            <div className="profilecard-field">
              <label>Address:</label>
              {edit ? (
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="profilecard-input"
                />
              ) : (
                <div className="profilecard-view-value">{form.address}</div>
              )}
            </div>
          </div>
          <div className="profilecard-field">
            <label>Bio</label>
            {edit ? (
              <textarea
                name="bio"
                value={form.bio}
                onChange={handleChange}
                className="profilecard-input"
                rows={3}
                placeholder="Tell something about yourself..."
              />
            ) : (
              <div className="profilecard-bio">
                {form.bio || <span className="profilecard-bio-empty">No bio yet.</span>}
              </div>
            )}
          </div>
          <div className="profilecard-btn-row">
            {edit ? (
              <>
                <button className="profilecard-btn profilecard-btn-gray" onClick={handleCancel} type="button">
                  Cancel
                </button>
                <button className="profilecard-btn profilecard-btn-blue" onClick={handleSave} type="button">
                  Save
                </button>
              </>
            ) : (
              <button className="profilecard-btn profilecard-btn-blue" onClick={handleEdit} type="button">
                Edit Profile
              </button>
            )}
          </div>
        </form>
        {Object.values(errors).length > 0 && (
          <div className="profilecard-error">
            {Object.values(errors).map((e, i) => (
              <div key={i}>{e}</div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
