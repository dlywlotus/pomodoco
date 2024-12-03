import { useRef } from "react";
import Dashboard from "../components/Dashboard";
import { user } from "../pages/Main";
import { CSSTransition } from "react-transition-group";
import { week } from "../types";

type props = {
  user: user;
  setUser: React.Dispatch<React.SetStateAction<user>>;
  currentWeek: week;
  isShowDashboard: boolean;
  setIsShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  prevWeek: week;
  setCurrentWeek: React.Dispatch<React.SetStateAction<week>>;
  setPrevWeek: React.Dispatch<React.SetStateAction<week>>;
};

export default function DasboardSlideDown({
  user,
  setUser,
  currentWeek,
  isShowDashboard,
  setIsShowDashboard,
  prevWeek,
  setCurrentWeek,
  setPrevWeek,
}: props) {
  const modalRef = useRef(null);

  return (
    <CSSTransition
      in={isShowDashboard}
      timeout={300}
      classNames='slideDown'
      unmountOnExit
      nodeRef={modalRef}
    >
      <Dashboard
        user={user}
        setUser={setUser}
        currentWeek={currentWeek}
        setIsShowDashboard={setIsShowDashboard}
        prevWeek={prevWeek}
        ref={modalRef}
        setPrevWeek={setPrevWeek}
        setCurrentWeek={setCurrentWeek}
      />
    </CSSTransition>
  );
}
