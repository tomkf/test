import React from "react";
import {
  FormGroup,
  ControlLabel,
  FormControl,
  Form,
  Button
} from "react-bootstrap";
import io from "socket.io-client";
import ChatTable from "./ChatTable.js";

// call with convertDate(new Date())
const convertDate = dateTarget => {
  const months = [
    "January",
    "Feubuary",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December"
  ];
  let formatted_date =
    dateTarget.getDate() +
    " " +
    months[dateTarget.getMonth()] +
    " " +
    dateTarget.getFullYear();
  return formatted_date;
};

class ChatComponent extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      messages: [],
      newMessage: {
        name: newName,
        email: newEmail,
        content: newContent,
        stamp: newStamp
      },
      newName: null,
      newEmail: null,
      newContent: null,
      newStamp: null
    };

    this.socket = io("http://localhost:3000");
    this.setNewMessage = this.setNewMessage.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  componentDidMount() {
    this.socket.on("chat", message => {
      message.key = JSON.stringify(message);
      this.setState(prevState => {
        let messages = prevState.messages;
        messages.push(message);
        {
          messages: messages;
        }
      });
    });
  }

  render() {
    return (
      <div>
        <h1>TESTING</h1>

        <Form inline onSubmit={this.handleSubmit}>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Your name</Form.Label>
            <Form.Control
              type="text"
              onChange={this.setNewName}
              value={this.state.newMessage.name}
              autoComplete="off"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlInput1">
            <Form.Label>Your email</Form.Label>
            <Form.Control
              type="text"
              onChange={this.setNewEmail}
              value={this.state.newMessage.email}
              placeholder="name@example.com"
            />
          </Form.Group>
          <Form.Group controlId="exampleForm.ControlTextarea1">
            <Form.Label>Your message</Form.Label>
            <Form.Control
              as="textarea"
              rows="3"
              onChange={this.setNewMessage}
              value={this.state.newMessage.content}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit comment
          </Button>
        </Form>

        <ChatTable messages={this.state.messages} />
      </div>
    );
  }

  componentWillUnmount() {
    this.socket.close();
  }

  setNewMessage(event) {
    this.setState({
      newContent: event.target.value,
      newStamp: convertDate(new Date())
    });
  }

  setNewName(event) {
    this.setState({
      newName: event.target.value
    });
  }

  setNewEmail(event) {
    this.setState({
      newEmail: event.target.value
    });
  }

  handleSubmit(event) {
    event.preventDefault();
    this.socket.emit("chat", {
      message: this.state.newMessage,
      timestamp: convertDate(new Date())
    });
    this.setState({
      newName: null,
      newEmail: null,
      newContent: null
    });
  }
}

export default ChatComponent;
