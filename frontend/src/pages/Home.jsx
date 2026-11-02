import React from 'react';
import "../pageStyles/Home.css";
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';
import ImageSlider from '../components/ImageSlider';
import Product from '../components/Product';

const products = [
  {
    "_id": "6ae123ba5aaae7bad38fe8dd",
    "name": "Product 4",
    "description": "Product description 4",
    "price": 200,
    "ratings": 3.75,
    "image": [
      {
        "public_id": "This is a test public_id 4",
        "url": "This is a test url 4",
        "_id": "6ae123ba5aaae7bad38fe8de"
      }
    ],
    "category": "t-shirt",
    "stock": 30,
    "numOfReviews": 2,
    "user": "6ae12111cb7fd4a2405a3631",
    "reviews": [
      {
        "user": "6ae3ba7b0066c6b5236998e2",
        "name": "Test User 1",
        "ratings": 3,
        "comment": "I didn't like the product",
        "_id": "6ae63682d72710e9873a8734"
      },
      {
        "user": "6ae6370059db274b16330c87",
        "name": "Test User 2",
        "ratings": 4.5,
        "comment": "Much better than the one i bought from the local market",
        "_id": "6ae641656153e883624533e0"
      }
    ],
    "createdAt": "2026-10-27T22:20:42.743Z",
    "__v": 19
  },
  {
    "_id": "6ae1250fe93917d5645d1f85",
    "name": "Bindo",
    "description": "Product description 5",
    "price": 1120,
    "ratings": null,
    "image": [
      {
        "public_id": "This is a test public_id 5",
        "url": "This is a test url 5",
        "_id": "6ae1250fe93917d5645d1f86"
      }
    ],
    "category": "shirt",
    "stock": 7,
    "numOfReviews": null,
    "user": "6ae12111cb7fd4a2405a3631",
    "reviews": [],
    "createdAt": "2026-10-27T22:26:23.289Z",
    "__v": 0
  }
]

const Home = () => {
  return (
    <>
      <Navbar />
      <ImageSlider />
      <div className="home-container">
        <h2 className='home-heading'>Trending Now</h2>
        <div className="home-product-container">
          {products.map((product, index)=>
          <Product product={product} key={index}/>)}
        </div>
      </div>
      <Footer />
    </>
  )
}

export default Home
