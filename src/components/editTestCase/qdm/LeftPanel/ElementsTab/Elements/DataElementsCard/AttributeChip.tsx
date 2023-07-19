import React from 'react';
import "./AttributeChipList.scss"
const AttributeChip = (AttributeChipProps: {
    text
}) => {
    const { text } = AttributeChipProps;
    return <div className="chip-body">
        {text}
    </div>
}
export default AttributeChip;