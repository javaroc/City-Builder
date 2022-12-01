import { Outlet, Link } from "react-router-dom";

const Navbar = () => {
  return (
    <>
    <nav class="navbar navbar-expand-sm bg-light">
      <div class="container-fluid">
        <ul class="navbar-nav">
          <li class="nav-item">
            <Link class="nav-link" to="/">Current Game</Link>
          </li>
          <li class="nav-item">
            <Link class="nav-link" to="/leaderboard">Leaderboard</Link>
          </li>
        </ul>
      </div>
    </nav>

    <Outlet />
    </>
  )
};

export default Navbar;