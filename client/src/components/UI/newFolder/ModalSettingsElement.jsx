import React from 'react';

const ModalSettingsElement = ({body, image, ...props} ) => {
    return (
        <div onClick={props} className="example">
            <img src={image} alt=""/>
            {body}
        </div>
    );
};

export default ModalSettingsElement;