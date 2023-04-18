import React from "react";

function Row(props) {
  const { rank, username, score, bold } = props;

  if (bold) {
    return (
      <tr>
        <td>
          <strong>{rank}</strong>
        </td>
        <td>
          <strong>{username}</strong>
        </td>
        <td>
          <strong>{score}</strong>
        </td>
      </tr>
    );
  }

  return (
    <tr>
      <td>{rank}</td>
      <td>{username}</td>
      <td>{score}</td>
    </tr>
  );
}

export default Row;
