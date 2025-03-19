import { useContext, useEffect, useState } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { UserContext } from "../App";
import UserNavigationPanel from "./UserNavigationPanel";
import axios from "axios";

const Navbar = () => {

    const [searchBoxVisibility, setSearchBoxVisibility] = useState(false);
    const [userNavPanel, setUserNavPanel] = useState(false);

    let navigate = useNavigate();

    const { userAuth, userAuth: { access_token, profile_img, new_notification_available }, setUserAuth } = useContext(UserContext);

    useEffect(() => {

        if (access_token) {
            axios.get(import.meta.env.VITE_SERVER_DOMAIN + "/api/notification/new", {
                headers: {
                    Authorization: `Bearer ${access_token}`
                }
            })
                .then(({ data }) => {
                    setUserAuth({ ...userAuth, ...data });
                })
                .catch(err => {
                    console.log(err);
                })
        }
    }, [access_token]);

    const handleUserNavPanel = () => {
        setUserNavPanel(currentVal => !currentVal);
    }

    const handleSearch = (e) => {
        let query = e.target.value;

        if (e.keyCode === 13 && query.length) {
            navigate(`/search/${query}`);
        }
    }

    const handleBlur = () => {
        setTimeout(() => {
            setUserNavPanel(false);
        }, 200);
    }

    return (
        <>
            <nav className="navbar z-50">
                <Link to="/" className="flex-none w-10">
                    <img src="/logo.png" alt="" className="w-full" />
                </Link>

                <div className={"absolute bg-white w-full left-0 top-full mt-0.5 border-b border-gray-200 py-4 px-[5vw] md:border-0 md:relative md:inset-0 md:p-0 md:w-auto " + (searchBoxVisibility ? "show" : "hidden md:block")}
                >
                    <input
                        type="text"
                        placeholder="Search"
                        className="w-full md:w-auto bg-gray-100 p-4 pl-6 pr-[12%] md:pr-6 rounded-full placeholder:text-dark-grey md:pl-12"
                        onKeyDown={handleSearch}
                    />
                    <i className="fi fi-rr-search absolute right-[10%] md:pointer-events-none md:left-5 top-1/2 -translate-y-1/2 text-xl text-dark-grey"></i>
                </div>

                <div className="flex items-center gap-3 md:gap-6 ml-auto">
                    <button className="md:hidden bg-gray-100 w-12 h-12 rounded-full flex items-center justify-center" onClick={() => setSearchBoxVisibility(!searchBoxVisibility)}>
                        <i className="fi fi-rr-search text-xl"></i>
                    </button>

                    <Link to="/editor" className="hidden md:flex items-center gap-2 text-gray-700 hover:text-black hover:bg-gray-200 p-3 px-4 rounded-lg transition">
                        <i className="fi fi-rr-file-edit"></i>
                        <p>Write</p>
                    </Link>

                    {
                        access_token ?
                            <>
                                <Link to="/dashboard/notifications">
                                    <button className="w-12 h-12 rounded-full bg-gray-200 relative hover:bg-black/10">
                                        <i className="fi fi-rr-bell text-2xl block mt-1"></i>
                                        {
                                            new_notification_available ?
                                                <span className="bg-red-500 w-3 h-3 rounded-full absolute z-10 top-2 right-2"></span>
                                                : ""
                                        }
                                    </button>
                                </Link>

                                <div className="relative" onClick={handleUserNavPanel} onBlur={handleBlur}>
                                    <button className="w-12 h-12 mt-1">
                                        <img src={profile_img} alt="" className="w-full h-full object-cover rounded-full" />
                                    </button>

                                    {
                                        userNavPanel ?
                                            <UserNavigationPanel />
                                            : null
                                    }
                                </div>
                            </>
                            :
                            <>
                                <Link className="bg-black text-white py-2 px-5 rounded-full hover:bg-gray-800 transition" to="/login">
                                    Login
                                </Link>
                                <Link className="bg-gray-200 text-gray-800 py-2 px-5 rounded-full hidden md:block hover:bg-gray-300 transition" to="/signup">
                                    Sign Up
                                </Link>
                            </>
                    }
                </div>
            </nav>

            <Outlet />
        </>
    )
}

export default Navbar;
