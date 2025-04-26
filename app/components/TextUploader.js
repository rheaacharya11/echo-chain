// components/TextUploader.js
'use client';

import { useState } from 'react';
import { getSignedContract } from '../utils/contract';
import { ethers } from 'ethers';

const TextUploader = ({ account }) => {
  const [formData, setFormData] = useState({
    title: '',
    author: '',
    year: '',
    genre: '',
    contentHash: '' // IPFS hash would be generated via a separate upload
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation checks
    if (!account) {
      setStatus({ type: 'error', message: 'Please connect your wallet first' });
      return;
    }

    if (!formData.title || !formData.author || !formData.contentHash) {
      setStatus({ type: 'error', message: 'Please fill in all required fields' });
      return;
    }

    try {
      setIsSubmitting(true);
      setStatus({ type: 'info', message: 'Preparing to add text to the repository...' });

      // Prepare metadata JSON
      const metadata = JSON.stringify({
        year: formData.year,
        genre: formData.genre
      });

      // Get a signer from the connected wallet
      const provider = new ethers.BrowserProvider(window.ethereum);
      let signer;
      try {
        signer = await provider.getSigner();
      } catch (err) {
        console.log("Could not get signer, using demo mode", err);
        signer = { address: account };
      }
      
      const contract = await getSignedContract(signer);

      // Send transaction to blockchain
      setStatus({
        type: 'info',
        message: 'Please confirm the transaction in your wallet...',
      });

      // Call the contract's addText function
      const tx = await contract.addText(
        formData.title,
        formData.author,
        metadata,
        formData.contentHash
      );

      setStatus({
        type: 'info',
        message: 'Transaction submitted. Waiting for confirmation...',
      });
      
      const receipt = await tx.wait();

      setStatus({
        type: 'success',
        message: `Text successfully added to the repository!`,
      });
      
      // Reset form
      setFormData({
        title: '',
        author: '',
        year: '',
        genre: '',
        contentHash: ''
      });
      
    } catch (err) {
      console.error('Error adding text:', err);

      if (err.code === 4001) {
        setStatus({ type: 'error', message: 'Transaction rejected by user.' });
      } else {
        setStatus({
          type: 'error',
          message: `Error: ${err.message || 'Failed to send transaction'}`,
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Simple IPFS hash generator simulation (for demo purposes)
  const generateIPFSHash = () => {
    const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = 'Qm';
    for (let i = 0; i < 44; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    setFormData(prev => ({ ...prev, contentHash: result }));
  };

  return (
    <div className="border border-indigo-500 rounded-lg p-4 shadow-md bg-white max-w-md mx-auto">
      <h2 className="text-lg font-bold text-indigo-700 mb-4">Upload Latin Text</h2>
      
      {status.message && (
        <div
          className={`p-2 rounded-md mb-4 text-sm ${
            status.type === 'error'
              ? 'bg-red-100 text-red-500'
              : status.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-blue-100 text-blue-700'
          }`}
        >
          {status.message}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="e.g., De Bello Gallico"
            disabled={isSubmitting || !account}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Author <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="author"
            value={formData.author}
            onChange={handleChange}
            placeholder="e.g., Julius Caesar"
            disabled={isSubmitting || !account}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Year
            </label>
            <input
              type="text"
              name="year"
              value={formData.year}
              onChange={handleChange}
              placeholder="e.g., 58-49 BCE"
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Genre
            </label>
            <input
              type="text"
              name="genre"
              value={formData.genre}
              onChange={handleChange}
              placeholder="e.g., History"
              disabled={isSubmitting || !account}
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            IPFS Content Hash <span className="text-red-500">*</span>
          </label>
          <div className="flex">
            <input
              type="text"
              name="contentHash"
              value={formData.contentHash}
              onChange={handleChange}
              placeholder="Qm..."
              disabled={isSubmitting || !account}
              className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <button
              type="button"
              onClick={generateIPFSHash}
              disabled={isSubmitting || !account}
              className="bg-gray-200 px-2 rounded-r-md border-t border-r border-b border-gray-300"
            >
              Demo
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            For this demo, you can generate a mock IPFS hash. In production, you would upload the text to IPFS first.
          </p>
        </div>
        
        <button
          type="submit"
          disabled={isSubmitting || !account}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 px-4 rounded-lg transition disabled:bg-gray-300"
        >
          {isSubmitting ? 'Uploading...' : 'Upload Text'}
        </button>
      </form>
      
      {!account && (
        <p className="text-sm text-gray-500 mt-3">
          Connect your wallet to upload Latin texts to the repository.
        </p>
      )}
    </div>
  );
};

export default TextUploader;