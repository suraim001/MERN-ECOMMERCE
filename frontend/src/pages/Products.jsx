import React, { useEffect, useState } from 'react';
import '../pageStyles/Products.css'
import '../componentStyles/Filters.css'
import PageTitle from '../components/PageTitle';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { useDispatch, useSelector } from 'react-redux';
import Product from '../components/Product';
import { getProduct, removeErrors } from '../features/products/productSlice';
import { toast } from 'react-toastify';
import Loader from '../components/Loader';
import { useLocation, useNavigate } from 'react-router-dom';
import NoProducts from '../components/NoProducts';
import Pagination from '../components/Pagination';

const Products = () => {

    const { loading, error, products, resultPerPage, productCount } = useSelector(state => state.product);
    const dispatch = useDispatch();
    const location = useLocation();
    const navigate = useNavigate();

    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword");
    const category = searchParams.get("category");
    const pageFromURL = parseInt(searchParams.get("page"), 10) || 1;
    const limitFromURL = parseInt(searchParams.get("limit"), 10) || 6;
    const presetLimits = [2, 4, 6, 8, 10];
    const [currentPage, setCurrentPage] = useState(pageFromURL);
    const [currentLimit, setCurrentLimit] = useState(Number(limitFromURL));
    const [limitInputValue, setLimitInputValue] = useState(String(limitFromURL));
    const [selectedLimit, setSelectedLimit] = useState("");

    const categories = ["laptop", "mobile", "tv", "shirt", "pant"];


    useEffect(() => {
        dispatch(getProduct({ keyword, page: currentPage, limit: currentLimit, category }));
    }, [dispatch, keyword, currentPage, currentLimit, category]);

    useEffect(() => {
        if (error) {
            toast.error(error.message, { position: 'top-center', autoClose: 3000 });
            dispatch(removeErrors());
        }
    }, [dispatch, error])

    const handlePageChange = (page) => {
        if (page !== currentPage) {
            setCurrentPage(page);
        }

        const newSearchParams = new URLSearchParams(location.search);

        if (page === 1) {
            newSearchParams.delete('page');
        } else {
            newSearchParams.set('page', page)
        }

        navigate(`?${newSearchParams.toString()}`)
    }

    const applyLimit = (value) => {
        const validValue = Number(value);

        if (!Number.isInteger(validValue) || validValue <= 0) {
            return;
        }

        setCurrentLimit(validValue);
        setLimitInputValue(String(validValue));
        setCurrentPage(1);

        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set('limit', String(validValue));
        newSearchParams.delete('page');
        navigate(`?${newSearchParams.toString()}`);
    };

    const handleSelectLimitChange = (event) => {
        const value = event.target.value;
        setSelectedLimit(value);
        if (value) {
            applyLimit(value);
        }
    };

    const handleLimitChange = (event) => {
        const rawValue = event.target.value;
        setLimitInputValue(rawValue);

        if (rawValue === '') {
            return;
        }

        if (!/^\d+$/.test(rawValue)) {
            return;
        }
    };

    const handleLimitKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            const rawValue = limitInputValue.trim();

            if (!/^\d+$/.test(rawValue)) {
                return;
            }

            const value = Number(rawValue);
            if (value > 0) {
                applyLimit(value);
            }
        }
    };

    const handleCategoryClick = (category) => {
        const newSearchParams = new URLSearchParams(location.search);
        newSearchParams.set('category', category);
        newSearchParams.delete('page');
        navigate(`?${newSearchParams.toString()}`);
    }

    const isNoProductsError = error?.statusCode === 404;
    const hasNoProducts = products.length === 0 || isNoProductsError;

    return (
        <>
            {loading ? (<Loader />) : (<>
                <PageTitle title='All Products' />
                <Navbar />
                <div className="products-layout">
                    <div className="filter-section">
                        <div className="filter-limit">
                            <h4 className='filter-limit-heading'>Results Per Page</h4>
                            <input
                                type="text"
                                className="limit-input-field"
                                inputMode="numeric"
                                pattern="[1-9][0-9]*"
                                placeholder="Results Per Page"
                                value={limitInputValue}
                                onChange={handleLimitChange}
                                onKeyDown={handleLimitKeyDown}
                            />
                            <select
                                className="limit-select-field"
                                value={""}
                                onChange={handleSelectLimitChange}
                            >
                                <option value="" disabled>
                                    Select
                                </option>
                                {presetLimits.map((limit) => (
                                    <option key={limit} value={String(limit)}>
                                        {limit}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <h3 className='filter-heading'>CATEGORIES</h3>
                        {/* Render Categories */}
                        <ul>
                            {
                                categories.map((category)=>{
                                    return(
                                        <li key={category} onClick={()=>handleCategoryClick(category)}>{category}</li>
                                    )
                                })
                            }
                        </ul>
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
                        <Pagination
                            currentPage={currentPage}
                            onPageChange={handlePageChange}

                        />
                    </div>
                </div>
                <Footer />
            </>)}
        </>
    )
}

export default Products
