import React, { useState } from 'react';
import { injectIntl } from 'react-intl';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import {
  formatMessage,
  formatMessageWithValues,
} from '@openimis/fe-core';
import { styled } from '@mui/material/styles';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import DeduplicationFieldPicker from '../pickers/DeduplicationFieldPicker';
import DeduplicationSummaryDialog from './DeduplicationSummaryDialog';

const StyledDeduplicationFieldSelectionDialog = styled('div')(({ theme }) => ({
  '& .item': theme.paper.item,
}));

function DeduplicationFieldSelectionDialog({
  intl,
  benefitPlan,
}) {
  if (!benefitPlan) return null;

  const [selectedValues, setSelectedValues] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [showSummaryDialog, setShowSummaryDialog] = useState(false);

  const handleOpen = () => {
    setSelectedValues([]);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handlePickerChange = (selectedOptions) => {
    setSelectedValues(selectedOptions);
  };

  const handleOpenNextDialog = () => {
    setShowSummaryDialog(true);
    handleClose();
  };

  const handleSummaryDialogClose = () => {
    setShowSummaryDialog(false);
  };

  return (
    <StyledDeduplicationFieldSelectionDialog>
      <Button
        onClick={handleOpen}
        variant="outlined"
        color="#DFEDEF"
        className="button"
        style={{
          border: '0px',
          marginTop: '6px',
        }}
      >
        {formatMessage(intl, 'deduplication', 'deduplicate')}
      </Button>
      <Dialog
        open={isOpen}
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
          {formatMessageWithValues(intl, 'deduplication', 'deduplicate.title', { benefitPlanName: benefitPlan.name })}
        </DialogTitle>
        <DialogContent>
          <DeduplicationFieldPicker
            required
            value={selectedValues}
            module="deduplication"
            benefitPlan={benefitPlan}
            onChange={handlePickerChange}
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
                onClick={handleOpenNextDialog}
                variant="outlined"
                autoFocus
                style={{ margin: '0 16px' }}
                disabled={!selectedValues.length}
              >
                {formatMessage(intl, 'deduplication', 'deduplicate.button.showDuplicateSummary')}
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

      {showSummaryDialog && (
        <DeduplicationSummaryDialog
          intl={intl}
          benefitPlan={benefitPlan}
          handleClose={handleSummaryDialogClose}
          showSummaryDialog={showSummaryDialog}
          setShowSummaryDialog={setShowSummaryDialog}
          selectedValues={selectedValues}
          setSelectedValues={setSelectedValues}
        />
      )}
    </StyledDeduplicationFieldSelectionDialog>
  );
}

const mapStateToProps = (state) => ({
  rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
  confirmed: state.core.confirmed,
});

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch);

export { StyledDeduplicationFieldSelectionDialog };
export default injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(DeduplicationFieldSelectionDialog),
);
