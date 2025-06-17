import { NavLink, Link, useNavigate } from "react-router";
import { logOut } from "../../services/authService";
import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    navigate("/");
  }

  return (
    <nav className="NavBar">
      <img src="/images/logo.svg" alt="globe icon" className="logo" />
      <div className="nav-links">
        <NavLink to="/">Home</NavLink>
        &nbsp; | &nbsp;
        <NavLink to="/posts" end>
          Explore
        </NavLink>
        &nbsp; | &nbsp;
        {user ? (
          <>
            <NavLink to="/myposts">My Posts</NavLink>
            &nbsp; | &nbsp; &nbsp; &nbsp;
            <NavLink to="/posts/new">New Post</NavLink>
            &nbsp; | &nbsp;
            <Link to="/" onClick={handleLogOut}>
              Log Out
            </Link>
            <span>
              Welcome, {user.name.charAt(0).toUpperCase() + user.name.slice(1)}
            </span>
          </>
        ) : (
          <>
            <NavLink to="/login">Log In</NavLink>
            &nbsp; | &nbsp;
            <NavLink to="/signup">Sign Up</NavLink>
          </>
        )}
      </div>
    </nav>
  );
}
