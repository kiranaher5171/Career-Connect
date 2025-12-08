'use client';

import React from 'react';
import ModalVideo from 'react-modal-video';
import 'react-modal-video/css/modal-video.css';

const VideoDialog = ({ open, onClose, videoId = 'L61p2uyiMSo', channel = 'youtube' }) => {
  const handleClose = () => {
    if (onClose) onClose();
  };

  return (
    <ModalVideo
      channel={channel}
      isOpen={open}
      videoId={videoId}
      onClose={handleClose}
    />
  );
};

export default VideoDialog;
