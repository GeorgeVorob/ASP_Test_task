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
                            <h3>Страницы:</h3>
                        </Navbar.Brand>
                        <Nav.Link as={NavLink} to='/projects' className="nav-element">
                            Проекты
                        </Nav.Link>
                        <Nav.Link as={NavLink} to='/workers' className="nav-element">
                            Сотрудники
                        </Nav.Link>
                    </Nav>
                </Navbar>
            </header>
        </>
    )
}

export default Header;