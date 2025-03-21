import "../../styles/dots.css";

export default function DotsComponent({sections, activeSection}){
    return <div className="container">
        {sections.map(section =>(
            <div key={section}
                className={`dot ${activeSection === section ? 'active' : ''}`}
                onClick={()=> document.getElementById(section).scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                })}
                >
            </div>
        ))}
    </div>
}