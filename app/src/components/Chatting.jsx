import { useState, useEffect, useRef } from "react"
import { Avatar, Button, Col, Input, InputNumber, Row, Typography, notification } from "antd"
import Upload from "rc-upload"
import { Box, List, ListItem } from "@mui/material"
import { SendOutlined, UploadOutlined } from "@ant-design/icons"
import axios from "axios"
import { saveAs } from "file-saver"
import { MuiFileInput } from "mui-file-input"

const server = "http://localhost:5115"

export const Chatting = () => {
    const [chatList, setChatList] = useState([])
    const [encryptedAliceMessages, setEncryptedAliceMessages] = useState([])
    const [encryptedBobMessages, setEncryptedBobMessages] = useState([])
    const [aliceMessage, setAliceMessage] = useState("")
    const [bobMessage, setBobMessage] = useState("")
    const [aliceHasKeys, setAliceHasKeys] = useState(false)
    const [bobHasKeys, setBobHasKeys] = useState(false)
    const [aliceP, setAliceP] = useState(null)
    const [aliceQ, setAliceQ] = useState(null)
    const [bobP, setBobP] = useState(null)
    const [bobQ, setBobQ] = useState(null)
    const [fileSizeError, setFileSizeError] = useState(null)
    const [toDecrypt, setToDecrypt] = useState(null)

    const showNotification = (type) => {
        notification[type]({
            message: "File size too large!",
            description: "The current maximum supported file size is 200KB (Kilobytes)."
        })
    }

    useEffect(() => {
        if (fileSizeError) {
            showNotification("error")
            setFileSizeError(null)
        }
    }, [fileSizeError])

    const handleAliceMessageChange = (e) => {
        setAliceMessage(e.target.value)
    }

    const handleBobMessageChange = (e) => {
        setBobMessage(e.target.value)
    }

    const handleAliceSend = async () => {
        await axios.post(`${server}/encrypt/text/text`, {
            text: aliceMessage
        }, 
        {
            params: {
                pubKeyName: "bob.pub"
            }
        }).then(async (response) => {
            if (response.status == 200) {
                const newData = [...encryptedAliceMessages, {message: response.data.result}]
                setEncryptedAliceMessages(newData)

                await axios.post(`${server}/decrypt/text/text`, {
                    text: response.data.result
                },
                {
                    params: {
                        privKeyName: "bob.pri"
                    }
                }).then((response) => {
                    const newChatList = [...chatList, {message: response.data.result, sender: "Alice"}]
                    setChatList(newChatList)
                    setAliceMessage("")
                })
                
            }
        })
    }

    const handleBobSend = async () => {
        await axios.post(`${server}/encrypt/text/text`, {
            text: bobMessage
        }, 
        {
            params: {
                pubKeyName: "alice.pub"
            }
        }).then(async (response) => {
            if (response.status == 200) {
                const newData = [...encryptedBobMessages, {message: response.data.result}]
                setEncryptedBobMessages(newData)
                
                await axios.post(`${server}/decrypt/text/text`, {
                    text: response.data.result
                },
                {
                    params: {
                        privKeyName: "alice.pri"
                    }
                }).then((response) => {
                    const newChatList = [...chatList, {message: response.data.result, sender: "Bob"}]
                    setChatList(newChatList)
                    setBobMessage("")
                })
                
            }
        })
    }

    const handleAlicePChange = (value) => {
        setAliceP(value)
    }

    const handleAliceQChange = (value) => {
        setAliceQ(value)
    }

    const handleBobPChange = (value) => {
        setBobP(value)
    }

    const handleBobQChange = (value) => {
        setBobQ(value)
    }

    const handleAliceKeyGen = async () => {
        await axios.get(`${server}/keygen`, {
            params: {
                p: aliceP,
                q: aliceQ,
                name: "alice"
            }
        }).then((response) => {
            if (response.status == 200) {
                setAliceHasKeys(true)
            }
        })
    }

    const handleBobKeyGen = async () => {
        await axios.get(`${server}/keygen`, {
            params: {
                p: bobP,
                q: bobQ,
                name: "bob"
            }
        }).then((response) => {
            if (response.status == 200) {
                setBobHasKeys(true)
            }
        })
    }

    const aliceFileUpload = async (file) => {
        if (file.file.size > (200 * 1024)) {
            setFileSizeError(true)
            return
        }
        let formData = new FormData()
        formData.append("file", file.file)
        await axios.post(`${server}/encrypt/file`, formData,
        {
            params: {
                pubKeyName: "bob.pub"
            },
            responseType: "blob"
        }).then((response) => {
            if (response.status == 200) {
                saveAs(response.data, "encrypted_file")
            }
        })
    }

    const bobFileUpload = async (file) => {
        if (file.file.size > (200 * 1024)) {
            setFileSizeError(true)
            return
        }
        let formData = new FormData()
        formData.append("file", file.file)
        await axios.post(`${server}/encrypt/file`, formData,
        {
            params: {
                pubKeyName: "alice.pub"
            },
            responseType: "blob"
        }).then((response) => {
            if (response.status == 200) {
                saveAs(response.data, "encrypted_file")
            }
        })
    }

    const handleToDecrypt = (fileToDecrypt) => {
        setToDecrypt(fileToDecrypt)
    }

    const standaloneDecrypt = async (name) => {
        let formData = new FormData()
        formData.append("file", toDecrypt)
        await axios.post(`${server}/decrypt/file`, formData, {
            params: {
                privKeyName: name
            },
            responseType: "blob"
        }).then((response) => {
            if (response.status == 200) {
                saveAs(response.data, "decrypted_file")
                setToDecrypt(null)
            }
        })
    }

    const aliceChatRef = useRef(null)
    const bobChatRef = useRef(null)

    useEffect(() => {
        if (aliceChatRef.current) {
            aliceChatRef.current.scrollTop = aliceChatRef.current.scrollHeight
        }
        if (bobChatRef.current) {
            bobChatRef.current.scrollTop = bobChatRef.current.scrollHeight
        }
    }, [chatList])

    return (
        <div style={containerStyle}>
            <Row>
                <Col flex={50} style={keyControllerStyle}>
                    <InputNumber 
                        style={{width: "70%", fontSize: ".75vw"}} 
                        placeholder="Prime (p)"
                        value={aliceP}
                        onChange={handleAlicePChange}
                    ></InputNumber>
                    <InputNumber 
                        style={{width: "70%", fontSize: ".75vw"}} 
                        placeholder="Prime (q)"
                        value={aliceQ}
                        onChange={handleAliceQChange}
                    ></InputNumber>
                    <Button 
                        style={{width: "30%", fontSize: ".75vw", fontWeight: "bold", backgroundColor: "#549d9e"}}
                        onClick={handleAliceKeyGen}
                    >Generate Keys</Button>
                </Col>
                <Col flex={50} style={keyControllerStyle}>
                    <InputNumber 
                        style={{width: "70%", fontSize: ".75vw"}} 
                        placeholder="Prime (p)"
                        value={bobP}
                        onChange={handleBobPChange}
                    ></InputNumber>
                    <InputNumber 
                        style={{width: "70%", fontSize: ".75vw"}} 
                        placeholder="Prime (q)"
                        value={bobQ}
                        onChange={handleBobQChange}
                    ></InputNumber>
                    <Button 
                        style={{width: "30%", fontSize: ".75vw", fontWeight: "bold", backgroundColor: "#549d9e"}}
                        onClick={handleBobKeyGen}
                    >Generate Keys</Button>
                </Col>
            </Row>
            <Row >
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
            </Row>
            <Row style={rowStyle}>
                <Col style={chatWindowStyle}>
                    <Row style={chatFieldStyle} ref={aliceChatRef}>
                        <Col style={{width: "100%", height: "100%"}} >
                            <List>
                                {chatList.map((item, index) => (
                                    <ListItem key={index} style={{justifyContent: item.sender == "Alice" ? "end" : "start"}}>
                                        {/* <Typography.Text>{item}</Typography.Text> */}
                                        <Box sx={{
                                            borderRadius: 2, 
                                            backgroundColor: item.sender == "Alice" ? "#b4cf80" : "#bac96f",
                                            maxWidth: "45%",
                                            padding: "3.5%",
                                            justifyContent: "center"
                                            }}>
                                            <Typography.Text style={{justifyContent: "center", fontSize: "1.5vw"}}>{item.message.split("\n").map((line, index) => <div key={index}>{line}</div>)}</Typography.Text>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Col>
                    </Row>
                    <Row style={inputContainerStyle}>
                        <Col flex={2} style={{flex: 1, marginRight: "1%"}}>
                            <Upload
                                customRequest={aliceFileUpload}
                            >
                                <Button 
                                style={buttonStyle} 
                                shape="round" 
                                icon={<UploadOutlined 
                                style={{fontSize: "1.5vh"}} />}
                                disabled={(aliceHasKeys && bobHasKeys) ? false : true}
                            ></Button>
                            </Upload>
                        </Col>
                        <Col flex={96}>
                            <Input.TextArea 
                                autoSize={{maxRows: 5}} 
                                style={inputBoxStyle} 
                                variant="filled" 
                                placeholder="Type your message here"
                                value={aliceMessage}
                                onChange={handleAliceMessageChange}
                                disabled={(aliceHasKeys && bobHasKeys) ? false : true}
                            />
                        </Col>
                        <Col flex={2} style={{flex: 1, marginLeft: "1%"}}>
                            <Button 
                                style={buttonStyle} 
                                shape="round" 
                                icon={<SendOutlined style={{fontSize: "1.5vh"}} />}
                                onClick={handleAliceSend}
                                disabled={(aliceHasKeys && bobHasKeys) ? false : true}
                            ></Button>
                        </Col>
                    </Row>
                </Col>
                <Col style={chatWindowStyle}>
                    <Row style={chatFieldStyle} ref={bobChatRef}>
                        <Col style={{width: "100%", height: "100%"}}>
                            <List>
                                {chatList.map((item, index) => (
                                    <ListItem key={index} style={{justifyContent: item.sender == "Bob" ? "end": "start"}}>
                                        {/* <Typography.Text>{item}</Typography.Text> */}
                                        <Box sx={{
                                            borderRadius: 2, 
                                            backgroundColor: item.sender == "Bob" ? "#b4cf80" : "#bac96f",
                                            maxWidth: "45%",
                                            padding: "3.5%",
                                            justifyContent: "center"
                                            }}>
                                            <Typography.Text style={{justifyContent: "center", fontSize: "1.5vw"}}>{item.message.split("\n").map((line, index) => <div key={index}>{line}</div>)}</Typography.Text>
                                        </Box>
                                    </ListItem>
                                ))}
                            </List>
                        </Col>
                    </Row>
                    <Row style={inputContainerStyle}>
                        <Col flex={2} style={{flex: 1, marginRight: "1%"}}>
                            <Upload
                                customRequest={bobFileUpload}
                            >
                                <Button 
                                    style={buttonStyle} 
                                    shape="round" 
                                    icon={<UploadOutlined style={{fontSize: "1.5vh"}} />}
                                    disabled={(bobHasKeys && aliceHasKeys) ? false : true}
                                ></Button>
                            </Upload>
                        </Col>
                        <Col flex={96}>
                            <Input.TextArea 
                                autoSize={{maxRows: 5}} 
                                style={inputBoxStyle} 
                                variant="filled" 
                                placeholder="Type your message here"
                                value={bobMessage}
                                onChange={handleBobMessageChange}
                                disabled={(bobHasKeys && aliceHasKeys) ? false : true}
                            />
                        </Col>
                        <Col flex={2} style={{flex: 1, marginLeft: "1%"}}>
                            <Button 
                                style={buttonStyle} 
                                shape="round" 
                                icon={<SendOutlined style={{fontSize: "1.5vh"}} />}
                                onClick={handleBobSend}
                                disabled={(bobHasKeys && aliceHasKeys) ? false : true}
                            ></Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col style={monitorStyle}>
                    <List>
                        {encryptedBobMessages.map((item, index) => (
                            <ListItem key={index}>
                                <Typography.Text style={{color: "white", fontSize: "1vw"}}>{"from_bob: " + btoa(item.message)}</Typography.Text>
                                <Button 
                                    style={{margin: ".5%", fontSize: ".75vw", height: "10%", width: "fit-content"}}
                                    onClick={() => {
                                        saveAs(new Blob([item.message], {type: "plain/text"}), "encrypted")
                                    }}
                                >Save to File</Button>
                                <Button 
                                    tyle={{margin: ".5%", fontSize: ".75vw", height: "10%", width: "fit-content"}}
                                    onClick={async () => {
                                        await axios.post(`${server}/decrypt/text/file`, {
                                            text: item.message
                                        },
                                        {
                                            params: {
                                                privKeyName: "alice.pri"
                                            },
                                            responseType: "blob"
                                        }).then((response) => {
                                            if (response.status == 200) {
                                                saveAs(response.data, "decrypted")
                                            }
                                        })
                                    }}
                                >Decrypt and Save to File</Button>
                            </ListItem>
                        ))}
                    </List>
                </Col>
                <Col style={monitorStyle}>
                    <List>
                        {encryptedAliceMessages.map((item, index) => (
                            <ListItem key={index}>
                                <Typography.Text style={{color: "white", fontSize: "1vw"}}>{"from_alice: " + btoa(item.message)}</Typography.Text>
                                <Button 
                                    style={{margin: ".5%", fontSize: ".75vw", height: "10%", width: "fit-content"}}
                                    onClick={() => {
                                        saveAs(new Blob([item.message], {type: "plain/text"}), "encrypted")
                                    }}
                                >Save to File</Button>
                                <Button 
                                    tyle={{margin: ".5%", fontSize: ".75vw", height: "10%", width: "fit-content"}}
                                    onClick={async () => {
                                        await axios.post(`${server}/decrypt/text/file`, {
                                            text: item.message
                                        },
                                        {
                                            params: {
                                                privKeyName: "bob.pri"
                                            },
                                            responseType: "blob"
                                        }).then((response) => {
                                            if (response.status == 200) {
                                                saveAs(response.data, "decrypted")
                                            }
                                        })
                                    }}
                                >Decrypt and Save to File</Button>
                            </ListItem>
                        ))}
                    </List>
                </Col>
            </Row>
            <Row style={rowStyle}>
                <Col style={standaloneDecryptorStyle}>
                    <Typography.Title level={4} style={{fontSize: "1vw"}} >Standalone Decryptor</Typography.Title>
                    <Row style={{flexDirection: "row"}}>
                        <Col>
                            <MuiFileInput 
                                value={toDecrypt}
                                onChange={handleToDecrypt}
                                placeholder={"Insert File Here"}
                                style={{width: "20vw"}}
                            />
                        </Col>
                        <Col>
                            <Button 
                                style={{height: "100%"}}
                                onClick={() => standaloneDecrypt("alice.pri")}
                            >Decrypt</Button>
                        </Col>
                    </Row>
                </Col>
                <Col style={standaloneDecryptorStyle}>
                    <Typography.Title level={4} style={{fontSize: "1vw"}} >Standalone Decryptor</Typography.Title>
                    <Row style={{flexDirection: "row"}}>
                        <Col>
                            <MuiFileInput 
                                value={toDecrypt}
                                onChange={handleToDecrypt}
                                placeholder={"Insert File Here"}
                                style={{width: "20vw"}}
                            />
                        </Col>
                        <Col>
                            <Button 
                                style={{height: "100%"}}
                                onClick={() => standaloneDecrypt("bob.pri")}
                            >Decrypt</Button>
                        </Col>
                    </Row>
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

const keyControllerStyle = {
    backgroundColor: "black", 
    width: "45vw", 
    height: "10vh", 
    marginLeft: ".25vw", 
    marginRight: ".25vw",
    marginBottom: ".25vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
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
    fontSize: "1.5vw",
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
    maxHeight: "100%", 
    overflow: "auto"
}

const buttonStyle = {
    height: "100%",
    width: "100%",
}

const standaloneDecryptorStyle = {
    backgroundColor: "#ababab", 
    width: "45vw", 
    height: "10vh", 
    marginLeft: ".25vw", 
    marginRight: ".25vw",
    marginBottom: ".25vw",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
}