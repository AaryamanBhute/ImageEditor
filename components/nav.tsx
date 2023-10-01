import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode, faUser } from "@fortawesome/free-solid-svg-icons";
import '@/static/nav.css'

type NavItemProp = {
    title: string;
    page: string;
}

function NavItem(props : NavItemProp){
    return (
        <Link href={`/${props.title === "Home" ? '/' : props.title}`} className={props.page == props.title ? "selectedNavItem rounded-md px-3 py-2 text-base font-medium" : "unselectedNavItem rounded-md px-3 py-2 text-base font-medium"}
                    >{props.title}</Link >
        )
}

type NavProps = {
    page: string;
};

export default function Nav(props : NavProps){
    return (
      <nav className="bg-inherit z-40 absolute top-0 shadow">
        <div className="mx-auto w-screen px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between mt-3">
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <div className="hidden sm:block">
                <div className="flex space-x-4">
                  <NavItem title="Home" page={props.page}/>
                  <NavItem title="Dashboard" page={props.page}/>
                  <NavItem title="Files" page={props.page}/>
                  <NavItem title="Editor" page={props.page}/>
                  <NavItem title="Calender" page={props.page}/>
                </div>
              </div>
            </div>
            
              <div className="relative ml-3">
                <div>
                  <button type="button" className="relative flex justify-center content-center rounded-full bg-gray-800 text-sm" id="userButton" aria-expanded="false" aria-haspopup="true">
                    <div className="h-8 w-8 rounded-full">
                      <FontAwesomeIcon icon={faUser} className="userIcon text-white"/>
                    </div>
                  </button>
                </div>
              </div>
          </div>
        </div>

        <div className="sm:hidden" id="mobile-menu">
          <div className="space-y-1 px-2 pb-3 pt-2">
            <a href="#" className="bg-gray-900 text-white block rounded-md px-3 py-2 text-base font-medium" aria-current="page">Dashboard</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Team</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Projects</a>
            <a href="#" className="text-gray-300 hover:bg-gray-700 hover:text-white block rounded-md px-3 py-2 text-base font-medium">Calendar</a>
          </div>
        </div>
      </nav>
    )
}