// import logo from './logo.svg';
import { useEffect, useState } from 'react';
import './App.css';
import { Routes, Route, Link, NavLink,  Outlet, useParams, useMatch, useNavigate } from 'react-router-dom';


const LOAD_TIME = 5000;

const database = {
	productList: [{ id:1, name:'Телевизор'},
	{ id:2, name:'Смартфон'},
	{ id:3, name:'Планшет'},],
	products: {
		1: { id:1, name: 'Телевизор', price: 29000, amount: 12 },
		2: { id:2, name: 'Смартфон', price: 19000, amount: 10 },
		3: { id:3, name: 'Планшет', price: 49000, amount: 2 }
	},
}

const fetchProductList = () => database.productList;

const fetchProduct = (id) => new Promise((resolve) => {
	setTimeout(()=> {
		resolve(database.products[id]);
	}, 2500);
});


const ProductNotFound = () => <div>
	<h3>Такая страница товара не существует</h3>
</div>;

const ProductLoadError = () => <div>
	<h3>Ошибка загрузки товара</h3>
</div>;

const Product = () => {
	const [product, setProduct] = useState(null);
	const params = useParams();
	const navigate = useNavigate();
	// const urlMatchData = useMatch('/catalog/:type/:id');
	// console.log(urlMatchData);

	useEffect(() => {
		let isLoading = false;
		let isProductLoaded = false;
		setTimeout(() => {
			isLoading = true;
			if (!isProductLoaded) {
				navigate('/product-load-error');
			}
		},
		LOAD_TIME);
		fetchProduct(params.id).then((loadedProduct) => {
			isProductLoaded = true;
			if (!isLoading) {
				setProduct(loadedProduct);
			}
		});
	}, [navigate, params.id]);
	if (!product) {
		return <ProductNotFound/>;
	}
	const { name, price, amount } = product;
	return (
		<div>
			<h3>Товар - {name} </h3>
			<div>Цена: {price}</div>
			<div>На складе: {amount}</div>
		</div>
	);
};

const MainPage = () => {
	return(
		<div>Контент главной страницы</div>
	);
};

const NotFound = () => <div>
	<h3>Такая страница не существует</h3>
</div>;


const Catalog = () => {
	return(
		<div>
			<h3>Контент каталога</h3>
			<ul>
				{fetchProductList().map(( {id, name}) => (
					<li key={id}><NavLink to={`product/${id}`}>{name}</NavLink></li>
				))}
			</ul>
			<Outlet/>
		</div>
	);
};

const Contacts = () => {
	return(
		<div>Контент контактов</div>
	);
};

const ExtendedLink = ({to, children}) => (
	<NavLink to={to}>
		{
			({isActive}) => isActive ? (
				<>
					<span>{children}</span>
					<span>*</span>
				</>
			)
			: (children)
		}
	</NavLink>
);

export const App = () => {
	return (
		<div className="app">
			<main className="app-main">
				<h1>Навигация</h1>
				<div>
					<h3>Меню</h3>
					<ul>
						<li>
							<ExtendedLink to="/">Главная</ExtendedLink>
						</li>
						<li><ExtendedLink to="/catalog">Каталог</ExtendedLink></li>
						<li><ExtendedLink to="/contacts">Контакты</ExtendedLink></li>
					</ul>
				</div>
				<Routes>
					<Route path="/" element={<MainPage />} />
					<Route path="/catalog" element={<Catalog />}>
						<Route path="product/:id" element={<Product/>}/>
						<Route path="service/:id" element={<Product/>}/>
					</Route>
					<Route path="/contacts" element={<Contacts />} />
					<Route path="/product-load-error" element={<ProductLoadError />} />
					<Route path="*" element={<NotFound />} />
				</Routes>
			</main>
		</div>
	);
};
