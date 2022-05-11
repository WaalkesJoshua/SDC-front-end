import React from 'react';
import { createRoot } from 'react-dom/client';

import QAMain from './components/Questions_Answers/QAMain.jsx';
import RatingsAndReviews from './components/ratingsAndReviews/ratingsAndReviews.jsx';
import RIC from './components/RIC_Component/RIC.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div>
        <QAMain />
        <RatingsAndReviews></RatingsAndReviews>
        <RIC />
      </div>
    );
  }
}

root.render(<App />);
