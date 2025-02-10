import React, { useState } from 'react';
import Modal from 'react-modal';

const Competition = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalContent, setModalContent] = useState('');
  const [modalRules, setModalRules] = useState([]);
  const [modalBackground, setModalBackground] = useState('');

  const openModal = (content, rules, backgroundImage) => {
    setModalContent(content);
    setModalRules(rules);
    setModalBackground(backgroundImage);
    setModalIsOpen(true);
  };

  const closeModal = () => setModalIsOpen(false);

  const powerliftingDescription = `Powerlifting consists of three main lifts: Squat, Bench Press, and Deadlift.`;
  const bodybuildingDescription = `Bodybuilding focuses on muscle size, symmetry, and conditioning.`;

  const powerliftingRules = [
    "1. Squat: Proper depth must be reached with the barbell.",
    "2. Bench Press: The bar must be paused on the chest before pushing upward.",
    "3. Deadlift: Full lockout of the hips and knees is required.",
    "4. Each lifter gets three attempts at each lift.", 
    "5. Competitors are judged based on their highest successful attempt."
  ];
  const bodybuildingRules = [
    "1. Posing is a key part of the competition.",
    "2. Competitors are judged on muscularity, symmetry, and conditioning.",
    "3. Categories include Men's Physique, Classic Physique, and Women's Bodybuilding.",
    "4. Poses must be held to demonstrate muscle definition and symmetry.", 
    "5. Competitors must wear appropriate attire for each round."
  ];

  const powerliftingImage = 'https://plus.unsplash.com/premium_photo-1661609478485-340c97cc2b5d?w=500&auto=format&fit=crop&q=60';
  const bodybuildingImage = 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=500&auto=format&fit=crop&q=60';

  const youtubeLinks = {
    powerlifting: 'https://www.youtube.com/results?search_query=powerlifting+competition',
    bodybuilding: 'https://www.youtube.com/results?search_query=bodybuilding+competition',
  };

  return (
    <div className="text-center p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold mb-8 text-white">Welcome to the Competition</h1>
      <div className="flex flex-wrap justify-around gap-6">
        {/* Powerlifting Card */}
        <div
          className="relative w-full sm:w-64 md:w-72 lg:w-80 h-80 rounded-lg cursor-pointer transform transition duration-300 hover:scale-105 overflow-hidden"
          onClick={() => openModal(powerliftingDescription, powerliftingRules, powerliftingImage)}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${powerliftingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <h3 className="relative z-10 text-2xl font-semibold text-white p-6">Powerlifting</h3>
        </div>

        {/* Bodybuilding Card */}
        <div
          className="relative w-full sm:w-64 md:w-72 lg:w-80 h-80 rounded-lg cursor-pointer transform transition duration-300 hover:scale-105 overflow-hidden"
          onClick={() => openModal(bodybuildingDescription, bodybuildingRules, bodybuildingImage)}
        >
          <div
            className="absolute inset-0 bg-black bg-opacity-50"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.8)), url(${bodybuildingImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          />
          <h3 className="relative z-10 text-2xl font-semibold text-white p-6">Bodybuilding</h3>
        </div>
      </div>

      {/* Modal to display details and rules */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        ariaHideApp={false}
        style={{
          overlay: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)', // Dark overlay for better focus
          },
          content: {
            background: 'none', // Remove white background
            border: 'none',
            padding: '0',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            maxWidth: '600px',
            width: '90%',
          },
        }}
      >
        <div
          className="p-6 md:p-10 rounded-lg text-white relative"
          style={{
            backgroundImage: `linear-gradient(to bottom, rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.9)), url(${modalBackground})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
          }}
        >
          <h2 className="text-2xl md:text-3xl font-semibold mb-4">Details</h2>
          <p className="text-lg mb-4">{modalContent}</p>

          <h3 className="text-xl font-semibold mt-6">Rules</h3>
          <ul className="text-lg mb-4 space-y-2">
            {modalRules.map((rule, index) => (
              <li key={index}>{rule}</li>
            ))}
          </ul>

          <a
            href={youtubeLinks[modalContent === powerliftingDescription ? 'powerlifting' : 'bodybuilding']}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-400 hover:underline"
          >
            Watch related YouTube video
          </a>
          <br />
          <button
            onClick={closeModal}
            className="mt-4 bg-red-500 text-white py-2 px-6 rounded hover:bg-red-600 transition duration-300"
          >
            Close
          </button>
        </div>
      </Modal>
    </div>
  );
};

export default Competition;
