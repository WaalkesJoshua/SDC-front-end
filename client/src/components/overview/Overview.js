// this is the Parent Overview Component

import React from 'react';

import Container from './Container';
import ProductDescription from './ProductDescription';

import sendRequest from '../../../../server/lib/sendRequest';
import axios from 'axios';


class Overview extends React.Component {
  constructor(props) {
    super();
    this.state = {
      styles: null,
      rating: null,
      info: null,
      currentStyle: null,
      didError: false,
      error: null,
      force: 0,
    };
    // remote this later
    // this.testId = '71699';
    this.testId = window.location.href.split('/').pop();
    this.handleStyleChange = this.handleStyleChange.bind(this);
  }

  getData(endpoint) {
    axios({
      method: 'GET',
      url: `/overview/parser/${endpoint}`,
    })
    .then((res) => {
      this.setState({
        info: res.data.info,
        styles: res.data.styles.results,
        rating: res.data.rating,
      });
    })
    .catch(err => {
      console.log('Error Contacting Endpoint:', err)
    })
  }

  // fetch one Id statically for now
  componentDidMount() {
    this.getData(this.testId);
    // this.setState({products: testProducts})
  }

  // There will need to be another request made to get the product category, slogen, description, ect...
  //  GET /products/:product_id

  componentDidUpdate(prevProps, PrevState) {
    if (PrevState.styles !== this.state.styles) {
      // set current Prodct to be the first product in the list
      this.setState({ currentProduct: this.getDefault() });
    }
  }

  getDefault() {
    const key = 'default?';
    Array.from(this.state.styles).forEach((item) => {
      if (item[key]) {
        this.setState({ currentStyle: item });
      }
    });
  }

  handleStyleChange(id, e) {
    this.props.clickTracker(e)
    // use this style id to set the current style to one that matches that id
    // should be in the current set of styles
    this.state.styles.forEach((item) => {
      if (item.style_id === id) {
        this.setState({ currentStyle: item });
      }
    });
  }

  render() {
    return (
      <section className="Overview">
        <Container
          styles={this.state.styles}
          info={this.state.info}
          rating={this.state.rating}
          currentStyle={this.state.currentStyle}
          handleStyleChange={this.handleStyleChange}
          ClickTracker={this.props.clickTracker}
        />
        <ProductDescription info={this.state.info} />
      </section>
    );
  }
}

export default Overview;
