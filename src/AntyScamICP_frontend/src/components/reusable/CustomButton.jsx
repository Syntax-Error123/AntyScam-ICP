import React from 'react';
import { Link } from 'react-router-dom';
import '../../styles/nav.css';

const CustomButton = ({ buttonText, buttonLink, style, btnStyle, onClick, icon, iconSize, showIcon=false, className = '' }) => {
    return (
        <Link style={style} className={`nav-btnn ${className}`} to={buttonLink}>
            <button style={btnStyle} onClick={onClick}>
                <span style={{'alignSelf' : 'center',}}>{buttonText}</span>
                {showIcon && <img src={icon} width={iconSize} height={iconSize} alt='Not Found!'/>}
            </button>
        </Link>
    );
};


export default CustomButton;
