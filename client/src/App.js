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

function App() {
  const initialState = {
    title: "",
    subtitle: "",
    files: [],
    isUploading: false,
    alertIsOpen: false,
    msg: null,
    error: false
  };
  const [appState, setAppState] = useState(initialState);

  const onDrop = acceptedFiles => {
    setAppState({
      ...appState,
      files: acceptedFiles
    });
  };

  const handleChange = e => {
    setAppState({
      ...appState,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = e => {
    e.preventDefault();
    setAppState({
      ...appState,
      isUploading: true
    })
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
          isUploading: false,
          alertIsOpen: true,
          msg: res.data.msg
        });
        setTimeout(() => {
          setAppState(initialState);
        }, 5000);
      })
      .catch(err => {
        setAppState({
          ...appState,
          isUploading: false,
          alertIsOpen: true,
          msg: err.response.data.msg,
          error: true
        });
        setTimeout(() => {
          setAppState({
            ...appState,
            alertIsOpen: false,
            msg: null
          });
        }, 5000);
      });
  };

  return (
    <div className="App">
      <h1>Image Brander</h1>
      <Container>
        {appState.isUploading ? (
          <>
            <p>Uploading images. Please wait...</p>
            <Spinner color="primary" />
          </>
        ) : null}
        <Alert
          isOpen={appState.alertIsOpen}
          color={appState.error ? "danger" : "success"}
        >
          {appState.msg}
        </Alert>
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            id="title"
            name="title"
            value={appState.title}
            onChange={handleChange}
          />
        </FormGroup>
        <FormGroup>
          <Label for="subtitle">Subtitle</Label>
          <Input
            id="subtitle"
            name="subtitle"
            value={appState.subtitle}
            onChange={handleChange}
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
        <Button onClick={handleSubmit}>Post</Button>
      </Container>
    </div>
  );
}

export default App;