import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCode } from "@fortawesome/free-solid-svg-icons";
import '@/static/nav.css'

type NavItemProp = {
    title: string;
    page: string;
}

function NavItem(props : NavItemProp){
    return (
        <Link href={`/${props.title}`} className={props.page == props.title ? "selectedNavItem rounded-md px-3 py-2 text-base font-medium" : "unselectedNavItem rounded-md px-3 py-2 text-base font-medium"}
                    >{props.title}</Link >
        )
}

type NavProps = {
    page: string;
};

export default function Nav(props : NavProps){
    return (
      <nav className="bg-inherit">
        <div className="mx-auto w-screen px-2 sm:px-6 lg:px-8">
          <div className="relative flex h-16 items-center justify-between mt-3">
            <div className="flex flex-1 items-center justify-center sm:justify-start">
              <Link href="/">
                <div className="flex flex-shrink-0 items-center">
                  <FontAwesomeIcon icon={faFileCode} color="white" size={"2x"} className="navIcon"/>
                </div>
              </Link>
              
              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  <NavItem title="Dashboard" page={props.page}/>
                  <NavItem title="Team" page={props.page}/>
                  <NavItem title="Projects" page={props.page}/>
                  <NavItem title="Calender" page={props.page}/>
                </div>
              </div>
            </div>
            <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
              <button type="button" className="relative rounded-full p-1 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800">
                <span className="absolute -inset-1.5"></span>
                <span className="sr-only">View notifications</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
                </svg>
              </button>


              <div className="relative ml-3">
                <div>
                  <button type="button" className="relative flex rounded-full bg-gray-800 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                    <span className="absolute -inset-1.5"></span>
                    <span className="sr-only">Open user menu</span>
                    <img className="h-8 w-8 rounded-full" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt=""/>
                  </button>
                </div>
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