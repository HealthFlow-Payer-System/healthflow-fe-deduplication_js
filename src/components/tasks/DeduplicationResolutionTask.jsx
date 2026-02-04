import React from 'react';
import { Typography } from '@mui/material';
import { styled } from '@mui/material/styles';
import BeneficiaryDuplicatesTable from '../BeneficiaryDuplicatesTable';

const StyledDeduplicationResolutionTask = styled('div')(({ theme }) => ({
  '& .paper': theme.paper?.paper ?? {},
  '& .title': theme.paper?.title ?? {},
}));

function BeneficiaryDeduplicationTaskDisplay({
  businessData, setAdditionalData, jsonExt,
}) {
  if (!businessData) return null;

  const completedData = jsonExt?.additional_resolve_data
    ? Object.values(jsonExt.additional_resolve_data)[0].values
    : null;
  const beneficiaries = (businessData?.ids || []).map((id) => {
    const {
      // eslint-disable-next-line camelcase
      individual, json_ext, uuid, ...rest
    } = id;
    return {
      ...rest,
      ...individual,
      // eslint-disable-next-line camelcase
      ...json_ext,
      individual: individual.uuid,
      beneficiaryId: uuid,
    };
  });

  const headers = businessData?.headers || [];
  const individualIndex = headers.indexOf('individual');

  if (individualIndex !== -1) {
    headers.splice(individualIndex, 1);
    headers.unshift('individual');
  }

  beneficiaries.sort((a, b) => new Date(a.date_created) - new Date(b.date_created));

  return (
    <StyledDeduplicationResolutionTask>
      <Typography className="title" style={{ textAlign: 'center' }}>
        {JSON.stringify(businessData?.column_values)}
        {' '}
        ,
        count:
        {' '}
        {businessData?.count}
      </Typography>
      <div>
        <BeneficiaryDuplicatesTable
          headers={headers}
          rows={beneficiaries}
          setAdditionalData={setAdditionalData}
          completedData={completedData}
        />

      </div>
    </StyledDeduplicationResolutionTask>
  );
}

const DeduplicationResolutionTaskTableHeaders = () => [];

const DeduplicationResolutionItemFormatters = () => [
  (businessData, jsonExt, formatterIndex, setAdditionalData) => (
    <BeneficiaryDeduplicationTaskDisplay
      businessData={businessData}
      setAdditionalData={setAdditionalData}
      jsonExt={jsonExt}
    />
  ),
];

export { DeduplicationResolutionTaskTableHeaders, DeduplicationResolutionItemFormatters };
