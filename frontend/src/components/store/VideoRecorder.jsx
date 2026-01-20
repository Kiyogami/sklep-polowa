import { useState, useRef, useCallback, useEffect } from 'react';
import { Video, StopCircle, RotateCcw, Check, AlertCircle, Camera, Mic, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';

export const VideoRecorder = ({ onVideoRecorded, orderId }) => {
  const [status, setStatus] = useState('idle'); // idle, preparing, ready, recording, recorded, uploading
  const [recordedBlob, setRecordedBlob] = useState(null);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [countdown, setCountdown] = useState(0);
  
  const videoRef = useRef(null);
  const previewVideoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);
  const countdownRef = useRef(null);

  const MAX_RECORDING_TIME = 8; // seconds (stała długość nagrania)
  const MIN_RECORDING_TIME = 8; // seconds (minimalny wymagany czas)

  // Start camera
  const startCamera = useCallback(async () => {
    setStatus('preparing');
    setError(null);
    
    try {
      // Check if camera is available
      const devices = await navigator.mediaDevices.enumerateDevices();
      const hasCamera = devices.some(d => d.kind === 'videoinput');
      const hasMic = devices.some(d => d.kind === 'audioinput');
      
      if (!hasCamera) {
        throw new Error('Nie znaleziono kamery');
      }
      
      const constraints = {
        video: { 
          facingMode: 'user', 
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: hasMic
      };
      
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        await videoRef.current.play();
      }
      
      setStatus('ready');
    } catch (err) {
      console.error('Camera error:', err);
      
      if (err.name === 'NotAllowedError') {
        setError('Brak uprawnień do kamery. Zezwól na dostęp w ustawieniach przeglądarki.');
      } else if (err.name === 'NotFoundError') {
        setError('Nie znaleziono kamery. Upewnij się, że kamera jest podłączona.');
      } else {
        setError(`Błąd kamery: ${err.message}`);
      }
      setStatus('idle');
    }
  }, []);

  // Stop camera
  const stopCamera = useCallback(() => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }, [stream]);

  // Start countdown before recording
  const startCountdown = useCallback(() => {
    setCountdown(3);
    
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          startActualRecording();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, []);

  // Start actual recording
  const startActualRecording = useCallback(() => {
    if (!stream) return;

    chunksRef.current = [];
    setRecordingTime(0);
    
    // Determine supported MIME type
    let mimeType = 'video/webm;codecs=vp9';
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      mimeType = 'video/webm;codecs=vp8';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        mimeType = 'video/webm';
        if (!MediaRecorder.isTypeSupported(mimeType)) {
          mimeType = 'video/mp4';
        }
      }
    }
    
    try {
      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: mimeType });
        setRecordedBlob(blob);
        const url = URL.createObjectURL(blob);
        setRecordedUrl(url);
        setStatus('recorded');
        stopCamera();
      };
      
      mediaRecorder.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setError('Błąd nagrywania. Spróbuj ponownie.');
        setStatus('ready');
      };
      
      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(100); // Collect data every 100ms
      setStatus('recording');
      
      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= MAX_RECORDING_TIME - 1) {
            stopRecording();
            return MAX_RECORDING_TIME;
          }
          return prev + 1;
        });
      }, 1000);
      
    } catch (err) {
      console.error('Recording error:', err);
      setError('Nie można rozpocząć nagrywania. Spróbuj ponownie.');
      setStatus('ready');
    }
  }, [stream, stopCamera]);

  // Stop recording
  const stopRecording = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    }
  }, []);

  // Retry recording
  const retryRecording = useCallback(() => {
    if (recordedUrl) {
      URL.revokeObjectURL(recordedUrl);
    }
    setRecordedBlob(null);
    setRecordedUrl(null);
    setRecordingTime(0);
    setStatus('idle');
    startCamera();
  }, [recordedUrl, startCamera]);

  // Confirm and upload recording
  const confirmRecording = useCallback(() => {
    if (recordedBlob && onVideoRecorded) {
      setStatus('uploading');
      onVideoRecorded(recordedBlob, orderId);
    }
  }, [recordedBlob, onVideoRecorded, orderId]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCamera();
      if (timerRef.current) clearInterval(timerRef.current);
      if (countdownRef.current) clearInterval(countdownRef.current);
      if (recordedUrl) URL.revokeObjectURL(recordedUrl);
    };
  }, []);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="bg-card border-border overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-foreground">
          <Video className="w-5 h-5 text-primary" />
          Nagranie weryfikacyjne
        </CardTitle>
        <CardDescription>
          Nagraj krótkie wideo (5-10 sekund) pokazując twarz
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4 p-0">
        {/* Instructions */}
        <div className="px-6">
          <Alert className="bg-primary/5 border-primary/20">
            <AlertCircle className="h-4 w-4 text-primary" />
            <AlertDescription className="text-sm text-foreground">
              <strong>Powiedz wyraźnie:</strong>
              <p className="mt-1 text-primary font-medium">
                "Potwierdzam zamówienie numer {orderId}"
              </p>
            </AlertDescription>
          </Alert>
        </div>

        {/* Video container */}
        <div className="relative aspect-[4/3] bg-black">
          {/* Live preview */}
          {(status === 'ready' || status === 'recording' || status === 'preparing') && (
            <video 
              ref={videoRef}
              autoPlay 
              muted 
              playsInline
              className="w-full h-full object-cover"
              style={{ transform: 'scaleX(-1)' }}
            />
          )}
          
          {/* Recorded video */}
          {(status === 'recorded' || status === 'uploading') && recordedUrl && (
            <video 
              ref={previewVideoRef}
              src={recordedUrl} 
              controls 
              playsInline
              className="w-full h-full object-cover"
            />
          )}
          
          {/* Idle state */}
          {status === 'idle' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted">
              <Camera className="w-16 h-16 text-muted-foreground mb-4" />
              <p className="text-muted-foreground">Kliknij "Włącz kamerę" aby rozpocząć</p>
            </div>
          )}
          
          {/* Preparing state */}
          {status === 'preparing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-foreground">Uruchamianie kamery...</p>
            </div>
          )}
          
          {/* Countdown overlay */}
          {countdown > 0 && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/70">
              <div className="text-8xl font-bold text-primary animate-pulse">
                {countdown}
              </div>
            </div>
          )}
          
          {/* Recording indicator */}
          {status === 'recording' && (
            <>
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1.5 bg-destructive rounded-full">
                <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                <span className="text-sm font-medium text-white">REC</span>
              </div>
              
              {/* Timer */}
              <div className="absolute top-4 right-4 flex items-center gap-2 px-3 py-1.5 bg-black/70 rounded-full">
                <Clock className="w-4 h-4 text-white" />
                <span className="text-sm font-mono text-white">{formatTime(recordingTime)}</span>
              </div>
              
              {/* Face guide overlay */}
              <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-48 h-64 border-2 border-dashed border-primary/50 rounded-full" />
              </div>
            </>
          )}
          
          {/* Uploading overlay */}
          {status === 'uploading' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4" />
              <p className="text-foreground">Przesyłanie nagrania...</p>
            </div>
          )}
        </div>

        {/* Recording progress bar */}
        {status === 'recording' && (
          <div className="px-6">
            <Progress 
              value={(recordingTime / MAX_RECORDING_TIME) * 100} 
              className="h-2"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>Min: {MIN_RECORDING_TIME}s</span>
              <span>Max: {MAX_RECORDING_TIME}s</span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          </div>
        )}

        {/* Controls */}
        <div className="p-6 pt-2 space-y-3">
          {status === 'idle' && (
            <Button 
              onClick={startCamera}
              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              size="lg"
            >
              <Camera className="w-5 h-5 mr-2" />
              Włącz kamerę
            </Button>
          )}
          
          {status === 'ready' && (
            <Button 
              onClick={startCountdown}
              className="w-full bg-destructive text-destructive-foreground hover:bg-destructive/90"
              size="lg"
            >
              <Video className="w-5 h-5 mr-2" />
              Rozpocznij nagrywanie
            </Button>
          )}
          
          {status === 'recording' && (
            <p className="text-sm text-muted-foreground text-center">
              Nagrywanie zakończy się automatycznie po {MAX_RECORDING_TIME} sekundach.
            </p>
          )}
          
          {status === 'recorded' && (
            <div className="flex gap-3">
              <Button 
                onClick={retryRecording}
                variant="outline"
                className="flex-1 border-border hover:bg-muted"
                size="lg"
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Nagraj ponownie
              </Button>
              <Button 
                onClick={confirmRecording}
                className="flex-1 bg-success text-success-foreground hover:bg-success/90"
                size="lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Wyślij nagranie
              </Button>
            </div>
          )}
          
          {/* Recording info */}
          {status === 'recorded' && recordedBlob && (
            <p className="text-xs text-muted-foreground text-center">
              Nagranie: {formatTime(recordingTime)} • {(recordedBlob.size / 1024 / 1024).toFixed(2)} MB
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoRecorder;
