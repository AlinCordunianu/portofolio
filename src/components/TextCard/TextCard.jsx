import './TextCard.scss';
import { useLanguage } from '../../context/LanguageContext';

export function TextCard ({ content = {}}) {
    const { translate } = useLanguage();

    return (
        <div id={content.sectionId} className='textcard-container container'>
            <h2 className='textcard-title'>{translate(content.title)}</h2>
            <p className='textcard-description'>{translate(content.text)}</p>
        </div>
    )
}
