import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Input, Spin, Tabs } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { fetchCategories, fetchCuisines } from '../store/slices/recipesSlice';

const { TabPane } = Tabs;
const { Search } = Input;

const CategoryCuisineListPage = () => {
    // const dispatch = useDispatch();
    // const { categories, cuisines, loading } = useSelector((state) => state.recipes);
    // const [searchTerm, setSearchTerm] = useState('');
    // const [activeTab, setActiveTab] = useState('categories');
    // const [filteredCategories, setFilteredCategories] = useState([]);
    // const [filteredCuisines, setFilteredCuisines] = useState([]);

    // useEffect(() => {
    //     dispatch(fetchCategories());
    //     dispatch(fetchCuisines());
    // }, [dispatch]);

    // useEffect(() => {
    //     if (categories) {
    //         const filtered = categories.filter(item =>
    //             item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //         setFilteredCategories(filtered);
    //     }
    // }, [searchTerm, categories]);

    // useEffect(() => {
    //     if (cuisines) {
    //         const filtered = cuisines.filter(item =>
    //             item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    //             item.description?.toLowerCase().includes(searchTerm.toLowerCase())
    //         );
    //         setFilteredCuisines(filtered);
    //     }
    // }, [searchTerm, cuisines]);

    // const handleTabChange = (key) => {
    //     setActiveTab(key);
    //     setSearchTerm(''); // Сбрасываем поиск при переключении вкладок
    // };

    // const renderContent = () => {
    //     if (loading) {
    //         return (
    //             <div className="loading-spinner">
    //                 <Spin size="large" />
    //             </div>
    //         );
    //     }

    //     const items = activeTab === 'categories' ? filteredCategories : filteredCuisines;
    //     const type = activeTab === 'categories' ? 'category' : 'cuisine';

    //     if (items.length === 0) {
    //         return (
    //             <div className="no-results">
    //                 <p>{activeTab === 'categories' ? 'Категории не найдены' : 'Кухни не найдены'}</p>
    //             </div>
    //         );
    //     }

    //     return (
    //         <div className="collections-grid">
    //             {items.map((item) => (
    //                 <Link to={`/more/${type}/${item.id}`} key={item.id} className="collection-card">
    //                     {/* <div className="collection-image">
    //                         {item.image ? (
    //                             <img src={item.image} alt={item.name} />
    //                         ) : (
    //                             <div className="image-placeholder">
    //                                 {item.name?.charAt(0).toUpperCase()}
    //                             </div>
    //                         )}
    //                     </div>
    //                     <div className="collection-info">
    //                         <h3>{item.name}</h3>
    //                         <p className="collection-description">
    //                             {item.description?.length > 100
    //                                 ? `${item.description.substring(0, 100)}...`
    //                                 : item.description}
    //                         </p>
    //                         <div className="collection-stats">
    //                             <span>{item._count?.recipes || 0} рецептов</span>
    //                         </div>
    //                     </div> */}
    //                     <div className="image-placeholder">
    //                         {item.name?.charAt(0).toUpperCase()}
    //                     </div>
    //                     <div className="collection-info">
    //                         <h3>{item.name}</h3>
    //                         <div className="collection-stats">
    //                             {/* <span>{item || 0} рецептов</span> */}
    //                         </div>
    //                     </div>
    //                 </Link>
    //             ))}
    //         </div>
    //     );
    // };

    // return (
    //     <>
    //         <div className="collections-page">
    //             <div className="collections-header">
    //                 <h1>Категории и кухни</h1>
    //                 <Search
    //                     placeholder={`Поиск ${activeTab === 'categories' ? 'категорий' : 'кухонь'}`}
    //                     allowClear
    //                     enterButton={<SearchOutlined />}
    //                     size="large"
    //                     value={searchTerm}
    //                     onChange={(e) => setSearchTerm(e.target.value)}
    //                     className="collections-search"
    //                 />
    //             </div>

    //             <Tabs defaultActiveKey="categories" onChange={handleTabChange} className="collections-tabs">
    //                 <TabPane tab="Категории" key="categories">
    //                     {renderContent()}
    //                 </TabPane>
    //                 <TabPane tab="Кухни" key="cuisines">
    //                     {renderContent()}
    //                 </TabPane>
    //             </Tabs>
    //         </div>
    //     </>
    // );

    const dispatch = useDispatch();
    const navigate = useNavigate()
    const { categories, cuisines, loading } = useSelector((state) => state.recipes);
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('categories');
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [filteredCuisines, setFilteredCuisines] = useState([]);

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchCuisines());
    }, [dispatch]);

    useEffect(() => {
        if (categories) {
            const filtered = searchTerm
                ? categories.filter(item =>
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : [...categories];
            setFilteredCategories(filtered);
        }
    }, [searchTerm, categories]);

    useEffect(() => {
        if (cuisines) {
            const filtered = searchTerm
                ? cuisines.filter(item =>
                    item.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    item.description?.toLowerCase().includes(searchTerm.toLowerCase())
                )
                : [...cuisines];
            setFilteredCuisines(filtered);
        }
    }, [searchTerm, cuisines]);

    const handleTabChange = (key) => {
        setActiveTab(key);
        setSearchTerm('');
    };

    const renderContent = () => {
        if (loading) {
            return (
                <div className="loading-spinner">
                    <Spin size="large" />
                </div>
            );
        }

        const items = activeTab === 'categories' ? filteredCategories : filteredCuisines;
        const type = activeTab === 'categories' ? 'category' : 'cuisine';

        if (!items || items.length === 0) {
            return (
                <div className="no-results">
                    <p>{activeTab === 'categories' ? 'Категории не найдены' : 'Кухни не найдены'}</p>
                </div>
            );
        }

        return (
            <div className="users-grid" style={{ marginTop: '20px' }}>

                {items.map((item) => (
                    <Link to={`/more/${type}/${item.id}`} key={item.id} className="user-card">
                        <div className="user-avatar" style={{
                            backgroundColor: `#${Math.floor(Math.random() * 16777215).toString(16)}`
                        }}>
                            {item.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="user-info">
                            <h3>{item.name}</h3>
                            <div className="user-stats">
                                <span>{item._count?.recipes || 0} рецептов</span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        );
    };

    return (
        <div className="users-page">
            <div className="users-header">
                <button className="back-button" onClick={() => navigate(-1)}>
                    &larr; Назад
                </button>
                <h1>Категории и кухни</h1>
                <Search
                    placeholder={`Поиск ${activeTab === 'categories' ? 'категорий' : 'кухонь'}`}
                    allowClear
                    enterButton={<SearchOutlined />}
                    size="large"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="users-search"
                />
            </div>

            <Tabs defaultActiveKey="categories" onChange={handleTabChange} style={{ marginTop: '20px' }}>
                <TabPane tab="Категории" key="categories">
                    {renderContent()}
                </TabPane>
                <TabPane tab="Кухни" key="cuisines">
                    {renderContent()}
                </TabPane>
            </Tabs>
        </div>
    );
};

export default CategoryCuisineListPage;