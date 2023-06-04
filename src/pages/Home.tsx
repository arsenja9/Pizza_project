import React from 'react';
import {useSelector} from "react-redux";
import qs from 'qs'
import {useNavigate} from "react-router-dom";

import {Skeleton, PizzaBlock, Sort, Pagination, Categories} from "../components";


import {setCategoryId, setCurrentPage} from "../redux/filter/slice";
import {selectFilter} from '../redux/filter/selectors'
import {selectPizzaData} from "../redux/pizzas/selectors";
import {fetchPizzas} from '../redux/pizzas/asyncAction'
import {useAppDispatch} from "../redux/store";

const Home: React.FC = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()
    const isMounted = React.useRef(false)


    const {categoryId, sort, currentPage, searchValue} = useSelector(selectFilter);
    const {status, items} = useSelector(selectPizzaData);

    const onChangePage = (num: number) => {
        dispatch(setCurrentPage(num))
    }

    const onClickCategory = React.useCallback((id: number) => {
        dispatch(setCategoryId(id))
    }, [])

    const getPizzas = () => {

        const sortBy = sort.sortProperty.replace('-', '')
        const order = sort.sortProperty.includes('-') ? 'asc' : 'desc'
        const category = categoryId > 0 ? `category=${categoryId}` : ''
        const search = searchValue ? `&search=${searchValue}` : ''

        dispatch(
            fetchPizzas({
                sortBy,
                order,
                category,
                search,
                currentPage: String(currentPage)
            })
        )
        window.scrollTo(0, 0)
    }

    React.useEffect(() => {
        getPizzas()


    }, [categoryId, sort.sortProperty, searchValue, currentPage])


    React.useEffect(() => {
        if (isMounted.current) {
            const queryString = qs.stringify({
                sortProperty: sort.sortProperty,
                categoryId,
                currentPage
            })
            navigate(`?${queryString}`)
        }
        isMounted.current = true
    }, [categoryId, sort.sortProperty, currentPage])


    const pizzas = items.map((obj: any) => (<PizzaBlock key={obj.id} {...obj} />
    ))
    const skeletons = [...new Array(6)].map((_, index) => <Skeleton key={index}/>)
    return (
        <div className="container">
            <div className="content__top">
                <Categories value={categoryId} onClickCategory={onClickCategory}/>
                <Sort value={sort}/>
            </div>
            <h2 className="content__title">Все пиццы</h2>
            {status === 'error' ? (
                <div className="content__error-info">
                    <h2>Произошла ошибка 😕</h2>
                    <p>К сожалению, не удалось получить питсы. Попробуйте повторить попытку позже.</p>
                </div>
            ) : (
                <div className="content__items">{status === 'loading' ? skeletons : pizzas}</div>
            )}

            <Pagination currentPage={currentPage} onChangePage={onChangePage}/>
        </div>
    );
};
export default Home;