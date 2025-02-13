import React from "react";

interface MatrixProps {
  data: string[][];
}

const Matrix: React.FC<MatrixProps> = ({ data }) => {
  return (
    <table style={{ borderCollapse: "collapse" }}>
      <tbody>
        {data.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} style={{ border: "none", padding: "8px" }}>
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default Matrix;
