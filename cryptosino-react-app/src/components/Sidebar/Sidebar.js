import React, { useState } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import { SidebarData } from './SidebarData';
import SubMenu from './SubMenu';
import { IconContext } from 'react-icons/lib';
import { Button } from "../Button/Button"
import "./Navbar.css"

const Nav = styled.div`
  background: #15171c;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  postiion: fixed;

`;

const NavIcon = styled(Link)`
  margin-left: 2rem;
  font-size: 2rem;
  height: 80px;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  z-index: 998;
  postiion: sticky;
`;

const SidebarNav = styled.nav`
  background: #15171c;
  width: 250px;
  height: 100vh;
  display: flex;
  justify-content: center;
  position: fixed;
  top: 0;
  left: ${({ sidebar }) => (sidebar ? '0' : '-100%')};
  transition: 350ms;
  z-index: 998;
`;

const SidebarWrap = styled.div`
  width: 100%;
`;

const Sidebar = () => {
    const [sidebar, setSidebar] = useState(true);

    const showSidebar = () => setSidebar(!sidebar);

    return (
        <>
            <IconContext.Provider value={{ color: '#fff' }}>
                <Nav>
                    <NavIcon to='#'>
                        <FaIcons.FaBars onClick={showSidebar} />
                    </NavIcon>
                    <div className="navbar" >
                        <h3></h3>
                        <Link to="/" className="navbar-logo" >
                            CryptoSino
                        </Link>
                        <div className='nav-balance-indicator'>
                            <h1 className="nav-balance"> Balance:  Matic</h1>
                            <h1 className="nav-balance"> Winnings: Matic</h1>
                        </div>

                    </div>
                </Nav>
                <SidebarNav sidebar={sidebar}>
                    <SidebarWrap>
                        <NavIcon to='#'>
                            <AiIcons.AiOutlineClose onClick={showSidebar} />
                        </NavIcon>
                        {SidebarData.map((item, index) => {
                            return <SubMenu item={item} key={index} />;
                        })}
                        <div className="sidebar-footer">
                            <a href="https://twitter.com/cryptosinogg" target="_blank" class="fab fa-twitter"></a>
                            <a href="https://github.com/kribss/Cryptosino.GG" target="_blank" class="fab fa-github"></a>
                            <a href="https://t.me/cryptosinogg" target="_blank" class="fab fa-telegram"></a>
                            <a href="https://discord.gg/23NmmVeDvp" target="_blank" class="fab fa-discord"></a>

                        </div>

                    </SidebarWrap>

                </SidebarNav>

            </IconContext.Provider>

        </>
    );
};

export default Sidebar;
