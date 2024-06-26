import { Container } from "@mui/material";

const Footer: React.FC = () => {
  return (
    <footer className="fixed-bottom bg-primary text-light text-center py-2">
      <Container>
        <div className="d-flex  justify-content-between align-items-center px-4">
          <h4>Workspace </h4>
          <p>
            {" "}
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
};
export default Footer;
