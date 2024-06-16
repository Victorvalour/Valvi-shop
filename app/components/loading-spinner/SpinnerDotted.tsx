import { ThreeCircles } from "react-loader-spinner";

const DottedLoadingSpinner = () => {
  return (
    <div className="h-screen w-screen inset-0 flex justify-center items-center">
      <ThreeCircles
        visible={true}
        height="100"
        width="100"
        color="#03d3fc"
        ariaLabel="three-circles-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
};

export default DottedLoadingSpinner;
