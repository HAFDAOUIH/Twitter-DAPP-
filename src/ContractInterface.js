import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import { Button, Form, ListGroup, Container, Row, Col, Spinner, Alert } from 'react-bootstrap';

// Replace with your contract ABI
const contractABI = [
    {
        "inputs": [
            { "internalType": "uint256", "name": "postId", "type": "uint256" },
            { "internalType": "string", "name": "newMessage", "type": "string" }
        ],
        "name": "editPost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "postId", "type": "uint256" },
            { "internalType": "bool", "name": "isLike", "type": "bool" }
        ],
        "name": "likePost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            { "indexed": true, "internalType": "address", "name": "author", "type": "address" },
            { "indexed": false, "internalType": "string", "name": "message", "type": "string" },
            { "indexed": true, "internalType": "uint256", "name": "postId", "type": "uint256" },
            { "indexed": false, "internalType": "uint256", "name": "timestamp", "type": "uint256" }
        ],
        "name": "NewPost",
        "type": "event"
    },
    {
        "inputs": [
            { "internalType": "string", "name": "_message", "type": "string" }
        ],
        "name": "publishPost",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getTotalPosts",
        "outputs": [
            { "internalType": "uint256", "name": "", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "inputs": [
            { "internalType": "uint256", "name": "postId", "type": "uint256" }
        ],
        "name": "getPost",
        "outputs": [
            { "internalType": "string", "name": "message", "type": "string" },
            { "internalType": "address", "name": "author", "type": "address" },
            { "internalType": "uint256", "name": "timestamp", "type": "uint256" },
            { "internalType": "uint256", "name": "lastModified", "type": "uint256" },
            { "internalType": "uint256", "name": "likes", "type": "uint256" },
            { "internalType": "uint256", "name": "dislikes", "type": "uint256" }
        ],
        "stateMutability": "view",
        "type": "function"
    }
];

const contractAddress = '0x69F63F6Cf2470d0D8012723D094e4773fC79aAdd'; // Replace with your contract address

const web3 = new Web3(window.ethereum);
let contract;

const ContractInterface = () => {
    const [account, setAccount] = useState(null);
    const [posts, setPosts] = useState([]);
    const [newPostMessage, setNewPostMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false); // For loading state
    const [errorMessage, setErrorMessage] = useState('');
    const [isError, setIsError] = useState(false);

    useEffect(() => {
        const initWeb3 = async () => {
            if (window.ethereum) {
                try {
                    // Request account access if it's not already granted
                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    // Listen for account changes and update the state accordingly
                    window.ethereum.on('accountsChanged', (accounts) => {
                        if (accounts.length > 0) {
                            setAccount(accounts[0]);  // Update account in the state
                        } else {
                            alert("Please connect a MetaMask account.");
                        }
                    });

                    const accounts = await web3.eth.getAccounts();
                    setAccount(accounts[0]);  // Set initial account

                    // Initialize the contract
                    contract = new web3.eth.Contract(contractABI, contractAddress);
                    console.log("Contract loaded:", contract);
                    loadPosts();
                } catch (error) {
                    console.error("Error initializing Web3 or contract:", error);
                    alert("Error connecting to MetaMask or loading the contract.");
                }
            } else {
                alert("MetaMask is not installed. Please install it to interact with the app.");
            }
        };

        initWeb3();
    }, []);

    const loadPosts = async () => {
        setIsLoading(true);
        try {
            const totalPosts = await contract.methods.getTotalPosts().call();
            const postsData = [];
            for (let i = 0; i < totalPosts; i++) {
                const post = await contract.methods.getPost(i).call();

                // Ensure BigInt values are converted to numbers or strings
                const postData = {
                    message: post.message,
                    author: post.author,
                    timestamp: Number(post.timestamp),  // Convert BigInt to number
                    lastModified: Number(post.lastModified),  // Convert BigInt to number
                    likes: Number(post.likes),  // Convert BigInt to number
                    dislikes: Number(post.dislikes)  // Convert BigInt to number
                };

                postsData.push(postData);
            }
            setPosts(postsData);  // Update the state with the posts
            setIsLoading(false);
        } catch (error) {
            setIsError(true);
            setErrorMessage('Error loading posts. Please try again.');
            setIsLoading(false);
        }
    };

    const publishPost = async () => {
        try {
            if (!contract) {
                console.error("Contract is not initialized yet.");
                alert("Contract not initialized. Please try again.");
                return;
            }

            if (newPostMessage) {
                console.log("Attempting to publish post...");
                const tx = await contract.methods.publishPost(newPostMessage)
                    .send({ from: account, gas: 3000000 });  // Set a gas limit
                console.log("Transaction hash:", tx.transactionHash);

                // Reload posts after publishing
                console.log("Post published successfully!");
                setNewPostMessage('');
                loadPosts();  // Refresh the posts list
            }
        } catch (error) {
            setIsError(true);
            setErrorMessage('Error publishing post. Please try again.');
        }
    };

    // Like Post
    const likePost = async (postId) => {
        try {
            // Check if the user is trying to like their own post
            const post = await contract.methods.getPost(postId).call();
            if (post.author.toLowerCase() === account.toLowerCase()) {
                alert("You cannot like your own post.");
                return;
            }

            console.log("Attempting to like the post...");
            await contract.methods.likePost(postId, true)
                .send({ from: account, gas: 3000000 });
            console.log("Post liked successfully!");
            loadPosts();  // Refresh the post list after liking
        } catch (error) {
            alert("Error liking post. Please try again.");
        }
    };

    // Dislike Post
    const dislikePost = async (postId) => {
        try {
            // Check if the user is trying to dislike their own post
            const post = await contract.methods.getPost(postId).call();
            if (post.author.toLowerCase() === account.toLowerCase()) {
                alert("You cannot dislike your own post.");
                return;
            }

            console.log("Attempting to dislike the post...");
            await contract.methods.likePost(postId, false)
                .send({ from: account, gas: 3000000 });
            console.log("Post disliked successfully!");
            loadPosts();  // Refresh the post list after disliking
        } catch (error) {
            alert("Error disliking post. Please try again.");
        }
    };

    return (
        <Container className="my-5">
            <h3>Mini Social</h3>
            <h4>Connected Account: {account}</h4>
            
            {/* Display Loading Spinner */}
            {isLoading && (
                <div className="text-center">
                    <Spinner animation="border" variant="primary" />
                </div>
            )}
            
            {/* Display Error Message */}
            {isError && (
                <Alert variant="danger" className="mt-3">
                    {errorMessage}
                </Alert>
            )}

            <Form.Control
                as="textarea"
                rows={3}
                value={newPostMessage}
                onChange={(e) => setNewPostMessage(e.target.value)}
                placeholder="Write your post here"
                className="mb-3"
            />
            <Button onClick={publishPost} variant="primary" className="mb-3">Publish Post</Button>

            <Row>
                <Col md={8}>
                    <h4>News Feed</h4>
                    <ListGroup className="mt-4">
                        {posts.map((post, index) => (
                            <ListGroup.Item key={index}>
                                <div className="card">
                                    <div className="card-body">
                                        <h5 className="card-title">{post.message}</h5>
                                        <small>By: {post.author} | {new Date(post.timestamp * 1000).toLocaleString()}</small>
                                        <div className="mt-2">
                                            <Button variant="success" onClick={() => likePost(index)} className="mr-2">
                                                Like ({post.likes})
                                            </Button>
                                            <Button variant="danger" onClick={() => dislikePost(index)}>
                                                Dislike ({post.dislikes})
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            </ListGroup.Item>
                        ))}
                    </ListGroup>
                </Col>
            </Row>
        </Container>
    );
};

export default ContractInterface;
