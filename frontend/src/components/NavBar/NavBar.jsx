import { NavLink, Link, useNavigate } from "react-router";
import { logOut } from "../../services/authService";
import "./NavBar.css";

export default function NavBar({ user, setUser }) {
  const navigate = useNavigate();

  function handleLogOut() {
    logOut();
    setUser(null);
    // The <Link> that was clicked will navigate to "/"
  }

  return (
    <nav className="NavBar">
      <NavLink to="/">Home</NavLink>
      &nbsp; | &nbsp;
      <NavLink to="/posts" end>
        Explore
      </NavLink>
      &nbsp; | &nbsp;
      {user ? (
        <>
          &nbsp; &nbsp;
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
    </nav>
  );
}
