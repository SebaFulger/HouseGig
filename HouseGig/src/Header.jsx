import './Header.css';
import {Group, Button, TextInput, Flex, Box, Burger, Menu, ActionIcon, Badge} from '@mantine/core';
import { IconSearch, IconUser, IconBookmark, IconSettings, IconPlus, IconHome, IconLogin, IconLogout, IconMessage, IconSparkles } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import { useAuth } from './contexts/AuthContext';
import AIAssistant from './components/AIAssistant';
import logo from './assets/logo.png';

function Header(){
    const headerRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);
    const [opened, { toggle, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 1200px)');
    const { isAuthenticated, user, logout } = useAuth();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');
    const [aiOpened, { open: openAI, close: closeAI }] = useDisclosure(false);

    const handleLogout = () => {
        logout();
        close();
        navigate('/');
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
        <>
        <header className="header" ref={headerRef}>
            <Flex justify="space-between" align="center" style={{ width: "100%" }}>
                <Group gap="md">
                    {isMobile ? (
                        <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                            <ActionIcon variant="subtle" size="lg" aria-label="Home" className="site-initials">
                                <span aria-hidden style={{ fontWeight: 700 }}>HG</span>
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
                            placeholder="Search designs..."
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
                                        leftSection={<IconMessage size={18} />}
                                        component={Link} 
                                        to="/messages"
                                        onClick={close}
                                    >
                                        Messages
                                    </Menu.Item>
                                    <Menu.Item 
                                        leftSection={<IconSparkles size={18} />}
                                        onClick={() => {
                                            close();
                                            openAI();
                                        }}
                                    >
                                        AI Assistant
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
                    <Group gap="xs" style={{ flexShrink: 0, justifyContent: 'flex-end' }}>
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
                                <Link to="/messages">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Messages"
                                    >
                                        <IconMessage size={22} />
                                    </Button>
                                </Link>
                                <Button
                                    variant="subtle"
                                    size="md"
                                    className="header-btn"
                                    aria-label="AI Assistant"
                                    onClick={openAI}
                                    style={{ color: '#9775fa' }}
                                >
                                    <IconSparkles size={22} />
                                </Button>
                                <Link to="/upload">
                                    <Button
                                        variant="subtle"
                                        size="md"
                                        className="header-btn"
                                        aria-label="Add design"
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
                        )}
                    </Group>
                )}
            </Flex>
        </header>
        <AIAssistant opened={aiOpened} onClose={closeAI} />
        </>
    );
}

export default Header;