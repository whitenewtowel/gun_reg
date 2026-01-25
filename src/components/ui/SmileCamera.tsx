import React, { useEffect, useRef } from 'react';
import '@smileid/web-components/smart-camera-web';

interface SmileCameraProps {
    onSuccess: (detail: any) => void;
    onClose?: () => void;
    captureId?: string;
}

const SmileCamera: React.FC<SmileCameraProps> = ({ onSuccess, onClose, captureId }) => {
    const cameraRef = useRef<HTMLElement>(null);

    useEffect(() => {
        const camera = cameraRef.current;
        if (!camera) return;

        const handleResult = (e: any) => {
            console.log("SmileID Capture Result:", e.detail);
            if (onSuccess) onSuccess(e.detail);
        };

        const handleClose = () => {
            console.log("SmileID Camera Closed");
            if (onClose) onClose();
        };

        // Listen for both event types to be safe
        camera.addEventListener('smart-camera-web.publish', handleResult);
        camera.addEventListener('images-success', handleResult);
        camera.addEventListener('smart-camera-web.close', handleClose);

        return () => {
            camera.removeEventListener('smart-camera-web.publish', handleResult);
            camera.removeEventListener('images-success', handleResult);
            camera.removeEventListener('smart-camera-web.close', handleClose);
        };
    }, [onSuccess, onClose]);

    return (
        // @ts-ignore - Custom element types handled by library
        <smart-camera-web
            ref={cameraRef}
            capture-id={captureId || undefined}
            capture-id hide-back-of-id
            theme-color="#D4AF37"
        ></smart-camera-web>
    );
};

export default SmileCamera;
