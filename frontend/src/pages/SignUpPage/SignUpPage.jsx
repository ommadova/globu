import { useState } from "react";
import { useNavigate } from "react-router";
import { signUp } from "../../services/authService";
import "./SignUpPage.css";

export default function SignUpPage({ setUser }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await signUp(formData);
      setUser(user);
      navigate("/posts");
    } catch (err) {
      setErrorMsg("Sign Up Failed - Try Again");
    }
  }

  const disable = formData.password !== formData.confirm;

  return (
    <>
      <div className="container-2">
        <h2 className="heading">Sign Up!</h2>
        <form autoComplete="off" onSubmit={handleSubmit} className="form">
          <input
            className="input"
            placeholder="Name"
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <input
            className="input"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email"
            required
          />
          <input
            className="input"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password"
            required
          />
          <input
            className="input"
            type="password"
            name="confirm"
            value={formData.confirm}
            onChange={handleChange}
            placeholder="Confirm Password"
            required
          />
          <button className="login-button" type="submit" disabled={disable}>
            SIGN UP
          </button>
        </form>
        {errorMsg && <p className="error-message">{errorMsg}</p>}
        <p className="login-link">
          Already have an account? <a href="/login">Log In</a>
        </p>
      </div>
    </>
  );
}
