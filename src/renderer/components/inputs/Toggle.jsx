import React  from 'react';

const Toggle = ({ name, label, checked, keyScope, onChange, tabIndex = -1, children }) => {


    return (
        <div className="form-group">
            <label className="form-switch">
            <input type="checkbox"
                   tabIndex={tabIndex}
                   name={name}
                   checked={checked}
                   onChange={(e) => onChange(!checked)}
                   data-keyscope={keyScope}
                   />
                <i className="form-icon"></i> {label}
            </label>
            {checked
                ? children
                : null
            }
        </div>
    );
}

export default Toggle;
