import './App.scss';

import { Header } from './components/Header/Header';
import { Hero } from './components/Hero/Hero';
import { TwoColumnCard } from './components/TwoColumnCard/TwoColumnCard';
import { ListComponent } from './components/ListComponent/ListComponent';
import { TextCard } from './components/TextCard/TextCard';
import { Footer } from './components/Footer/Footer';

import data from './content.json';

function App() {
  const components = {
    header: Header,
    hero: Hero,
    twocolumncard: TwoColumnCard,
    listcomponent: ListComponent,
    textcard: TextCard,
    footer: Footer
  };

  return (
    <>
      {data.map((component) => {
        const Component = components[component.type];

        if (!Component) {
          return null;
        }

        return (
          <Component
            key={component.id}
            content={component.content}
          />
        );
      })}
    </>
  );
}

export default App;