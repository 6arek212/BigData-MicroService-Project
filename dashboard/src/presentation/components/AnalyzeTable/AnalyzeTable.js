import React from "react";

import "./AnalyzeTable.css";

function AnalyzeTable({ data }) {
  return (
    <div className="analyze-table-container">
      <ul className="responsive-table">
        <li className="table-header">
          <div className="col col-1">Antecedent</div>
          <div className="col col-2">Consequent</div>
          <div className="col col-3">Support (%)</div>
          <div className="col col-4">Confidence (%)</div>
        </li>

        {data && data.map((item, index) =>
          <TableRow
            key={index}
            antecedent={item.antecedent.value}
            consequent={item.consequent.value}
            support={item.support}
            confidence={item.confidence}
          />
        )
        }


        {(!data || data.length === 0 ) &&
          <p>No Data Yet</p>
        }
      </ul>
    </div>
  );
}

const TableRow = ({ antecedent, consequent, support, confidence }) => {
  return (
    <li className="table-row">
      <div className="col col-1" data-label="Job Id">
        {antecedent}
      </div>
      <div className="col col-2" data-label="Customer Name">
        {consequent}
      </div>
      <div className="col col-3" data-label="Amount">
        {support}
      </div>
      <div className="col col-4" data-label="Payment Status">
        {confidence}
      </div>
    </li>
  );
};

export default AnalyzeTable;
