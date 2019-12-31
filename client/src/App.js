import React, { useState } from "react";
import {
  Button,
  FormGroup,
  Label,
  Input,
  Container,
  Spinner,
  Alert
} from "reactstrap";
import Dropzone from "react-dropzone";
import axios from "axios";
import "./App.scss";

import { Transition } from "react-spring/renderprops";

import FileList from "./components/FileList";

function App() {
  const initialState = {
    title: "",
    subtitle: "",
    files: [],
    isUploading: false
  };
  const [appState, setAppState] = useState(initialState);
  const [alerts, setAlerts] = useState({
    error: false,
    msg: null,
    alertIsOpen: false
  });

  const [timer, setTimer] = useState(null);

  const onDrop = acceptedFiles => {
    Array.from(acceptedFiles).map(i => {
      if (!/image\//g.test(i.type)) {
        setAlerts({
          error: true,
          msg: "You selected file(s) that are not images.",
          alertIsOpen: true
        });
        removeAlert();
      } else {
        setAppState({
          ...appState,
          files: [...appState.files, ...acceptedFiles]
        });
      }
    });
  };

  const handleChange = e => {
    setAppState({
      ...appState,
      [e.target.id]: e.target.value
    });
  };

  const removeAlert = () => {
    if (timer) {
      clearTimeout(timer);
    }
    var id = setTimeout(() => {
      setAlerts({
        error: false,
        msg: null,
        alertIsOpen: false
      });
    }, 3000);
    setTimer(id);
  };

  const handleSubmit = e => {
    e.preventDefault();
    if (!appState.title) {
      setAlerts({
        error: true,
        alertIsOpen: true,
        msg: "Please provide a title"
      });
      removeAlert();
      return;
    }
    setAppState({
      ...appState,
      isUploading: true
    });
    const fd = new FormData();
    fd.append("title", appState.title);
    fd.append("subtitle", appState.subtitle);
    Array.from(appState.files).forEach(file => {
      fd.append("file", file);
    });
    axios
      .post("http://localhost:5000/upload", fd, {
        "Content-Type": "multipart/form-data"
      })
      .then(res => {
        setAppState({
          ...initialState,
          isUploading: false
        });
        setAlerts({
          alertIsOpen: true,
          msg: res.data.msg,
          files: []
        });
        removeAlert();
      })
      .catch(err => {
        setAlerts({
          alertIsOpen: true,
          msg: err.response.data.msg,
          error: true
        });
        setAppState({
          ...appState,
          isUploading: false
        });
        removeAlert();
      });
  };

  const removeItem = e => {
    const newArr = appState.files.filter(i => {
      return i.name !== e.target.id;
    });
    setAppState({
      ...appState,
      files: newArr
    });
  };

  return (
    <div className="App">
      <h1>Image Brander</h1>
      <Container>
        <Transition
          items={appState.isUploading}
          from={{ opacity: 0 }}
          enter={{ opacity: 1 }}
          leave={{ opacity: 0 }}
        >
          {show =>
            show &&
            (aniProps => (
              <div
                style={aniProps}
                className="bg-info rounded text-white text-center p-4 mb-2"
              >
                <Spinner color="white" />
                <p className="m-0">Uploading images. Please wait...</p>
              </div>
            ))
          }
        </Transition>
        <Alert
          isOpen={alerts.alertIsOpen}
          color={alerts.error ? "danger" : "success"}
        >
          {alerts.msg}
        </Alert>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={appState.title}
            onChange={handleChange}
            maxLength={20}
          />
        </FormGroup>
        <FormGroup>
          <Label for="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={appState.subtitle}
            onChange={handleChange}
            maxLength={50}
          />
        </FormGroup>

        <Dropzone onDrop={onDrop}>
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              style={{
                border: "1px dashed grey",
                color: "grey",
                height: "7rem",
                borderRadius: ".25rem",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: "pointer"
              }}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <p className="mb-0">Drop files here</p>
              ) : (
                <p className="mb-0">Drop files or click here to upload</p>
              )}
            </div>
          )}
        </Dropzone>
        <FileList files={appState.files} removeItem={removeItem} />
        <Button
          onClick={handleSubmit}
          className="mt-2"
          disabled={appState.files.length === 0 ? true : false}
        >
          Post
        </Button>
      </Container>
    </div>
  );
}

export default App;
