import '../../styles/card.css';

export default function Card({className, image, title, sx, description, radius, showImage=true, children}) {
    return <div className={`card-container ${className}`} style={sx}>
        {showImage && <img src={image} alt='Not Found!'/>}
        {!children ? (<>
            <h3 className='title'>{title}</h3>
            <p className='description'>{description}</p>
        </>) : children}
    </div>;
};