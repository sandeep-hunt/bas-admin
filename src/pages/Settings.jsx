import React, { useState } from 'react';
import Header from '../components/Header';
import { Container } from 'react-bootstrap';
import Breadcrumbs from '../components/Breadcrumbs';
import ProfileEdit from '../components/ProfileEdit';
import ChangePassword from '../components/ChangePassword';
import SiteSetting from '../components/SiteSetting';
import { Helmet } from 'react-helmet';

export default function Settings() {
    const [displayBlock, setDisplayBlock] = useState("profileEdit");

    return (
        <React.Fragment>
            <Helmet>
                <title>Settings</title>
            </Helmet>
            <Header />
            <Container>
                <div className="wrapper">
                    <div className="d-flex justify-content-between align-items-center">
                        <div className="wrapper-left">
                            <h4>Settings</h4>
                        </div>
                        <div className="d-flex justify-content-center align-items-center">
                            <Breadcrumbs pageName="settings" />
                        </div>
                    </div>


                    <div className=' w-full pt-4  p-8 overflow-x-auto'>

                        <div className="flex gap-4 my-3 border-b border-gray-200 pb-2">
                            <div
                                className={`pb-2 cursor-pointer transition-colors duration-300 ${displayBlock === "profileEdit"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                                onClick={() => setDisplayBlock("profileEdit")}
                            >
                                Profile Edit
                            </div>
                            <div
                                className={`pb-2 cursor-pointer transition-colors duration-300 ${displayBlock === "changePassword"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                                onClick={() => setDisplayBlock("changePassword")}
                            >
                                Change Password
                            </div>
                            <div
                                className={`pb-2 cursor-pointer transition-colors duration-300 ${displayBlock === "siteSetting"
                                        ? "text-blue-600 border-b-2 border-blue-600"
                                        : "text-gray-600 hover:text-blue-600"
                                    }`}
                                onClick={() => setDisplayBlock("siteSetting")}
                            >
                                Site Settings
                            </div>
                        </div>

                        <div className="mt-4">
                            {displayBlock === "profileEdit" && <ProfileEdit />}
                            {displayBlock === "changePassword" && <ChangePassword />}
                            {displayBlock === "siteSetting" && <SiteSetting />}
                        </div>
                    </div>
                </div>
            </Container>
        </React.Fragment>
    );
}
