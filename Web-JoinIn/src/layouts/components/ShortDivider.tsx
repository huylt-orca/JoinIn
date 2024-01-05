import { Divider } from '@mui/material';
import React from 'react';

interface ShortDividerProps {
  width: string;
}

const ShortDivider : React.FC<ShortDividerProps> = ({ width ='50%' }) => {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Divider sx={{ height: 1, width: width }} />
    </div>
  );
};

export default ShortDivider;
