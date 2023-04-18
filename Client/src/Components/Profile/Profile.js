import React from "react";

const Profile = (props) => {
  const { user, test } = props;

  return (
    <div className="profile">
      <div className="content">
        <img
          className="round-img"
          src={user.user.avatar}
          alt=""
          style={{
            borderRadius: "50%",
            margin: "1rem",
            height: "150px",
            width: "150px",
          }}
        />
        <h5>{user.user.username}</h5>
        <br />
        <div className="card">
          {/* <div className="card-header">Featured</div> */}
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <strong>Name: </strong>
              {user.user.name}
            </li>
            <li className="list-group-item">
              <strong>Email: </strong>
              {user.user.email}
            </li>
            <li className="list-group-item">
              <strong>Current test: </strong>
              {console.log(test)}
              {test.testTitle}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Profile;
