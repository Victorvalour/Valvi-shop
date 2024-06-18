import { IconType } from "react-icons";

interface StatusProps {
  text: string;
  icon: IconType;
  bg: string;
  color: string;
}

const Status: React.FC<StatusProps> = ({ text, icon: Icon, bg, color }) => {
  return (
    <div className="h-full  flex justify-center items-center py-4">
      <div
        className={`
    ${bg}
    ${color}
  px-1 rounded flex items-center h-5 gap-1 justify-center 
    `}
      >
        {text} <Icon size={15} />
      </div>
    </div>
  );
};

export default Status;
