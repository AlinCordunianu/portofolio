import './Footer.scss';

export function Footer ({content = {}}) {
    

    return (
        <div id={content.sectionId} className='footer-container container'>
            <a href={`mailto:${content.email}`} className='footer-mail'>{content.email}</a>
            <div className='footer-button-container'>
                <a href={content.links[0].url}>{content.links[0].label}</a>
                <a href={content.links[1].url}>{content.links[1].label}</a>

            </div>
        </div>
    )
}
