import { useState } from "react";
import { useNavigate } from "react-router";
import * as authService from "../../services/authService";

export default function LogInPage({ setUser }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errorMsg, setErrorMsg] = useState("");

  const navigate = useNavigate();

  async function handleSubmit(evt) {
    evt.preventDefault();
    try {
      const user = await authService.logIn(formData);
      setUser(user);
      navigate("/posts");
    } catch (err) {
      setErrorMsg("Log In Failed - Try Again");
    }
  }

  function handleChange(evt) {
    setFormData({ ...formData, [evt.target.name]: evt.target.value });
    setErrorMsg("");
  }

  return (
    <div className="container-2">
      <h2 className="heading">Log In</h2>
      <form autoComplete="off" onSubmit={handleSubmit} className="form">
        <input
          className="input"
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          className="input"
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <button className="login-button" type="submit">
          LOG IN
        </button>
      </form>
      <p className="error-message">&nbsp;{errorMsg}</p>
      <p className="signup-link">
        Don't have an account? <a href="/signup">Sign Up</a>
      </p>
    </div>
  );
}
