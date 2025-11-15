import './Header.css';
import {Group, Button, TextInput, Flex, Box, Burger, Menu, ActionIcon} from '@mantine/core';
import { IconSearch, IconUser, IconBookmark, IconSettings, IconPlus, IconHome } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { useDisclosure, useMediaQuery } from '@mantine/hooks';
import logo from './assets/logo.png';

function Header(){
    const headerRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);
    const [opened, { toggle, close }] = useDisclosure(false);
    const isMobile = useMediaQuery('(max-width: 960px)');

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
                    <TextInput
                        placeholder="Search listings..."
                        leftSection={<IconSearch size={18} />}
                        size="md"
                        radius="md"
                        className="header-search"
                    />
                </Box>
                {isMobile ? (
                    <Menu opened={opened} onChange={toggle} position="bottom-end" shadow="md">
                        <Menu.Target>
                            <Burger opened={opened} onClick={toggle} size="sm" aria-label="Menu" />
                        </Menu.Target>
                        <Menu.Dropdown>
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
                        </Menu.Dropdown>
                    </Menu>
                ) : (
                    <Group gap={0} style={{ flex: 0.18, justifyContent: 'space-evenly' }}>
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
                                aria-label="Dashboard"
                            >
                                <IconSettings size={22} />
                            </Button>
                        </Link>
                        <Link to="/profile">
                            <Button
                                variant="subtle"
                                size="md"
                                className="header-btn profile-btn"
                                aria-label="Profile"
                            >
                                <IconUser size={22} />
                            </Button>
                        </Link>
                    </Group>
                )}
            </Flex>
        </header>
    );
}

export default Header;