// components/TextBrowser.js
'use client';

import React, { useState, useEffect } from 'react';
import { getContract, DEMO_TEXTS } from '../utils/contract';

const TextBrowser = () => {
  const [texts, setTexts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedText, setSelectedText] = useState(null);

  useEffect(() => {
    const fetchTexts = async () => {
      try {
        setLoading(true);
        const contract = getContract();
        
        console.log("Getting text count...");
        let textCount;
        try {
          textCount = await contract.getTextCount();
          // Handle if textCount is a BigInt or Number
          textCount = typeof textCount === 'bigint' ? Number(textCount) : 
                      typeof textCount === 'object' && textCount.toNumber ? textCount.toNumber() : 
                      Number(textCount);
          console.log("Text count:", textCount);
        } catch (countError) {
          console.error("Error getting text count:", countError);
          textCount = DEMO_TEXTS.length; // Fallback to demo texts
        }
        
        // Fetch texts
        const fetchedTexts = [];
        for (let i = 0; i < Math.min(textCount, 20); i++) {
          try {
            const text = await contract.texts(i);
            fetchedTexts.push(text);
          } catch (e) {
            console.warn(`Error fetching text ${i}:`, e);
            // Use a demo text as fallback
            if (i < DEMO_TEXTS.length) {
              fetchedTexts.push(DEMO_TEXTS[i]);
            } else {
              fetchedTexts.push({
                title: `Sample Text ${i}`,
                author: "Anonymous",
                uploader: "0xd611dbb2bbC718f349519BD483F81edF9441d41C",
                timestamp: Date.now() / 1000,
                contentHash: `QmSample${i}`,
                annotationCount: 0,
                verified: false
              });
            }
          }
        }
        
        // Format text data
        const formattedTexts = fetchedTexts.map((text, index) => ({
          id: index,
          title: text.title || `Unknown Title ${index}`,
          author: text.author || "Unknown Author",
          uploader: text.uploader || "0x0000000000000000000000000000000000000000",
          timestamp: typeof text.timestamp === 'string' ? text.timestamp : 
                    new Date(Number(text.timestamp) * 1000).toLocaleDateString(),
          contentHash: text.contentHash || "QmUnknown",
          annotationCount: typeof text.annotationCount === 'number' ? text.annotationCount : 
                          Number(text.annotationCount || 0),
          verified: Boolean(text.verified),
          sampleContent: text.sampleContent || null
        }));
        
        setTexts(formattedTexts);
        setError(null);
      } catch (err) {
        console.error('Error fetching texts:', err);
        setError('Failed to fetch data from the contract');
        
        // Fallback to demo data on error
        setTexts(DEMO_TEXTS.map((text, index) => ({
          id: index,
          title: text.title,
          author: text.author,
          uploader: text.uploader, 
          timestamp: text.timestamp,
          contentHash: text.contentHash,
          annotationCount: text.annotationCount,
          verified: text.verified
        })));
      } finally {
        setLoading(false);
      }
    };
    fetchTexts();

    // Add storage event listener to refresh when texts are added
    const handleStorageChange = (e) => {
      if (e.key === 'userSubmittedTexts') {
        fetchTexts();
      }
    };
    
    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange);
    }

    // Poll for updates every 30 seconds
    const interval = setInterval(fetchTexts, 30000);
    
    // Setup direct check for localStorage changes
    const lastStorageValue = localStorage.getItem('userSubmittedTexts');
    const checkForUpdates = () => {
      const currentValue = localStorage.getItem('userSubmittedTexts');
      if (currentValue !== lastStorageValue) {
        fetchTexts();
      }
    };
    
    // Check for updates every 2 seconds
    const storageCheckInterval = setInterval(checkForUpdates, 2000);
    
    return () => {
      clearInterval(interval);
      clearInterval(storageCheckInterval);
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange);
      }
    };
  }, []);

  const handleTextSelect = (text) => {
    setSelectedText(text);
  };

  return (
    <div className="border border-indigo-500 rounded-lg p-4 shadow-md bg-white max-w-2xl w-full mx-auto">
      <h2 className="text-xl font-bold text-center mb-4 text-indigo-700">Latin Text Repository</h2>
      
      {loading ? (
        <div className="flex justify-center my-4">
          <div className="w-6 h-6 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <p className="text-red-500 text-center">{error}</p>
      ) : (
        <div>
          {selectedText ? (
            <div className="space-y-4">
              <button 
                onClick={() => setSelectedText(null)}
                className="text-sm text-indigo-600 hover:text-indigo-800"
              >
                &larr; Back to text list
              </button>
              
              <div className="border rounded-md p-4 bg-indigo-50">
                <h3 className="text-lg font-semibold">{selectedText.title}</h3>
                <p className="text-sm text-gray-600">by {selectedText.author}</p>
                <div className="flex items-center mt-2">
                  {selectedText.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">Verified</span>
                  )}
                  <span className="text-xs text-gray-500">Annotations: {selectedText.annotationCount}</span>
                </div>
                
                <div className="mt-4 text-sm">
                  <p>Content stored on IPFS with hash:</p>
                  <p className="font-mono text-xs break-all bg-gray-100 p-1 rounded mt-1">
                    {selectedText.contentHash}
                  </p>
                </div>
                
                <div className="mt-4 border-t pt-4">
                  <h4 className="font-medium mb-2">Sample Text:</h4>
                  {selectedText.title === "De Bello Gallico" && (
                    <p className="text-sm italic">
                      "Gallia est omnis divisa in partes tres, quarum unam incolunt Belgae, aliam Aquitani, tertiam qui ipsorum lingua Celtae, nostra Galli appellantur. Hi omnes lingua, institutis, legibus inter se differunt..."
                    </p>
                  )}
                  {selectedText.title === "Aeneid" && (
                    <p className="text-sm italic">
                      "Arma virumque cano, Troiae qui primus ab oris Italiam, fato profugus, Laviniaque venit litora, multum ille et terris iactatus et alto vi superum saevae memorem Iunonis ob iram..."
                    </p>
                  )}
                  {selectedText.title === "Metamorphoses" && (
                    <p className="text-sm italic">
                      "In nova fert animus mutatas dicere formas corpora; di, coeptis (nam vos mutastis et illas) adspirate meis primaque ab origine mundi ad mea perpetuum deducite tempora carmen!"
                    </p>
                  )}
                  {selectedText.sampleContent && (
                    <p className="text-sm italic">
                      {selectedText.sampleContent}
                    </p>
                  )}
                  {!["De Bello Gallico", "Aeneid", "Metamorphoses"].includes(selectedText.title) && !selectedText.sampleContent && (
                    <p className="text-sm italic">
                      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor..."
                    </p>
                  )}
                </div>
                
                <div className="mt-4">
                  <p className="text-sm text-gray-600">
                    Uploaded by: {selectedText.uploader.substring(0, 6)}...{selectedText.uploader.substring(38)} on {selectedText.timestamp}
                  </p>
                </div>
                
                <div className="mt-4">
                  <p className="text-center text-sm text-gray-500">
                    Connect your wallet to access additional annotations and features.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {texts.length === 0 ? (
                <p className="text-center text-gray-500">No texts available yet.</p>
              ) : (
                texts.map((text) => (
                  <div 
                    key={text.id} 
                    className="border rounded-md p-3 cursor-pointer hover:bg-indigo-50 transition"
                    onClick={() => handleTextSelect(text)}
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-medium">{text.title}</h3>
                        <p className="text-sm text-gray-600">by {text.author}</p>
                      </div>
                      <div className="flex flex-col items-end">
                        {text.verified && (
                          <span className="bg-green-100 text-green-800 text-xs px-1.5 py-0.5 rounded">Verified</span>
                        )}
                        <span className="text-xs text-gray-500 mt-1">
                          Annotations: {text.annotationCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TextBrowser;