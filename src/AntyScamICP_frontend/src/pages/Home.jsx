import { useEffect, useState } from 'react';
import AppNav from '../components/reusable/AppNav';
import AppFoot from '../components/reusable/AppFoot';
import Intro from '../components/Intro.jsx';
import Features from '../components/Features.jsx';
import Working from '../components/Working.jsx';
import Faq from '../components/Faq.jsx';
import '../styles/home.css';
import DotsComponent from '../components/reusable/DotsComponent';

const sections = ['intro', 'features', 'working', 'faq'];
export default function HomePage (){
    const [activeSection, setActiveSection] = useState('intro');

    useEffect(()=>{
        const handleScroll = () => {
            const offsets = sections.map(sectionId => {
                const element = document.getElementById(sectionId);
                if (element) {
                    return{
                        id: sectionId,
                        top: element.getBoundingClientRect().top,
                    };
                }
                return null;
            }).filter(Boolean);
            const visibleSection = offsets.find(
                offset => offset.top >= 0 && offset.top <= window.innerHeight / 2
            );
            if (visibleSection) {
                setActiveSection(visibleSection.id);
            };
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (<>
        <AppNav/>
        <div className='Pages'>
            <section id='intro'>
                <Intro/>
            </section>
            <section id='features'>
                <Features/>
            </section>
            <section id='working'>
                <Working/>
            </section>
            <section id='faq'>
                <Faq/>
            </section>
        </div>
        <DotsComponent sections={sections} activeSection={activeSection}/>
        <AppFoot/>
    </>);
};