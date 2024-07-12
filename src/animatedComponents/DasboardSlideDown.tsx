import { useRef } from "react";
import Dashboard from "../components/Dashboard";
import { user } from "../pages/Main";
import { CSSTransition } from "react-transition-group";
import { week } from "../types";

type props = {
  user: user;
  currentWeek: week;
  isShowDashboard: boolean;
  setIsShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  prevWeek: week;
};

export default function DasboardSlideDown({
  user,
  currentWeek,
  isShowDashboard,
  setIsShowDashboard,
  prevWeek,
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
        currentWeek={currentWeek}
        setIsShowDashboard={setIsShowDashboard}
        prevWeek={prevWeek}
        ref={modalRef}
      />
    </CSSTransition>
  );
}
