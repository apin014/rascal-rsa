// import { useState } from "react"
import { Avatar, Button, Col, Input, Row, Typography, Upload } from "antd"
import { SendOutlined, UploadOutlined } from "@ant-design/icons"

export const Chatting = () => {
    
    return (
        <div style={containerStyle}>
            <Row >
                <Col flex={50} style={chatHeaderStyle}>
                    <Row style={chatHeaderContainerStyle}>
                        <Col flex={5} style={avatarContainerStyle}>
                            <Avatar style={avatarStyle}>A</Avatar>
                        </Col>
                        <Col flex={95}>
                            <Typography style={nameStyle}>Alice</Typography>
                        </Col>
                    </Row>
                </Col>
                <Col flex={50} style={chatHeaderStyle}>
                    <Row style={chatHeaderContainerStyle}>
                        <Col flex={5} style={avatarContainerStyle}>
                            <Avatar style={avatarStyle}>B</Avatar>
                        </Col>
                        <Col flex={95}>
                            <Typography style={nameStyle}>Bob</Typography>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col style={chatWindowStyle}>
                    <Row style={chatFieldStyle}>
                        <Col>
                        </Col>
                    </Row>
                    <Row style={inputContainerStyle}>
                        <Col flex={2} style={{flex: 1, marginRight: "1%"}}>
                            <Upload>
                                <Button style={buttonStyle} shape="round" icon={<UploadOutlined style={{fontSize: "1.5vh"}} />}></Button>
                            </Upload>
                        </Col>
                        <Col flex={96}>
                            <Input.TextArea autoSize={{maxRows: 5}} style={inputBoxStyle} variant="filled"/>
                        </Col>
                        <Col flex={2} style={{flex: 1, marginLeft: "1%"}}>
                            <Button style={buttonStyle} shape="round" icon={<SendOutlined style={{fontSize: "1.5vh"}}/>}></Button>
                        </Col>
                    </Row>
                </Col>
                <Col style={chatWindowStyle}>
                    <Row style={chatFieldStyle}>
                        <Col>
                        </Col>
                    </Row>
                    <Row style={inputContainerStyle}>
                        <Col flex={2} style={{flex: 1, marginRight: "1%"}}>
                            <Upload>
                                <Button style={buttonStyle} shape="round" icon={<UploadOutlined style={{fontSize: "1.5vh"}} />}></Button>
                            </Upload>
                        </Col>
                        <Col flex={96}>
                            <Input.TextArea autoSize={{maxRows: 5}} style={inputBoxStyle} variant="filled"/>
                        </Col>
                        <Col flex={2} style={{flex: 1, marginLeft: "1%"}}>
                            <Button style={buttonStyle} shape="round" icon={<SendOutlined style={{fontSize: "1.5vh"}}/>}></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col style={monitorStyle}>
                    Monitor1
                </Col>
                <Col style={monitorStyle}>
                    Monitor2
                </Col>
            </Row>
        </div>
    )
}

const containerStyle = {
    width: "100vw", 
    height: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    flexDirection: "column"
}

const rowStyle = {
    margin: ".25vh"
}

const chatHeaderStyle = {
    backgroundColor: "#8ab086", 
    width: "45vw", 
    height: "5vh", 
    marginLeft: ".25vw", 
    marginRight: ".25vw",
    display: "flex",
}

const chatHeaderContainerStyle = {
    width: "100%", 
    height: "100%", 
    alignItems: "center", 
    display: "flex", 
    justifyContent: "flex-start"
}

const avatarStyle = {
    height: "4.25vh", 
    width: "4.25vh",
    fontSize: "1.75vw",
}

const avatarContainerStyle = {
    marginLeft: "2%",
    marginRight: "0%"
}

const nameStyle = {
    fontSize: "1.25vw",
    fontWeight: "bold",
    marginRight: "2%"
}

const chatWindowStyle = {
    backgroundColor: "#e9fac0", 
    width: "45vw", 
    height: "50vh", 
    marginLeft: ".25vw", 
    marginRight: ".25vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    flexDirection: "column"
}

const monitorStyle = {
    backgroundColor: "black", 
    width: "45vw", 
    height: "20vh", 
    marginLeft: ".25vw", 
    marginRight: ".25vw"
}

const inputBoxStyle = {
    backgroundColor: "white",
    width: "100%",
    height: "100%"
}

const inputContainerStyle = {
    width: "100%",
    margin: "2%",
    height: "fit-content",
    display: "flex",
    alignItems: "flex-end"
}

const chatFieldStyle = {
    width: "100%",
    margin: "1%",
    height: "100%",
    display: "flex",
    backgroundColor: "red"
}

const buttonStyle = {
    height: "100%",
    width: "100%",
}