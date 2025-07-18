import React, { useState } from 'react';
import { useTranslations, Autocomplete } from '@openimis/fe-core';
import { BASIC_FIELDS } from '../../constants';

function DeduplicationFieldPicker({
  readOnly,
  benefitPlan,
  value,
  onChange,
  required,
  multiple = true,
  placeholder,
  withLabel,
  withPlaceholder,
  label,
  filterOptions,
  filterSelectedOptions,
}) {
  const [searchString, setSearchString] = useState();
  const { formatMessage } = useTranslations('deduplication');

  const beneficiaryDataSchema = JSON.parse(benefitPlan?.beneficiaryDataSchema);
  const schemaFields = Object.keys(beneficiaryDataSchema?.properties ?? {});
  const schemaFieldsList = schemaFields.map((key) => ({ id: key, name: key }));
  const possibleFields = [...schemaFieldsList, ...BASIC_FIELDS];

  return (
    <Autocomplete
      multiple={multiple}
      required={required}
      placeholder={placeholder ?? formatMessage('deduplication.deduplicate.fields.placeholder')}
      label={label ?? formatMessage('deduplication.deduplicate.fields')}
      error={[]}
      withLabel={withLabel}
      withPlaceholder={withPlaceholder}
      readOnly={readOnly}
      options={possibleFields}
      isLoading={false}
      value={value}
      getOptionLabel={(o) => o?.name}
      onChange={(option) => onChange(option, option?.name)}
      filterOptions={filterOptions}
      filterSelectedOptions={filterSelectedOptions}
      onInputChange={() => setSearchString(searchString)}
    />
  );
}

export default DeduplicationFieldPicker;
