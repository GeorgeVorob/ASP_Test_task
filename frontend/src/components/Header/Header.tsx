import { NavLink } from "react-router-dom";
import { Navbar, Nav } from "react-bootstrap";
import './Header.css'

const Header = () => {
    return (
        <>
            <header>
                <Navbar>
                    <Nav className="m-auto">
                        <Navbar.Brand>
                            <h1>Navbar</h1>
                        </Navbar.Brand>
                        <Nav.Link as={NavLink} to='' className="nav-element">
                            Проекты
                        </Nav.Link>
                    </Nav>
                </Navbar>
            </header>
        </>
    )
}

export default Header;