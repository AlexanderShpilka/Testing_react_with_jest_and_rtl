import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';

const ToppingOption = ({ name, imagePath, updateItemCount }) => {
  return (
    <Col xs={12} sm={6} md={4} lg={3} style={{ textAlign: 'center' }}>
      <img
        src={`http://localhost:3030/${imagePath}`}
        alt={`${name} topping`}
        style={{ width: '75%' }}
      />
      <Form.Group controlId={`${name}-topping-checkbox`}>
        <Form.Check
          type='checkbox'
          onChange={(event) => updateItemCount(name, event.target.checked ? 1 : 0)}
          label={name}
        />
      </Form.Group>
    </Col>
  );
};

export default ToppingOption;
