// app/page.js
'use client';

import { useState, useEffect } from 'react';
import WalletConnect from './components/WalletConnect';
import TextBrowser from './components/TextBrowser';
import TextUploader from './components/TextUploader';
import AnnotationCreator from './components/AnnotationCreator';
import { getContract } from './utils/contract';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [texts, setTexts] = useState([]);
  const [activeTab, setActiveTab] = useState('browse');

  const handleConnect = (connectedAccount) => {
    setAccount(connectedAccount);
  };

  useEffect(() => {
    // Fetch texts for dropdown in annotation creator
    const fetchTexts = async () => {
      if (!account) return;
      
      try {
        const contract = getContract();
        const textCount = await contract.getTextCount();
        
        const textPromises = [];
        for (let i = 0; i < Math.min(textCount.toNumber(), 100); i++) {
          textPromises.push(contract.texts(i));
        }
        
        const textsData = await Promise.all(textPromises);
        
        const formattedTexts = textsData.map((text, index) => ({
          id: index,
          title: text.title,
          author: text.author
        }));
        
        setTexts(formattedTexts);
      } catch (err) {
        console.error('Error fetching texts:', err);
      }
    };

    fetchTexts();
  }, [account]);

  return (
    <section className="min-h-screen bg-gray-50 text-gray-900 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-indigo-800 mb-2">
          EchoChain
        </h1>
        <p className="text-center text-gray-600 mb-8">
          A Digital Humanities Platform for Classical Latin Texts, built on Blockchain
        </p>
        
        <div className="mb-6">
          <WalletConnect onConnect={handleConnect} />
        </div>
        
        <div className="mb-6">
          <div className="border border-indigo-500 rounded-lg p-4 shadow-md bg-white max-w-2xl mx-auto">
            <h2 className="text-lg font-bold text-center mb-4 text-indigo-700">About This Project</h2>
            
            <div className="space-y-3">
              <p className="text-sm">
                <strong className="text-indigo-600">Problem:</strong> Classical Latin texts are often scattered across different libraries and platforms, making collaborative annotation and analysis difficult.
              </p>
              
              <p className="text-sm">
                <strong className="text-indigo-600">Solution:</strong> Textus Latinus creates a decentralized repository where scholars can upload, annotate, and analyze Latin texts collaboratively with transparent attribution.
              </p>
              
              <p className="text-sm">
                <strong className="text-indigo-600">Innovation:</strong> By using blockchain technology, we ensure immutable records of contributions, creating a trustless platform for digital humanities research.
              </p>
              
              <div className="pt-2 text-xs text-gray-500">
                Created for EasyA x Harvard Blockchain Hackathon 2025
              </div>
            </div>
          </div>
        </div>
        
        <div className="mb-6">
          <div className="flex border-b border-gray-200 justify-center">
            <button
              className={`py-2 px-4 ${
                activeTab === 'browse'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('browse')}
            >
              Browse Texts
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'upload'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('upload')}
            >
              Upload Text
            </button>
            <button
              className={`py-2 px-4 ${
                activeTab === 'annotate'
                  ? 'border-b-2 border-indigo-500 text-indigo-600 font-medium'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('annotate')}
            >
              Create Annotation
            </button>
          </div>
        </div>
        
        {activeTab === 'browse' && <TextBrowser />}
        {activeTab === 'upload' && <TextUploader account={account} />}
        {activeTab === 'annotate' && <AnnotationCreator account={account} texts={texts} />}
        
        <footer className="mt-12 text-center text-sm text-gray-500">
          <p>Contract Address: 0xd611dbb2bbC718f349519BD483F81edF9441d41C</p>
          <p className="mt-1">© 2025 Textus Latinus - All rights reserved</p>
        </footer>
      </div>
    </section>
  );
}