import './Header.css';
import {Group, Button, TextInput, Flex, Box} from '@mantine/core';
import { IconSearch, IconUser, IconBookmark, IconSettings, IconPlus } from '@tabler/icons-react';
import { Link, useNavigate } from "react-router-dom";
import { useRef, useEffect } from "react";
import logo from '../assets/logo.png';

function Header(){
    const headerRef = useRef(null);
    const lastScrollY = useRef(window.scrollY);

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
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="HouseGig" style={{ height: '50px', width: 'auto' }} />
                    </Link>
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
                <Button
                    variant="subtle"
                    size="md"
                    className="header-btn"
                    aria-label="Add listing"
                >
                    <IconPlus size={22} />
                </Button>
                <Group gap="xs">
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
                    <Link to="/dashboard">
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
                            className="header-btn"
                            aria-label="Profile"
                        >
                            <IconUser size={22} />
                        </Button>
                    </Link>
                </Group>
            </Flex>
        </header>
    );
}

export default Header;