import React, { useContext } from "react";
import * as Icons from "react-icons/fi";
import { BiUser } from "react-icons/bi";
import { FaMedal } from "react-icons/fa";
import { UserContext } from "../../App";
function Header(props) {
  const { renderProfile, profile } = props;
  const userData = useContext(UserContext);

  return (
    <div className="header">
      <nav className="navbar navbar-expand-md bg-dark navbar-dark fixed-top">
        <div className="navbar-brand">
          <span>KPIT</span> ECoDe
        </div>

        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#collapsibleNavbar"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        {userData.user !== null ? (
          <div className="collapse navbar-collapse" id="collapsibleNavbar">
            <ul className="navbar-nav">
              {props.testLink ? (
                <li className="nav-item">
                  <span
                    className="nav-link"
                    to={null}
                    onClick={() => {
                      props.testSelect(0);
                    }}
                  >
                    Tests
                  </span>
                </li>
              ) : (
                ""
              )}
              {userData.currentstate.user.isAdmin ? (
                <li className="nav-item">
                  <span className="nav-link">
                    {userData.user.username}
                    <BiUser />
                  </span>
                </li>
              ) : (
                <li className="nav-item">
                  <span className="nav-link" to={null} onClick={renderProfile}>
                    {!profile ? (
                      <>
                        {"Leaderboard "} <FaMedal />
                      </>
                    ) : (
                      <>
                        {userData.user.username + " "}
                        <BiUser />
                      </>
                    )}
                  </span>
                </li>
              )}

              <li className="nav-item">
                <a href="/auth/logout" style={{ textDecoration: "none" }}>
                  <span className="nav-link" to={null}>
                    Logout <Icons.FiLogOut />
                  </span>
                </a>
              </li>
            </ul>
          </div>
        ) : (
          ""
        )}
      </nav>
    </div>
  );
}

export default Header;
