import React from 'react';
import { createRoot } from 'react-dom/client';

import Overview from './components/overview/Overview';
import QAMain from './components/Questions_Answers/QAMain.jsx';
import RatingsAndReviews from './components/ratingsAndReviews/ratingsAndReviews.jsx';
import RIC from './components/RIC_Component/RIC.jsx';

import ClickTracker from './components/common/ClickTracker.jsx';

const container = document.getElementById('root');
const root = createRoot(container);

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      addProduct: false
    };
    this.addProduct = this.addProduct.bind(this);
  }

  addProduct() {
    this.setState({ addProduct: !this.state.addProduct })
  }

  render() {
    const QA = ClickTracker(QAMain, 'Question & Answer');
    const RI = ClickTracker(RIC, 'Related Items');
    const OVR = ClickTracker(Overview, 'Overview')
    return (
      <div>
<<<<<<< HEAD
        {/* <OVR /> */}
=======
        <OVR addOutfit={this.addProduct} isAdded={this.state.addProduct}/>
>>>>>>> 6f2798ab2a92bb00179db70e6b6ef67113e7849e
        <RI added={this.state.addProduct} />
        {/* <QA /> */}
        {/* <RatingsAndReviews /> */}
      </div>
    );
  }
}

root.render(<App />);
