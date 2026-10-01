import './ListComponent.scss';
import { useLanguage } from '../../context/LanguageContext';


export function ListComponent ({ content = {} }) {

    const { translate } = useLanguage();

    console.log(content);
    return(
        <div className='listcomponent-container container'>
            <h2 className='listcomponent-title'>{translate(content.title)}</h2>
            <div className="listcomponent-list">
                {content.columns.map((column) => (
                    <div className="listcomponent-column" key={column.title.en}>
                    <h3>{translate(column.title)}</h3>

                    <div className="listcomponent-items">
                        {column.items.map((item) => (
                        <p key={item}>{item}</p>
                        ))}
                    </div>
                    </div>
                ))}
            </div>

        </div>
    )
}