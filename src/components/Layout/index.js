import React from 'react';
import Header from '../Header';
import MenuHeader from '../MenuHeader';

const Layout = (props) => {
    return (
        <div>
            <Header />
            <MenuHeader />
            {props.children}
        </div>
    );
}

export default Layout;
