import React from 'react';
import defaultSrc from './default.png';

interface IProps {
    src: string,
    className: string
}

const FirebaseImg: React.FC<IProps> = (props) => {
    const {src, className} = props;

    return (
        <>
            <img  className={className} src={src ? src : defaultSrc} alt={src} />
        </>
    );
};

export default FirebaseImg;