import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import {
  TableContainer, TableHead, TableBody, Table, TableCell, TableRow, Paper,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';

import { useModulesManager, ProgressOrError, useTranslations } from '@openimis/fe-core';
import { MODULE_NAME } from '../../constants';

const useStyles = makeStyles((theme) => ({
  footer: {
    marginInline: 16,
    marginBlock: 12,
  },
  headerTitle: theme.table.title,
  actionCell: {
    width: 60,
  },
  header: theme.table.header,
}));

const DEDUPLICATION_SUMMARY_HEADERS = [
  'deduplication.deduplicationSummaryTable.group',
  'deduplication.deduplicationSummaryTable.duplicates',
];

function DeduplicationSummaryTable({
  columnParam, benefitPlan, fetchDeduplicationSummary, setSummary,
}) {
  const dispatch = useDispatch();
  const modulesManager = useModulesManager();
  const classes = useStyles();
  const { formatMessage } = useTranslations(MODULE_NAME, modulesManager);
  const {
    fetchingSummary, summary, errorSummary,
  } = useSelector((store) => store.deduplication);

  useEffect(() => {
    const params = [columnParam, `benefitPlanId: "${benefitPlan.id}"`];
    dispatch(fetchDeduplicationSummary(params));
  }, []);

  useEffect(() => {
    setSummary(summary);
  }, [summary]);

  function reshapeColumnValues(inputString) {
    const columnValues = JSON.parse(inputString);
    const formattedValues = Object.entries(columnValues).map(([key, value]) => {
      const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
      const formattedValue = value !== null ? value : 'null';
      return `${formattedKey}: ${formattedValue}`;
    });
    const resultString = formattedValues.join(', ');
    return resultString;
  }

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead className={classes.header}>
          <TableRow className={classes.headerTitle}>
            {DEDUPLICATION_SUMMARY_HEADERS.map((header) => (
              <TableCell key={header}>
                {' '}
                {formatMessage(header)}
                {' '}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          <ProgressOrError progress={fetchingSummary} error={errorSummary} />
          {summary?.map((result) => (
            <TableRow key={result?.uuid}>
              <TableCell>
                {' '}
                {reshapeColumnValues(result.columnValues)}
                {' '}
              </TableCell>
              <TableCell>
                {' '}
                {result.count}
                {' '}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default DeduplicationSummaryTable;
