import React from "react";

import "./AnalyzeTable.css";

function AnalyzeTable() {
  return (
    <div class="analyze-table-container">
      <ul class="responsive-table">
        <li class="table-header">
          <div class="col col-1">Antecedent</div>
          <div class="col col-2">Consequent</div>
          <div class="col col-3">Support</div>
          <div class="col col-4">Confidence</div>
        </li>

        <TableRow
          antecedent="פיטריות"
          consequent="בצל"
          support="26.69"
          confidence="38.59"
        />

        <TableRow
          antecedent="פיטריות"
          consequent="בצל"
          support="26.69"
          confidence="38.59"
        />
        <TableRow
          antecedent="פיטריות"
          consequent="בצל"
          support="26.69"
          confidence="38.59"
        />

        <TableRow
          antecedent="פיטריות"
          consequent="בצל"
          support="26.69"
          confidence="38.59"
        />
      </ul>
    </div>
  );
}

const TableRow = ({ antecedent, consequent, support, confidence }) => {
  return (
    <li class="table-row">
      <div class="col col-1" data-label="Job Id">
        {antecedent}
      </div>
      <div class="col col-2" data-label="Customer Name">
        {consequent}
      </div>
      <div class="col col-3" data-label="Amount">
        {support}
      </div>
      <div class="col col-4" data-label="Payment Status">
        {confidence}
      </div>
    </li>
  );
};

export default AnalyzeTable;
