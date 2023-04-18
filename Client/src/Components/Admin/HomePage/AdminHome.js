import React, { useState, useEffect, useContext } from "react";
import AdminTestCard from "./AdminTestCard";
import ShowTest from "./ShowTest";
import moment from "moment";
import { TextField } from "@material-ui/core";
import { FaSearch } from "react-icons/fa";
import { FiRefreshCcw } from "react-icons/fi";
import {
  CheckForksForAllUsers,
  getAllTests,
  getTestCarddata,
} from "../../../Util/test";
import { cleanTitle } from "../../../Util/regex";
import { UserContext } from "../../../App";

function AdminHome() {
  const [tests, settests] = useState([]);
  const [searchedTests, setSearchedTests] = useState([]);
  const [displayTest, setdisplayTest] = useState(false);
  const [test, settest] = useState({});
  const [selectedDropdown, setSelectedDropdown] = useState("All tests");
  const [selectedFilter, setSelectedFilter] = useState("Title");
  const [filteredTests, setfilteredTests] = useState([]);
  let [clearFlag, setClearFlag] = useState(false);
  const userData = useContext(UserContext);

  // const [searchedValue, setSearchedValue] = useState(null;);

  const getTests = () => {
    userData.setisLoading(true);
    getAllTests()
      .then((res) => {
        settests(res.data);
        setSearchedTests(res.data);
        setfilteredTests(res.data);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.error(err);
        userData.setisLoading(false);
      });
  };
  useEffect(() => {
    getTests();
    return () => {};
  }, []);

  const displaySearchTests = (value) => {
    value = value.trim();
    if (value !== null && value !== "" && value !== undefined) {
      const searchTests = filteredTests.filter((test) => {
        const regex = new RegExp(`${cleanTitle(value)}`, "gi");
        if (selectedFilter === "Title") {
          return test.displayTitle.match(regex);
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
    setClearFlag(true);
  };

  const getTestCardData = (testId) => {
    getTestCarddata(testId)
      .then((res) => {
        settest(res.data);
        setdisplayTest(true);
        CheckForksForAllUsers(testId);
        userData.setisLoading(false);
      })
      .catch((err) => {
        console.error(err);
        userData.setisLoading(false);
      });
  };

  const back = () => {
    setSearchedTests(filteredTests);
    setdisplayTest(false);
    settest({});
  };

  //Handles date filter
  const handleFilterChange = (name) => {
    if (name != "Title") {
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
    <div>
      <div className="container-fluid">
        {displayTest ? (
          <ShowTest test={test} back={back} />
        ) : (
          <>
            <div style={{ textAlign: "right", cursor: "pointer" }}>
              <span
                className="btn-refresh"
                onClick={() => {
                  getTests();
                  document
                    .getElementsByClassName("search-field-on-admin-side")[0]
                    .getElementsByTagName("input")[0].value = null;
                  setSelectedDropdown("All tests");
                }}
              >
                Reload Tests
                <FiRefreshCcw style={{ marginLeft: 10 }} />
              </span>
            </div>
            <h3>
              <strong>All Tests</strong>
            </h3>
            <div className="row ml-1 flex justify-content-between  align-items-center">
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
                  <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
                    <li
                      name="Title"
                      class="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        handleFilterChange(e.target.innerHTML);
                      }}
                    >
                      Title
                    </li>
                    <li
                      name="Track"
                      class="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        handleFilterChange(e.target.innerHTML);
                      }}
                    >
                      Competency
                    </li>
                    <li
                      name="Date"
                      class="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        handleFilterChange(e.target.innerHTML);
                      }}
                    >
                      Start date
                    </li>
                    <li
                      name="Date"
                      class="dropdown-item"
                      style={{ cursor: "pointer" }}
                      onClick={(e) => {
                        handleFilterChange(e.target.innerHTML);
                      }}
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
                  <div
                    class="dropdown-menu"
                    aria-labelledby="dropdownMenuButton"
                  >
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
              {/* <button className="clear-btn">Clear</button> */}
              <div className="legends d-flex align-items-center">
                <div class="circle circle-active"></div>
                <small>Active</small>
                <div class="circle circle-inactive"></div>
                <small>Inactive</small>
              </div>
            </div>
            <div className="row">
              {searchedTests.length > 0 ? (
                searchedTests.map((test, index) => (
                  <div
                    className="col-lg-4 col-md-6 col-sm-12"
                    key={index}
                    onClick={() => {
                      userData.setisLoading(true);
                      getTestCardData(test._id);
                    }}
                  >
                    <AdminTestCard test={test} id={index + 1} />
                  </div>
                ))
              ) : (
                <div className="col-md-12 text-center mt-5">
                  No Tests to display
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminHome;
