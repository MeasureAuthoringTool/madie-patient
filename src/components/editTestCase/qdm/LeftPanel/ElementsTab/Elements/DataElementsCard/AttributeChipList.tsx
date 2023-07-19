import React from 'react';
import AttributeChip from './AttributeChip';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';

const AttributeChipList = ({ items}) => {
    
    return <div className="chip-list">
        {items.map((text) => (<AttributeChip text={text}/>))}
    </div>
}

export default AttributeChipList;


