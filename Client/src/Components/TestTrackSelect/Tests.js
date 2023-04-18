import React, { useState, useContext, useEffect } from "react";
import TestCard from "./TestCard";
import { UserContext } from "../../App";
import { getTestsOfUser } from "../../Util/test";
import { TextField } from "@material-ui/core";
import { FaSearch } from "react-icons/fa";
import moment from "moment";
import { cleanTitle } from "../../Util/regex";

const Tests = (props) => {
  const userData = useContext(UserContext);

  useEffect(() => {
    userData.setisLoading(true);
    getTestsOfUser(userData.currentstate.user._id)
      .then((response) => {
        settests(response.data);
        setSearchedTests(response.data);
        setfilteredTests(response.data);
        userData.setisLoading(false);
      })
      .catch((err) => {
        userData.setisLoading(false);
      });
  }, [userData.currentstate.user._id]);

  const [tests, settests] = useState([]);

  // states for filters
  const [selectedDropdown, setSelectedDropdown] = useState("All tests");
  const [selectedFilter, setSelectedFilter] = useState("Title");

  const [searchedTests, setSearchedTests] = useState([]);
  const [filteredTests, setfilteredTests] = useState([]);
  let [clearFlag, setClearFlag] = useState(false);

  const displaySearchTests = (value) => {
    value = value.trim();
    if (value !== null && value !== "" && value !== undefined) {
      const searchTests = filteredTests.filter((test) => {
        const regex = new RegExp(`${cleanTitle(value)}`, "gi");
        if (selectedFilter === "Title") {
          return test.title.match(regex);
        } else if (selectedFilter === "Competency") {
          return test.trackName.match(regex);
        } else if (selectedFilter === "Start date") {
          let regex = new RegExp(`${cleanTitle(value)}`, "gi");
          let startDate = moment(test.startTime).format("DD MMM, YYYY");
          return startDate.match(regex);
        } else if (selectedFilter === "End date") {
          let regex = new RegExp(`${cleanTitle(value)}`, "gi");
          let endDate = moment(test.endTime).format("DD MMM, YYYY");
          return endDate.match(regex);
        }
      });
      setSearchedTests(searchTests);
    } else {
      // setSearchedTests(tests);
      setSearchedTests(filteredTests);
      // getTests();
    }
  };

  //Handles date filter
  const handleFilterChange = (name) => {
    if (name !== "Title") {
      setClearFlag(true);
    }
    document
      .getElementsByClassName("search-field-on-admin-side")[0]
      .getElementsByTagName("input")[0].value = null;
    setSelectedFilter(name);
    setSearchedTests(filteredTests);
  };

  // Handles active, inactive test filter
  const handleDropDownChange = (name) => {
    document
      .getElementsByClassName("search-field-on-admin-side")[0]
      .getElementsByTagName("input")[0].value = null;

    setSelectedDropdown(name);
    if (name === "All tests") {
      setSearchedTests(tests);
      setfilteredTests(tests);
    } else {
      setClearFlag(true);
      var filtered = [];
      if (name === "Active tests") {
        filtered = tests.filter((test) => {
          return test.isActive;
        });
      } else {
        filtered = tests.filter((test) => {
          return !test.isActive;
        });
      }
      setfilteredTests(filtered);
      setSearchedTests(filtered);
    }
  };

  const clearFunction = () => {
    document
      .getElementsByClassName("search-field-on-admin-side")[0]
      .getElementsByTagName("input")[0].value = null;
    handleDropDownChange("All tests");
    handleFilterChange("Title");
    setSearchedTests(tests);
    setfilteredTests(tests);
    setClearFlag(false);
  };

  return (
    // <div className="container-fluid test-page"
    // style={{ paddingTop: 100 }}
    // >
    <div
      style={{
        backgroundColor: "#b2ff453b",
        marginTop: "10vh",
        paddingBottom: "2rem",
        minHeight: "90vh",
      }}
    >
      <div
        className="row my-3"
        style={{
          display: "flex",
          justifyContent: "center",
          zIndex: "5",
          paddingTop: "2rem",
        }}
      >
        <h3>
          <strong>{props.title}</strong>
        </h3>
      </div>
      <div className="container">
        <div className="row ml-1 flex justify-content-between align-items-center">
          <div className="d-flex">
            <TextField
              className="search-field-on-admin-side"
              id="outlined-basic"
              label={
                <>
                  <FaSearch style={{ marginRight: 10 }} />
                  Search Test...
                </>
              }
              type="text"
              autoComplete="off"
              onChange={(e) => {
                displaySearchTests(e.target.value);
              }}
              style={{ width: 400 }}
            />
            {/* Dropdown for date filter */}
            <div class="dropdown">
              <button
                class="filter-btn btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {selectedFilter}
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li
                  name="Title"
                  class="dropdown-item"
                  onClick={(e) => {
                    handleFilterChange(e.target.innerHTML);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Title
                </li>
                <li
                  name="Track"
                  class="dropdown-item"
                  onClick={(e) => {
                    handleFilterChange(e.target.innerHTML);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Competency
                </li>
                <li
                  name="Date"
                  class="dropdown-item"
                  onClick={(e) => {
                    handleFilterChange(e.target.innerHTML);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  Start date
                </li>
                <li
                  name="Date"
                  class="dropdown-item"
                  onClick={(e) => {
                    handleFilterChange(e.target.innerHTML);
                  }}
                  style={{ cursor: "pointer" }}
                >
                  End date
                </li>
              </div>
            </div>
            {/* Test status dropdown */}
            <div class="dropdown">
              <button
                class="test-status-btn btn btn-secondary btn-sm dropdown-toggle"
                type="button"
                id="dropdownMenuButton"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                {selectedDropdown}
              </button>
              <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                <li
                  name="All tests"
                  class="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    handleDropDownChange(e.target.innerHTML);
                  }}
                >
                  All tests
                </li>
                <li
                  name="Active tests"
                  class="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    handleDropDownChange(e.target.innerHTML);
                  }}
                >
                  Active tests
                </li>
                <li
                  name="Inactive tests"
                  class="dropdown-item"
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    handleDropDownChange(e.target.innerHTML);
                  }}
                >
                  Inactive tests
                </li>
              </div>
            </div>
            <div class="dropdown">
              {clearFlag ? (
                <button
                  id="clear-btn"
                  class="test-status-btn btn btn-secondary btn-sm"
                  type="button"
                  onClick={() => clearFunction()}
                >
                  Clear
                </button>
              ) : (
                ""
              )}
            </div>
          </div>

          <div className="legends d-flex align-items-center">
            <div class="circle circle-active"></div>
            <small>Active</small>
            <div class="circle circle-inactive"></div>
            <small>Inactive</small>
          </div>
        </div>
        <div className="row ">
          {searchedTests.length > 0 ? (
            searchedTests
              .slice(0)
              .reverse()

              .map((test, index) => (
               
                (<div className="col-lg-4 col-md-6 col-sm-12" key={index}>
                  <TestCard id={index} test={test} />
                </div>)
                
              ))
          ) : (
            <div className="col-lg-4 col-md-6 col-sm-12">
              <br />
              <p>No tests available</p>
            </div>
          )}
        </div>
      </div>
      {/* </div> */}
    </div>
  );
};

export default Tests;
