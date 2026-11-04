import React, { useEffect } from 'react';
import '../pageStyles/Products.css'
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useLocation } from 'react-router-dom';
import NoProducts from '../components/NoProducts';

const Products = () => {

    const { loading, error, products, resultsPerPage, productCount} = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location = useLocation();

    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    // console.log(keyword);


    useEffect(() => {
        dispatch(getProduct({ keyword }));
    }, [dispatch, keyword]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    const isNoProductsError = error?.statusCode === 404;
    const hasNoProducts = products.length === 0 || isNoProductsError;

    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title='All Products' />
                <Navbar />
                <div className="products-layout">
                    <div className="filter-section">
                        <h3 className='filter-headng'>CATEGORIES</h3>
                        {/* Redner Categories */}
                    </div>
                    <div className="products-section">
                        {!hasNoProducts ? (
                            <div className="products-product-container">
                                {products.map((product) => (
                                    <Product key={product._id} product={product} />
                                ))}
                            </div>
                        ) : (
                            <NoProducts keyword={keyword} />
                        )}
                    </div>
                </div>
                <Footer />
            </>) }
        </>
    )
}

export default Products
