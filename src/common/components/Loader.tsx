import Spinner from "react-bootstrap/Spinner";

const Loader = () => {
  return (
    <div className="spinner-container">
      <Spinner className="m-auto" animation="border" />
    </div>
  );
};

export default Loader;
