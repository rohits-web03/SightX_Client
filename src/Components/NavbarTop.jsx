import { Component } from "react";
import "./NavbarTop.css";
import { MenuItems } from "./Menuitems";
// import {Link} from "react-router-dom";
class NavbarTop extends Component {
    state ={clicked: false};
    handleClick =() =>{
        this.setState({clicked: !this.state.clicked})
    }
    render(){
        return(
            <nav className="NavbarItems">

                <img className="nav-logo" src="/images/SightX.jpg" alt="SightX Logo"/>
                                       
                <div className="menu-icons" onClick={this.handleClick} >
                    <i className={this.state.clicked ? "fas fa-times" : "fas fa-bars" }></i>
                </div>

                <ul className={this.state.clicked ? "nav-menu active" : "nav-menu "}>
                    {MenuItems.map((item,index) =>{
                        return(
                            <li key={index}>
                                <a className={item.cName} href={item.url}> 
                                <i className={item.icon}></i>{item.title} 
                                </a>
                            </li>
                        );
                    }
                    )}
                
                </ul>

            </nav>



        );
    }
}


export default NavbarTop;