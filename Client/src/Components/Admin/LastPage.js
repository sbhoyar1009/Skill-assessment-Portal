import React, { useState } from "react";
import Header from "../Layouts/Header";
import Admin from "./Admin";
import "../../Assets/Styles/LastPage.css";

function LastPage() {
  const [profile, setprofile] = useState(false);

  function renderProfile() {
    setprofile(!profile);
  }

  return (
    <div className="lastPage">
      <Header renderProfile={renderProfile} profile={profile} />
      <div className="row">
        <div className="col-md-12">
          <Admin />
        </div>
      </div>
    </div>
  );
}

export default LastPage;
