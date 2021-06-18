import React from 'react';
import "react-icons"
import * as FaIcons from 'react-icons/fa';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';
import * as RiIcons from 'react-icons/ri';
import { Link } from "react-router-dom";

export const SidebarData = [

    {
        title: 'Back',
        icon: <AiIcons.AiOutlineRollback />,
        path: '/casino'

    },

    {
        title: 'About',
        icon: <AiIcons.AiFillHome />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,


        subNav: [
            {
                title: 'LitePaper',
                path: '/Litepaper',
                icon: <IoIcons.IoIosPaper />
            },
        ]
    },
    {
        title: 'Reports',
        icon: <IoIcons.IoIosPaper />,
        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav: [
            {
                title: 'RugDoc',
                path: '/rugdoc',
                icon: <IoIcons.IoIosPaper />,
                cName: 'sub-nav'
            },
            {
                title: 'Github',
                path: '/messages/message1',
                icon: <IoIcons.IoIosPaper />
            },
            {
                title: 'Contracts',
                path: '/twitter',
                icon: <IoIcons.IoIosPaper />
            }
        ]
    },

    {
        title: 'Team',
        path: '/team',
        icon: <IoIcons.IoMdPeople />
    },
    {
        title: 'Support',
        icon: <IoIcons.IoMdHelpCircle />,

        iconClosed: <RiIcons.RiArrowDownSFill />,
        iconOpened: <RiIcons.RiArrowUpSFill />,

        subNav:
            [
                {

                    title: <Link className="sidebar-links" onClick={() => {
                        window.open('https://twitter.com/CryptosinoGG');
                    }} > Twitter</Link>,
                    icon: <IoIcons.IoIosPaper onClick={() => {
                        window.open('https://twitter.com/CryptosinoGG');
                    }} />
                },
                {

                    title: <Link className="sidebar-links" onClick={() => {
                        window.open('https://twitter.com/CryptosinoGG');
                    }} > Email</Link>,
                    icon: <IoIcons.IoIosPaper onClick={() => {
                        window.open('https://twitter.com/CryptosinoGG');
                    }} />
                },
            ]
    },
    {
        title: 'Withdraw Winnings',
        icon: <FaIcons.FaEthereum />,
        path: '/withdraw'

    },


];
