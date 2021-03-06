import React from "react";
import { unmountComponentAtNode } from "react-dom";
import { createRoot } from 'react-dom/client';
import { act } from "react-dom/test-utils";
import ShallowRenderer from 'react-shallow-renderer';
import exampleProducts from './ricTestData.js';

import ProductCards from '../ProductCard.jsx';
import Carousel, { CarouselItem } from '../Carousel';

global.IS_REACT_ACT_ENVIRONMENT = true
describe('Carousel Test', () => {
  let container = null;
  let clickTracker = jest.fn();
  beforeEach(async () => {
    // setup a DOM element as a render target
    container = document.createElement("div");
    document.body.appendChild(container);
    let compare = jest.fn();
    await act(() => {
      createRoot(container).render(
        <Carousel clickTracker={clickTracker}>
          {exampleProducts.products.data.map((product, index) => {
            return(
              <CarouselItem key={product.id}>
                <ProductCards category={product.category}
                  name={product.name}
                  default_price={product.default_price}
                  sale_price={product.sale_price}
                  star_rating={product.star_rating}
                  thumbnail={product.thumbnail}
                  id={product.id}
                  list={product.list}
                  compare={compare}
                  index={index}
                  />
              </CarouselItem>
            )
          })}
        </Carousel>
        )
      })
  });
  afterEach(() => {
    // cleanup on exiting
    unmountComponentAtNode(document);
    container.remove();
    container = null;
  });

  it('should render carousel', () => {
    const renderer = new ShallowRenderer();
    renderer.render(<Carousel />);
    const result = renderer.getRenderOutput();
    expect(result.props.className).toBe('carousel');
    expect(result.props.children[0].props.className).toBe('back');
    expect(result.props.children[1].props.className).toBe('carousel_inner');
    expect(result.props.children[2].props.className).toBe('next');
  });

  it('should have product cards in carousel', async () => {
    expect(container.querySelectorAll('div.card').length).toEqual(4);
    expect(container.querySelectorAll('div.carousel_item').length).toEqual(4);
  });

  it('should not have a back button when at start of related products list', async () => {
    expect(container.querySelectorAll('#back').length).toEqual(0);
  });

  it('should have back button after clicking next once', async () => {
    await act(async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });
      await window.dispatchEvent(new Event('resize'))
    });
    await act(() => {
      container.querySelector('#next').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    });
    expect(container.querySelectorAll('#back').length).toEqual(1);
  });
  it('should hide next button after reaching end of list', async () => {
    await act(async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 800,
      });
      await window.dispatchEvent(new Event('resize'))
    });
    await act(async () => {
      await container.querySelector('#next').dispatchEvent(new MouseEvent('click', { bubbles: true }))
    });
    expect(container.querySelectorAll('button.next').length).toEqual(0);
  });

  it('should hide back button at mount', async () => {
    expect(container.querySelector('button.back')).toBe(null);
  });

  it('should show next and back button contingent on how many cards are showing', async () => {
    await act(async () => {
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 640,
      });
      await window.dispatchEvent(new Event('resize'))
    })
    expect(container.querySelector('button.back')).toBe(null);
    expect(container.querySelector('button.next')).not.toBe(null);
    await act(async () => {
      await container.querySelector('#next').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.querySelector('button.next')).not.toBe(null);
    await act(async () => {
      await container.querySelector('#next').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.querySelector('button.next')).toBe(null);
    expect(container.querySelector('button.back')).not.toBe(null);
    await act(async () => {
      await container.querySelector('#back').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.querySelector('button.back')).not.toBe(null);
    expect(container.querySelector('button.next')).not.toBe(null);
    await act(async () => {
      await container.querySelector('#back').dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
    expect(container.querySelector('button.back')).toBe(null);
    expect(container.querySelector('button.next')).not.toBe(null);
  })
  // need to figure out way to remove element carousel item from carousel and rerender
})