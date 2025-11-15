import './Header.css';
import {Group, Button, TextInput, Flex, Box, Burger, Menu, ActionIcon, Badge} from '@mantine/core';
import { IconSearch, IconUser, IconBookmark, IconSettings, IconPlus, IconHome, IconLogin, IconLogout, IconUserCheck } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useAuth } from './contexts/AuthContext';
import logo from './assets/logo.png';

function Header(){
    const headerRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);
    const [opened, { toggle, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 960px)');
    const { isAuthenticated, user, logout, loginAsTestUser } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    const handleLogout = () => {
        logout();
        close();
        navigate('/');
    };

    const handleTestLogin = () => {
        loginAsTestUser();
        close();
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            // TODO: Implement search functionality
            // navigate(`/explore?search=${encodeURIComponent(searchQuery)}`);
            console.log('Searching for:', searchQuery);
            navigate(`/explore`);
        }
    };

    useEffect(() => {
        const handleScroll = () => {
            if (!headerRef.current) return;
            if (window.scrollY > lastScrollY.current && window.scrollY > 60) {
                headerRef.current.style.transform = "translateY(-100%)";
            } else {
                headerRef.current.style.transform = "translateY(0)";
            }
            lastScrollY.current = window.scrollY;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return(
        <header className="header" ref={headerRef}>
            <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                <Group gap="md">
                    {isMobile ? (
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <ActionIcon variant="subtle" size="lg" aria-label="Home">
                                <IconHome size={24} />
                            </ActionIcon>
                        </Link>
                    ) : (
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <img src={logo} alt="HouseGig" style={{ height: '50px', width: 'auto' }} />
                        </Link>
                    )}
                </Group>
                <Box style={{ flex: 1, marginLeft: '1.5rem', marginRight: '1.5rem' }}>
                    <form onSubmit={handleSearch}>
                        <TextInput
                            placeholder="Search listings..."
                            leftSection={<IconSearch size={18} />}
                            size="md"
                            radius="md"
                            className="header-search"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </form>
                </Box>
                {isMobile ? (
                    <Menu opened={opened} onChange={toggle} position="bottom-end" offset={25} shadow="md">
                        <Menu.Target>
                            <Burger opened={opened} onClick={toggle} size="sm" aria-label="Menu" />
                        </Menu.Target>
                        <Menu.Dropdown>
                            {isAuthenticated ? (
                                <>
                                    <Menu.Label>{user?.username || 'My Account'}</Menu.Label>
                                    <Menu.Item 
                                        leftSection={<IconBookmark size={18} />}
                                        component={Link} 
                                        to="/collections"
                                        onClick={close}
                                    >
                                        Collections
                                    </Menu.Item>
                                    <Menu.Item 
                                        leftSection={<IconPlus size={18} />}
                                        component={Link} 
                                        to="/upload"
                                        onClick={close}
                                    >
                                        Upload
                                    </Menu.Item>
                                    <Menu.Item 
                                        leftSection={<IconSettings size={18} />}
                                        component={Link} 
                                        to="/settings"
                                        onClick={close}
                                    >
                                        Settings
                                    </Menu.Item>
                                    <Menu.Item 
                                        leftSection={<IconUser size={18} />}
                                        component={Link} 
                                        to="/profile"
                                        onClick={close}
                                    >
                                        Profile
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item 
                                        leftSection={<IconLogout size={18} />}
                                        color="red"
                                        onClick={handleLogout}
                                    >
                                        Logout
                                    </Menu.Item>
                                </>
                            ) : (
                                <>
                                    <Menu.Item 
                                        leftSection={<IconUserCheck size={18} />}
                                        onClick={handleTestLogin}
                                        style={{ color: 'rgba(31, 96, 3, 0.8)' }}
                                    >
                                        Test Login (Dev)
                                    </Menu.Item>
                                    <Menu.Divider />
                                    <Menu.Item 
                                        leftSection={<IconLogin size={18} />}
                                        component={Link} 
                                        to="/auth"
                                        onClick={close}
                                    >
                                        Login / Sign Up
                                    </Menu.Item>
                                </>
                            )}
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <Group gap={0} style={{ flex: 0.18, justifyContent: 'space-evenly' }}>
                        {isAuthenticated ? (
                            <>
                                <Link to="/collections">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Collections"
                                    >
                                        <IconBookmark size={22} />
                                    </Button>
                                </Link>
                                <Link to="/upload">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Add listing"
                                    >
                                        <IconPlus size={22} />
                                    </Button>
                                </Link>
                                <Link to="/settings">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Settings"
                                    >
                                        <IconSettings size={22} />
                                    </Button>
                                </Link>
                                <Menu position="bottom-end" offset={25} shadow="md">
                                    <Menu.Target>
                                        <Button
                                            variant="subtle"
                                            size="md"
                                            className="header-btn profile-btn"
                                            aria-label="Profile"
                                        >
                                            <IconUser size={22} />
                                        </Button>
                                    </Menu.Target>
                                    <Menu.Dropdown>
                                        <Menu.Label>{user?.username || 'My Account'}</Menu.Label>
                                        <Menu.Item 
                                            leftSection={<IconUser size={18} />}
                                            component={Link} 
                                            to="/profile"
                                        >
                                            View Profile
                                        </Menu.Item>
                                        <Menu.Divider />
                                        <Menu.Item 
                                            leftSection={<IconLogout size={18} />}
                                            color="red"
                                            onClick={handleLogout}
                                        >
                                            Logout
                                        </Menu.Item>
                                    </Menu.Dropdown>
                                </Menu>
                            </>
                        ) : (
                            <Group gap="xs">
                                <Button
                                    variant="light"
                                    size="sm"
                                    onClick={handleTestLogin}
                                    leftSection={<IconUserCheck size={18} />}
                                    style={{ backgroundColor: 'rgba(31, 96, 3, 0.8)', color: 'white' }}
                                >
                                    Test Login
                                </Button>
                                <Link to="/auth">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Login"
                                    >
                                        <IconLogin size={22} />
                                    </Button>
                                </Link>
                            </Group>
                        )}
                    </Group>
                )}
            </Flex>
        </header>
    );
}

export default Header;