import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import AddCandidateForm from "../components/candidates/AddCandidateForm";

const AddCandidatePage: React.FC = () => {
  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col lg={10}>
          <h2 className="mb-4">Add Candidate</h2>
          <AddCandidateForm />
        </Col>
      </Row>
    </Container>
  );
};

export default AddCandidatePage;
