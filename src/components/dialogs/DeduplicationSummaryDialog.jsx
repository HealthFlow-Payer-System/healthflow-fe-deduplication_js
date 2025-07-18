import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import { formatMessage } from '@openimis/fe-core';
import { withTheme, withStyles } from '@material-ui/core/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeduplicationSummaryTable from '../tables/DeduplicationSummaryTable';
import { createDeduplicationTasks, fetchDeduplicationSummary } from '../../actions';

const styles = (theme) => ({
  item: theme.paper.item,
});

function DeduplicationSummaryDialog({
  intl,
  benefitPlan,
  handleClose,
  showSummaryDialog,
  setShowSummaryDialog,
  selectedValues,
  createDeduplicationTasks,
}) {
  const [summary, setSummary] = useState();
  if (!benefitPlan) return null;

  const columns = selectedValues.map((value) => value.id);
  const columnParam = `columns: ${JSON.stringify(columns)}`;

  const onDeduplicationTasksClick = () => {
    if (summary) {
      createDeduplicationTasks(summary, formatMessage(intl, 'deduplication', 'deduplicate.mutation.createTasks'));
    }
    setShowSummaryDialog(false);
  };

  return (
    <Dialog
      open={showSummaryDialog}
      onClose={handleClose}
      PaperProps={{
        style: {
          width: 900,
          maxWidth: 900,
        },
      }}
    >
      <DialogTitle
        style={{
          marginTop: '10px',
        }}
      >
        {formatMessage(intl, 'deduplication', 'deduplicate.summary.title')}
      </DialogTitle>
      <DialogContent>
        <DeduplicationSummaryTable
          columnParam={columnParam}
          benefitPlan={benefitPlan}
          fetchDeduplicationSummary={fetchDeduplicationSummary}
          setSummary={setSummary}
        />
      </DialogContent>
      <DialogActions
        style={{
          display: 'inline',
          paddingLeft: '10px',
          marginTop: '25px',
          marginBottom: '15px',
        }}
      >
        <div>
          <div style={{ float: 'left' }}>
            <Button
              onClick={() => onDeduplicationTasksClick()}
              variant="outlined"
              autoFocus
              disabled={!summary}
              style={{ margin: '0 16px' }}
            >
              {formatMessage(intl, 'deduplication', 'deduplicate.button.createDeduplicationReviewTask')}
            </Button>
          </div>
          <div style={{
            float: 'right',
            paddingRight: '16px',
          }}
          >
            <Button
              onClick={handleClose}
              variant="outlined"
              autoFocus
              style={{ margin: '0 16px' }}
            >
              {formatMessage(intl, 'deduplication', 'deduplicate.button.cancel')}
            </Button>
          </div>
        </div>
      </DialogActions>
    </Dialog>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
  createDeduplicationTasks,
}, dispatch);

export default injectIntl(
  withTheme(withStyles(styles)(connect(mapStateToProps, mapDispatchToProps)(DeduplicationSummaryDialog))),
);
