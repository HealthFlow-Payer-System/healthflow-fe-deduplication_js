/* eslint-disable react/no-array-index-key */
import React, { useState, useEffect } from 'react';
import {
  makeStyles, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Checkbox,
} from '@material-ui/core';
import {
  FormattedMessage,
} from '@openimis/fe-core';

const useStyles = makeStyles((theme) => ({
  paper: theme.paper.paper,
  table: theme.table,
  tableTitle: theme.table.title,
  tableHeader: theme.table.header,
  tableRow: theme.table.row,
  title: theme.paper.title,
  tableDisabledRow: theme.table.disabledRow,
  tableDisabledCell: theme.table.disabledCell,
  tableContainer: {
    overflow: 'auto',
  },
  hoverableCell: {
    '&:hover': {
      backgroundColor: '#f0f0f0',
    },
    cursor: 'pointer',
  },
  selectedCell: {
    backgroundColor: '#a1caf1',
  },
  checkboxCell: {
    textAlign: 'center',
  },
  deactivatedRow: {
    opacity: 0.5,
  },
  strikethrough: {
    textDecoration: 'line-through',
  },
}));

function BeneficiaryDuplicatesTable({
  headers, rows, setAdditionalData, completedData,
}) {
  const classes = useStyles();
  const [selectedCells, setSelectedCells] = useState([]);
  const [selectedRow, setSelectedRow] = useState(null);
  const [dontMergeRows, setDontMergeRows] = useState([]);
  const [fieldValues, setFieldValues] = useState({});

  useEffect(() => {
    const filteredIds = rows
      .filter((row, index) => !dontMergeRows.includes(index))
      .map((row) => row.beneficiaryId);
    const parsedFieldValues = selectedCells.reduce((accumulation, cell) => {
      accumulation[cell.header] = cell.value ?? '';
      return accumulation;
    }, {});
    const additionalData = (
      { values: parsedFieldValues, beneficiaryIds: filteredIds }
    );
    setFieldValues(parsedFieldValues);
    // eslint-disable-next-line max-len
    const additionalDataString = `{\\"values\\": ${JSON.stringify(additionalData.values).replace(/"/g, '\\"')},\\"beneficiaryIds\\": ${JSON.stringify(additionalData.beneficiaryIds).replace(/"/g, '\\"')}}`;
    setAdditionalData(additionalDataString);
  }, [selectedCells, dontMergeRows]);
  const isCellSelected = (rowIndex, header) => selectedCells.some(
    (cell) => cell.rowIndex === rowIndex && cell.header === header,
  );

  const clearCellSelection = (rowIndex, header) => {
    const restCells = selectedCells.filter((cell) => !(cell.rowIndex === rowIndex && cell.header === header));
    setSelectedCells(restCells);
  };

  const clearRowSelection = (rowIndex) => {
    const restCells = selectedCells.filter((cell) => !(cell.rowIndex === rowIndex));
    setSelectedCells(restCells);
  };

  const clearAllCellSelection = () => {
    setSelectedCells([]);
  };

  const checkIfEveryCellInOneRow = (rowIndex) => selectedCells.every((cell) => cell.rowIndex === rowIndex);

  const handleCellClick = (rowIndex, header, value) => {
    if (header === 'individual') {
      return;
    }

    if (dontMergeRows.includes(rowIndex)) {
      return;
    }

    const isCellSelectedInColumn = selectedCells.some((cell) => cell.header === header);
    const isCellClicked = isCellSelected(rowIndex, header);

    if (isCellClicked) {
      clearCellSelection(rowIndex, header);
      setSelectedRow(null);
      return;
    }

    if (isCellSelectedInColumn) {
      const updatedSelectedCells = selectedCells.filter((cell) => cell.header !== header);
      setSelectedCells(updatedSelectedCells);
    }

    setSelectedCells((prevSelectedCells) => [...prevSelectedCells, { rowIndex, header, value }]);

    if (!checkIfEveryCellInOneRow(rowIndex)) {
      setSelectedRow(null);
    }
  };

  const handleCheckboxChange = (rowIndex) => {
    if (selectedRow === rowIndex) {
      clearRowSelection(rowIndex);
      setSelectedRow(null);
    } else {
      clearAllCellSelection();
      const selectedCells = headers
        .filter((header) => header !== 'individual')
        .map((header) => ({ rowIndex, header, value: rows[rowIndex][header] }));
      setSelectedCells(selectedCells);
      setSelectedRow(rowIndex);
    }
  };

  const handleMergeCheckboxChange = (rowIndex) => {
    if (!dontMergeRows.includes(rowIndex)) {
      clearRowSelection(rowIndex);
      setDontMergeRows([...dontMergeRows, rowIndex]);
    } else {
      const index = dontMergeRows.indexOf(rowIndex);
      if (index !== -1) {
        const newDontMergeRows = [...dontMergeRows];
        newDontMergeRows.splice(index, 1);
        setDontMergeRows(newDontMergeRows);
      }
    }
  };

  // eslint-disable-next-line max-len
  const shouldHoverCell = (rowIndex, header) => !isCellSelected(rowIndex, header) && header !== 'individual' && !dontMergeRows.includes(rowIndex);
  const shouldDisableCell = (rowIndex) => dontMergeRows.includes(rowIndex);
  const shouldCrossText = (rowIndex) => rows[rowIndex]?.is_deleted;
  const isDontMereChecked = (rowIndex) => (
    (dontMergeRows.includes(rowIndex) && !completedData) || (completedData && !rows[rowIndex]?.is_deleted)
  );

  useEffect(() => {
    if (completedData) {
      const numberOfRows = Array.from(Array(rows.length).keys());
      clearAllCellSelection();
      setDontMergeRows(numberOfRows);
    }
  }, [completedData]);

  return (
    <div className={classes.tableContainer}>
      <TableContainer className={classes.paper}>
        <Table size="small" className={classes.table} aria-label="dynamic table">
          <TableHead className={classes.header}>
            <TableRow className={classes.header}>
              <TableCell key="checkbox-header-merge" className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.merge.header" />
              </TableCell>
              <TableCell key="checkbox-header" className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.checkbox.header" />
              </TableCell>
              {headers.map((header, index) => (
                <TableCell key={index}>{header}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                className={classes.tableRow}
              >
                <TableCell key={`merge-cell-${rowIndex}`} className={classes.checkboxCell}>
                  {rowIndex
                    ? (
                      <Checkbox
                        color="primary"
                        checked={isDontMereChecked(rowIndex)}
                        onChange={() => handleMergeCheckboxChange(rowIndex)}
                        disabled={completedData}
                      />
                    )
                    : <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.oldest" />}
                </TableCell>
                <TableCell key={`checkbox-cell-${rowIndex}`} className={classes.checkboxCell}>
                  <Checkbox
                    color="primary"
                    checked={rowIndex === selectedRow}
                    onChange={() => handleCheckboxChange(rowIndex)}
                    disabled={shouldDisableCell(rowIndex)}
                  />
                </TableCell>
                {headers.map((header, headerIndex) => (
                  <TableCell
                    key={headerIndex}
                    className={`
                    ${isCellSelected(rowIndex, header) ? classes.selectedCell : ''} 
                    ${shouldHoverCell(rowIndex, header) ? classes.hoverableCell : ''} 
                    ${shouldDisableCell(rowIndex) ? classes.tableDisabledCell : ''}
                    ${shouldCrossText(rowIndex) ? classes.strikethrough : ''}
                    `}
                    onClick={() => handleCellClick(rowIndex, header, row[header])}
                  >
                    {row[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            <TableRow
              className={classes.tableRow}
            >
              <TableCell className={classes.checkboxCell} />
              <TableCell className={classes.checkboxCell}>
                <FormattedMessage module="deduplication" id="BeneficiaryDuplicatesTable.output" />
              </TableCell>
              {headers.map((header, headerIndex) => (
                <TableCell
                  key={headerIndex}
                  className={`${classes.tableDisabledCell} 
                  ${completedData ? classes.selectedCell : ''}`}
                >
                  {Object.prototype.hasOwnProperty.call(fieldValues, header) ? fieldValues[header] : rows[0][header]}
                </TableCell>
              ))}
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
}

export default BeneficiaryDuplicatesTable;
