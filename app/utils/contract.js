import { Contract, JsonRpcProvider } from 'ethers';
import { ASSET_HUB_CONFIG } from './ethers';

// Contract address on Westend Asset Hub
export const CONTRACT_ADDRESS = '0xd611dbb2bbC718f349519BD483F81edF9441d41C';

// Contract ABI definition
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "annotationId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "textId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "scholar",
        "type": "address"
      }
    ],
    "name": "AnnotationAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "textId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "uploader",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "string",
        "name": "title",
        "type": "string"
      }
    ],
    "name": "TextAdded",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "uint256",
        "name": "textId",
        "type": "uint256"
      },
      {
        "indexed": true,
        "internalType": "address",
        "name": "verifier",
        "type": "address"
      }
    ],
    "name": "TextVerified",
    "type": "event"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_textId",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "_contentHash",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_annotationType",
        "type": "string"
      }
    ],
    "name": "addAnnotation",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "string",
        "name": "_title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_author",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_metadata",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "_contentHash",
        "type": "string"
      }
    ],
    "name": "addText",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "annotations",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "textId",
        "type": "uint256"
      },
      {
        "internalType": "address",
        "name": "scholar",
        "type": "address"
      },
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "annotationType",
        "type": "string"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_textId",
        "type": "uint256"
      }
    ],
    "name": "getTextAnnotations",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTextCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "owner",
    "outputs": [
      {
        "internalType": "address",
        "name": "",
        "type": "address"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_scholar",
        "type": "address"
      }
    ],
    "name": "getScholarAnnotations",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "_scholar",
        "type": "address"
      }
    ],
    "name": "getScholarTexts",
    "outputs": [
      {
        "internalType": "uint256[]",
        "name": "",
        "type": "uint256[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "name": "texts",
    "outputs": [
      {
        "internalType": "string",
        "name": "title",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "author",
        "type": "string"
      },
      {
        "internalType": "string",
        "name": "metadata",
        "type": "string"
      },
      {
        "internalType": "address",
        "name": "uploader",
        "type": "address"
      },
      {
        "internalType": "uint256",
        "name": "timestamp",
        "type": "uint256"
      },
      {
        "internalType": "string",
        "name": "contentHash",
        "type": "string"
      },
      {
        "internalType": "uint256",
        "name": "annotationCount",
        "type": "uint256"
      },
      {
        "internalType": "bool",
        "name": "verified",
        "type": "bool"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "_textId",
        "type": "uint256"
      }
    ],
    "name": "verifyText",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getAnnotationCount",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  }
];

// Define demo texts for fallback mode
export const DEMO_TEXTS = [
  {
    title: "De Bello Gallico",
    author: "Julius Caesar",
    uploader: "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
    timestamp: "2025-04-01",
    contentHash: "QmTX5NUWfW9ckLCjKuRZ9zYz4vYiaDN1MwMsE6vYmB1aeU",
    annotationCount: 7,
    verified: true
  },
  {
    title: "Aeneid",
    author: "Virgil",
    uploader: "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
    timestamp: "2025-03-15",
    contentHash: "QmZC8d5LAr3m9TEwSuTLY1WFZYBvhA9LjmBPL6CYbQUqbQ",
    annotationCount: 12,
    verified: true
  },
  {
    title: "Metamorphoses",
    author: "Ovid",
    uploader: "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
    timestamp: "2025-03-22",
    contentHash: "QmPL8nvCGvMsJtZFMuEKGpQ9YzQZwDmJpDCMQqTvDbG5xJ",
    annotationCount: 5,
    verified: false
  }
];

// For demo purposes, always use demo mode to avoid RPC connection issues
export const DEMO_MODE = true;

// Create a mock contract that matches the expected interface
const createDemoContract = () => {
  // Load any user-submitted texts from localStorage
  const getUserTexts = () => {
    if (typeof window === 'undefined') return [];
    
    try {
      const savedTexts = localStorage.getItem('userSubmittedTexts');
      return savedTexts ? JSON.parse(savedTexts) : [];
    } catch (e) {
      console.error('Error loading user texts from localStorage:', e);
      return [];
    }
  };
  
  // Save a new text to localStorage
  const saveUserText = (text) => {
    if (typeof window === 'undefined') return;
    
    try {
      const currentTexts = getUserTexts();
      localStorage.setItem('userSubmittedTexts', JSON.stringify([...currentTexts, text]));
    } catch (e) {
      console.error('Error saving user text to localStorage:', e);
    }
  };
  
  return {
    getTextCount: async () => {
      console.log("Demo mode: returning mock text count");
      const userTexts = getUserTexts();
      return DEMO_TEXTS.length + userTexts.length;
    },
    texts: async (id) => {
      console.log(`Demo mode: returning mock text ${id}`);
      const userTexts = getUserTexts();
      const allTexts = [...DEMO_TEXTS, ...userTexts];
      
      if (id >= 0 && id < allTexts.length) {
        return allTexts[id];
      }
      
      // Return a default text for out of range indices
      return {
        title: `Sample Text ${id}`,
        author: "Anonymous",
        uploader: "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
        timestamp: Date.now() / 1000,
        contentHash: `QmSample${id}`,
        annotationCount: 0,
        verified: false
      };
    },
    getTextAnnotations: async (textId) => {
      console.log(`Demo mode: returning mock annotations for text ${textId}`);
      return [0, 1, 2].slice(0, Math.floor(Math.random() * 4)); // Return 0-3 mock annotation IDs
    },
    getAnnotationCount: async () => {
      console.log("Demo mode: returning mock annotation count");
      return 24;
    },
    // Add method to directly access the user texts
    getUserSubmittedTexts: getUserTexts
  };
};

export const getContract = () => {
  console.log("Using demo contract mode");
  return createDemoContract();
};

export const getSignedContract = async (signer) => {
  console.log("Using demo signed contract mode");
  
  // Return a mock signed contract for demo mode
  return {
    addText: async (title, author, metadata, contentHash) => {
      console.log("Demo mode: simulating addText transaction", { title, author, metadata, contentHash });
      
      // Create a new text object
      const newText = {
        title,
        author,
        metadata,
        contentHash,
        uploader: signer?.address || "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
        timestamp: new Date().toLocaleDateString(),
        annotationCount: 0,
        verified: false,
        // Add sample text content based on the title
        sampleContent: `This is a sample of "${title}" by ${author}. This text was added by a user in demo mode.`
      };
      
      // Save the new text to localStorage
      try {
        if (typeof window !== 'undefined') {
          const currentTexts = localStorage.getItem('userSubmittedTexts');
          const texts = currentTexts ? JSON.parse(currentTexts) : [];
          texts.push(newText);
          localStorage.setItem('userSubmittedTexts', JSON.stringify(texts));
        }
      } catch (e) {
        console.error('Error saving text to localStorage:', e);
      }
      
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        wait: async () => {
          console.log("Demo mode: simulating transaction confirmation");
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { status: 1 };
        }
      };
    },
    addAnnotation: async (textId, contentHash, annotationType) => {
      console.log("Demo mode: simulating addAnnotation transaction", { textId, contentHash, annotationType });
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        wait: async () => {
          console.log("Demo mode: simulating transaction confirmation");
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { status: 1 };
        }
      };
    },
    verifyText: async (textId) => {
      console.log("Demo mode: simulating verifyText transaction", { textId });
      // Simulate transaction delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      return {
        wait: async () => {
          console.log("Demo mode: simulating transaction confirmation");
          await new Promise(resolve => setTimeout(resolve, 2000));
          return { status: 1 };
        }
      };
    }
  };
};