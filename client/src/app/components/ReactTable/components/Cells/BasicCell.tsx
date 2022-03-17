import React from 'react';

interface BasicCellProps {
  value: string | number;
}

export const BasicCell: React.FC<BasicCellProps> = ({ value }) => <span>{value}</span>;
