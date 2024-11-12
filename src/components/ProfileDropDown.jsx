import React from 'react'
import { Link } from 'react-router-dom'

 const ProfileDropDown = () =>{

    const userData = JSON.parse( localStorage.getItem('userData'));
    const profile_name = userData?.user_name?.split("");

    const handleLogout = () => {

        window.localStorage.clear();
        setTimeout(() => {
          window.location.href = '/';
         },0);
      };


  return (
    <div className=" min-w-xs min-w-[300px] overflow-hidden rounded border bg-[#FFFFFF] shadow-lg">
        <div className="  px-4 py-2  flex items-center gap-2 ">
            <div className=' relative p-1 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full bg-[#007bff]  text-[#FFFFFF] text-lg font-medium leading-4 text-center flex justify-center items-center'>
                <p className='-mt-1 uppercase'>{profile_name[0]}</p>
            </div>
            <div className='flex flex-col '>
                <div className='block text-sm font-bold leading-4 break-all'>{userData?.user_name}</div>
                <div className=" block text-sm font-medium leading-4 break-all ">{userData?.email}</div>
            </div>
        </div>
      <hr />
      <div>
        <Link
          to="/settings"
          className="block cursor-pointer p-2 text-sm font-normal hover:font-medium  transition duration-150 ease-in-out hover:bg-gray-100 "
        >
          Setting
        </Link>

        <div
          className=" block cursor-pointer  p-2 text-sm font-normal hover:font-medium transition duration-150 ease-in-out hover:bg-gray-100 "
          onClick={handleLogout}
        >
          Logout
        </div>
      </div>
    </div>
  )
}

export default ProfileDropDown;
