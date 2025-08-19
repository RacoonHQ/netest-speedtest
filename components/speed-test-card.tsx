"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Wifi, Gauge, Upload as UploadIcon, Download as DownloadIcon, Clock, BarChart3, RotateCcw, Zap, Play, Tv, Gamepad2, Check, X, AlertTriangle, Video, Activity, Wifi as WifiIcon } from "lucide-react"
import { AnimatedNumber } from "@/components/ui/animated-number"
import { Speedometer } from "@/components/ui/speedometer"
import { TestPhase, TestState, type TestResults, type CurrentValues, type SpeedTestResult } from "@/types/speed-test.types"
import { TEST_PHASES, SPEED_TEST_UNITS, SPEED_TEST_LABELS, SPEED_TEST_ICONS, SPEED_TEST_CONFIG } from "@/constants/speed-test.constants"
import { AnalyticsCard } from "@/components/analytics-card"

const getPhaseProgress = (phase: string, currentPhase: string | null, progress: number): number => {
  if (!currentPhase) return 0;
  // Only include the test phases that are in TEST_PHASES
  const validPhases = TEST_PHASES as readonly string[];
  const phaseIndex = validPhases.indexOf(phase);
  const currentPhaseIndex = validPhases.indexOf(currentPhase);
  
  if (phaseIndex < 0 || currentPhaseIndex < 0) return 0;
  if (phaseIndex < currentPhaseIndex) return 100;
  if (phaseIndex > currentPhaseIndex) return 0;
  return progress;
};

const getPhaseStatus = (phase: string, currentPhase: string | null): 'pending' | 'in-progress' | 'completed' => {
  if (!currentPhase) return 'pending';
  // Only include the test phases that are in TEST_PHASES
  const validPhases = TEST_PHASES as readonly string[];
  const phaseIndex = validPhases.indexOf(phase);
  const currentPhaseIndex = validPhases.indexOf(currentPhase);
  
  if (phaseIndex < 0 || currentPhaseIndex < 0) return 'pending';
  if (phaseIndex < currentPhaseIndex) return 'completed';
  if (phaseIndex > currentPhaseIndex) return 'pending';
  return 'in-progress';
};

const getPhaseColor = (phase: string, testPhase: string | null) => {
  if (testPhase === phase) return 'text-blue-600 dark:text-blue-400';
  const status = getPhaseStatus(phase, testPhase || '');
  if (status === 'completed') return 'text-green-600 dark:text-green-400';
  return 'text-gray-400 dark:text-gray-500';
};

export function SpeedTestCard({ isTestRunning = false }: { isTestRunning?: boolean }) {
  
  // Function to get connection rating
  const getConnectionRating = (speed: number): { rating: string, color: string } => {
    if (speed > 100) return { rating: 'Excellent', color: 'text-green-500' };
    if (speed > 50) return { rating: 'Good', color: 'text-blue-500' };
    if (speed > 20) return { rating: 'Fair', color: 'text-yellow-500' };
    return { rating: 'Poor', color: 'text-red-500' };
  };
  
  // Mock runSpeedTest function
  const runSpeedTest = async (phase: TestPhase, size: string) => {
    // This is a mock implementation
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (phase === 'ping') {
      return { type: 'ping', ping: 24, jitter: 2, packetLoss: 0 };
    } else if (phase === 'download') {
      return { type: 'download', speed: 87.5, progress: 100 };
    } else if (phase === 'upload') {
      return { type: 'upload', speed: 42.3, progress: 100 };
    }
    
    throw new Error('Invalid test phase');
  };
  
  // Default language
  const language = 'en';
  const [testState, setTestState] = useState<TestState>('not_started');
  const [testPhase, setTestPhase] = useState<TestPhase | null>(null);
  const [progress, setProgress] = useState(0);
  const [results, setResults] = useState<TestResults>({
    ping: { type: 'ping', ping: 0, jitter: 0, packetLoss: 0 },
    download: { type: 'download', speed: 0, progress: 0 },
    upload: { type: 'upload', speed: 0, progress: 0 },
    server: { name: 'Local Server', location: 'Local' }
  });
  
  const [currentValues, setCurrentValues] = useState<CurrentValues>({
    ping: 0,
    download: 0,
    upload: 0,
  });
  
  const [error, setError] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [activeTab, setActiveTab] = useState('results');

  // Handle test phase changes
  useEffect(() => {
    if (isTestRunning && testState === "not_started") {
      simulateTest();
    }
  }, [isTestRunning, testState]);

  // Mock function to simulate test progress
  const simulateTest = async () => {
    setIsTesting(true);
    setShowAnalytics(false);
    setTestState("testing");
    setTestPhase(null);
    setProgress(0);
    setResults({
      ping: { type: 'ping', ping: 0, jitter: 0, packetLoss: 0 },
      download: { type: 'download', speed: 0, progress: 0 },
      upload: { type: 'upload', speed: 0, progress: 0 },
      server: { name: 'Local Server', location: 'Local' }
    });
    setCurrentValues({
      ping: 0,
      download: 0,
      upload: 0,
    });
    setError(null);

    try {
      // Run all test phases in sequence
      for (const phase of TEST_PHASES) {
        setTestPhase(phase);
        setProgress(0);
        
        // Update progress during the test
        const progressInterval = setInterval(() => {
          setProgress(prev => Math.min(prev + 5, 90)); // Cap at 90% until test completes
        }, 200);

        try {
          const result = await runSpeedTest(phase, phase === 'ping' ? 'small' : 'medium');
          
          clearInterval(progressInterval);
          setProgress(100);
          
          setResults(prev => ({
            ...prev,
            [phase]: result
          }));
          
          setCurrentValues(prev => ({
            ...prev,
            [phase]: phase === 'ping' ? (result.ping || 0) : (result.speed || 0)
          }));
          
          // Small delay between tests
          await new Promise(resolve => setTimeout(resolve, 500));
          
        } catch (err) {
          clearInterval(progressInterval);
          console.error(`${phase} test failed:`, err);
          // Continue with next test even if one fails
          continue;
        }
      }
      
      setTestState("completed");
      
    } catch (error) {
      console.error("Speed test failed:", error);
      setError("Gagal melakukan tes kecepatan. Silakan coba lagi.");
      setTestState("not_started");
    }
  };

  const resetTest = () => {
    setTestState("not_started");
    setTestPhase(null);
    setProgress(0);
    setResults({
      ping: { type: 'ping', ping: 0, jitter: 0, packetLoss: 0 },
      download: { type: 'download', speed: 0, progress: 0 },
      upload: { type: 'upload', speed: 0, progress: 0 },
      server: { name: 'Local Server', location: 'Local' }
    });
    setCurrentValues({
      ping: 0,
      download: 0,
      upload: 0,
    });
    setError(null);
  };

  // Calculate overall rating if all tests are complete
  const rating = results.ping && results.download && results.upload
    ? getConnectionRating(
        results.download.speed || 0
      )
    : null;

  const startSpeedTest = async () => {
    setIsTesting(true);
    setShowAnalytics(false);
    setTestState("testing");
    setTestPhase(null);
    setProgress(0);
    
    // Initialize with zeros
    const initialResults = {
      ping: { type: 'ping' as const, ping: 0, jitter: 0, packetLoss: 0 },
      download: { type: 'download' as const, speed: 0, progress: 0 },
      upload: { type: 'upload' as const, speed: 0, progress: 0 },
      server: { name: 'Local Server', location: 'Local' }
    };
    
    setResults(initialResults);
    setCurrentValues({
      ping: 0,
      download: 0,
      upload: 0,
    });
    setError(null);

    // Simulate the test with real-time updates
    try {
      // Simulate ping test with incremental updates
      setTestPhase('ping');
      for (let i = 0; i <= 100; i += 10) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const pingValue = Math.min(24 + Math.random() * 10, 24); // Randomize around 24ms
        setCurrentValues(prev => ({ ...prev, ping: Math.round(pingValue) }));
        setResults(prev => ({
          ...prev,
          ping: { ...prev.ping, ping: Math.round(pingValue), jitter: 2, packetLoss: 0 }
        }));
        setProgress(i);
      }
      
      // Simulate download test with incremental updates
      setTestPhase('download');
      for (let i = 0; i <= 100; i += 2) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const downloadSpeed = Math.min(87.5 * (i / 100) * (0.9 + Math.random() * 0.2), 87.5);
        setCurrentValues(prev => ({ ...prev, download: parseFloat(downloadSpeed.toFixed(1)) }));
        setResults(prev => ({
          ...prev,
          download: { ...prev.download, speed: parseFloat(downloadSpeed.toFixed(1)), progress: i }
        }));
        setProgress(i);
      }
      
      // Simulate upload test with incremental updates
      setTestPhase('upload');
      for (let i = 0; i <= 100; i += 2) {
        await new Promise(resolve => setTimeout(resolve, 50));
        const uploadSpeed = Math.min(42.3 * (i / 100) * (0.9 + Math.random() * 0.2), 42.3);
        setCurrentValues(prev => ({ ...prev, upload: parseFloat(uploadSpeed.toFixed(1)) }));
        setResults(prev => ({
          ...prev,
          upload: { ...prev.upload, speed: parseFloat(uploadSpeed.toFixed(1)), progress: i }
        }));
        setProgress(i);
      }
      
      // Test complete
      setTestState("completed");
      setShowAnalytics(true);
      setActiveTab('analytics');
      setProgress(100);
      
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
      setTestState("error");
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-6 bg-black rounded-xl shadow-2xl border ">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2 text-white">
          <Zap className="w-6 h-6 text-emerald-600" />
          Speed Test
        </h2>
        <p className="text-sm text-gray-400 mt-2">
          Measure your internet connection speed accurately
        </p>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Test Results with Speedometers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {TEST_PHASES.map((phase) => {
          const Icon = SPEED_TEST_ICONS[phase];
          const isActive = testPhase === phase;
          const isCompleted = testState === 'completed' || 
            (testPhase && 
             testPhase !== 'complete' && 
             TEST_PHASES.indexOf(phase) < TEST_PHASES.indexOf(testPhase as 'ping' | 'download' | 'upload'));
          const value = currentValues[phase];
          
          return (
            <div 
              key={phase}
              className={`${SPEED_TEST_CONFIG.ui.card.base} ${
                isActive 
                  ? ""
                  : isCompleted 
                    ? "opacity-90"
                    : SPEED_TEST_CONFIG.ui.card.inactive
              } transition-all duration-500 ease-out transform`}
            >
              <div className="flex flex-col items-center">
                {/* Label */}
                <div className={SPEED_TEST_CONFIG.ui.label.base}>
                  <Icon className={SPEED_TEST_CONFIG.ui.label.icon} />
                  <span>{SPEED_TEST_LABELS[phase]}</span>
                </div>
                
                {/* Status Badge */}
                <div className="mb-4">
                  {isActive && testState === 'testing' ? (
                    <span className="flex items-center text-xs text-emerald-400">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mr-1.5 animate-pulse"></span>
                      Testing...
                    </span>
                  ) : isCompleted ? (
                    <span className="text-xs text-emerald-400 flex items-center">
                      <Check className="w-3 h-3 mr-1" />
                      Completed
                    </span>
                  ) : (
                    <span className="text-xs text-gray-400">
                      {testState === 'not_started' ? 'Ready' : 'Waiting...'}
                    </span>
                  )}
                </div>
                
                {/* Speedometer */}
                <div className="w-full -mt-8 -mb-4">
                  <Speedometer 
                    value={value} 
                    type={phase} 
                    isActive={isActive && testState === 'testing'}
                  />
                </div>
                
                {/* Additional Info */}
                <div className="w-full mt-2 text-center">
                  <div className="text-sm text-gray-400">
                    {phase === 'ping' 
                      ? 'Latency' 
                      : phase === 'download' 
                        ? 'Download Speed' 
                        : 'Upload Speed'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Analytics Panel */}
      {showAnalytics && (
        <div className="mt-6 pt-4 border-t border-emerald-200 dark:border-gray-900">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="flex justify-center items-center mb-6 w-full">
              <TabsTrigger 
                value="analytics" 
                className="flex items-center justify-center gap-2 data-[state=active]:text-blue-500 text-gray-600 text-xs sm:text-sm"
              >
                <BarChart3 className="w-4 h-4" />
                <span className="hidden sm:inline">Analytics</span>
              </TabsTrigger>
              <TabsTrigger 
                value="streaming" 
                className="flex items-center justify-center gap-2 data-[state=active]:text-blue-500 text-gray-600 text-xs sm:text-sm"
              >
                <Tv className="w-4 h-4" />
                <span className="hidden sm:inline">Streaming</span>
              </TabsTrigger>
              <TabsTrigger 
                value="gaming" 
                className="flex items-center justify-center gap-2 data-[state=active]:text-blue-500 text-gray-600 text-xs sm:text-sm"
              >
                <Gamepad2 className="w-4 h-4" />
                <span className="hidden sm:inline">Gaming</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="analytics" className="space-y-4">
              <AnalyticsCard 
                ping={results.ping.ping || 0}
                download={results.download.speed || 0}
                upload={results.upload.speed || 0}
                jitter={results.ping.jitter}
                packetLoss={results.ping.packetLoss}
              />
            </TabsContent>

        <TabsContent value="streaming" className="space-y-4">
          <div className="p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Tv className="w-5 h-5 text-emerald-400" />
              Streaming Quality
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Video className="w-4 h-4" />
                  Video Quality
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">
                    {(results.download?.speed || 0) > 15 ? '4K' : (results.download?.speed || 0) > 5 ? 'HD' : 'SD'}
                  </span>
                  <span className="text-sm text-gray-400 ml-1">
                    {(results.download?.speed || 0) > 15 
                      ? 'Ultra HD' 
                      : (results.download?.speed || 0) > 5 
                        ? 'High Definition' 
                        : 'Standard'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {(results.download?.speed || 0) > 15 
                    ? 'Supports 4K streaming on most platforms'
                    : (results.download?.speed || 0) > 5 
                    ? 'Supports HD streaming on most platforms'
                    : 'Supports SD streaming on most platforms'}
                </div>
              </div>
              
              <div className="p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <WifiIcon className="w-4 h-4" />
                  Buffer
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">
                    {(results.ping?.ping || 0) < 50 
                      ? 'Low' 
                      : (results.ping?.ping || 0) < 100 
                        ? 'Medium' 
                        : 'High'}
                  </span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {(results.ping?.ping || 0) < 50 
                    ? 'Minimal buffering, smooth playback'
                    : (results.ping?.ping || 0) < 100 
                    ? 'Occasional buffering, generally good experience'
                    : 'Frequent buffering, may affect viewing'}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400">Platform Compatibility</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { 
                    name: 'YouTube', 
                    supported: true,
                    icon: '/platform-stream/youtube.png',
                    url: 'https://www.youtube.com/@Relaxeaa'
                  },
                  { 
                    name: 'Netflix', 
                    supported: (results.download?.speed || 0) > 5,
                    icon: '/platform-stream/netflix.png',
                    url: 'https://www.netflix.com'
                  },
                  { 
                    name: 'Disney+', 
                    supported: (results.download?.speed || 0) > 5,
                    icon: '/platform-stream/disney.png',
                    url: 'https://www.disneyplus.com'
                  },
                  { 
                    name: 'Vidio', 
                    supported: true,
                    icon: '/platform-stream/vidio.png',
                    url: 'https://www.vidio.com'
                  },
                  { 
                    name: 'iFlix', 
                    supported: (results.download?.speed || 0) > 3,
                    icon: '/platform-stream/iflix.png',
                    url: 'https://www.iflix.com'
                  },
                  { 
                    name: 'Viu', 
                    supported: (results.download?.speed || 0) > 3,
                    icon: '/platform-stream/viu.png',
                    url: 'https://www.viu.com'
                  }
                ].map((platform, i) => (
                  <a 
                    key={i} 
                    href={platform.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`flex items-center gap-2 text-sm ${platform.supported ? 'opacity-100 hover:opacity-80' : 'opacity-60 cursor-not-allowed'}`}
                    onClick={!platform.supported ? (e) => e.preventDefault() : undefined}
                  >
                    <div className="relative w-6 h-6 flex items-center justify-center">
                      <img 
                        src={platform.icon} 
                        alt={platform.name}
                        className="w-full h-full object-contain"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = platform.supported ? 
                            '/platform-stream/default.png' : 
                            '/platform-stream/default-disabled.png';
                        }}
                      />
                      {!platform.supported && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 rounded flex items-center justify-center">
                          <X className="w-3 h-3 text-red-500" />
                        </div>
                      )}
                    </div>
                    <span className={platform.supported ? 'text-gray-400' : 'text-gray-500 line-through'}>
                      {platform.name}
                    </span>
                  </a>
                ))}
              </div>
            </div>
            
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <WifiIcon className="w-4 h-4" />
                <span>Test server: {results.server?.name || 'Local'}</span>
                {results.server?.location && (
                  <span className="text-gray-400">({results.server.location})</span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="gaming" className="space-y-4">
          <div className="p-6 rounded-xl shadow-sm">
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Gamepad2 className="w-5 h-5 text-emerald-500" />
              Gaming Performance
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <Activity className="w-4 h-4" />
                  Gaming Latency
                </div>
                <div className="flex items-baseline gap-1">
                  <span className="text-2xl font-bold">{(results.ping?.ping || 0).toFixed(0)}</span>
                  <span className="text-sm text-gray-400 ml-1">ms</span>
                </div>
                <div className="mt-2">
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-green-500 to-yellow-500" 
                      style={{ width: `${Math.min(100, Math.max(0, 100 - (results.ping?.ping || 0) / 2))}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-gray-400 mt-1">
                    <span>Good</span>
                    <span>Bad</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {(results.ping?.ping || 0) < 50 
                    ? 'Ideal for competitive gaming'
                    : (results.ping?.ping || 0) < 100 
                    ? 'Good for casual gaming'
                    : 'May experience lag in fast-paced games'}
                </div>
              </div>
              
              <div className="p-4 rounded-lg shadow-sm">
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-2">
                  <DownloadIcon className="w-4 h-4" />
                  Download Speed
                </div>
                <div className="flex items-baseline">
                  <span className="text-2xl font-bold">{(results.download?.speed || 0).toFixed(1)}</span>
                  <span className="text-sm text-gray-400 ml-1">Mbps</span>
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  {(results.download?.speed || 0) > 15 
                    ? 'Great for large game downloads and updates'
                    : (results.download?.speed || 0) > 5 
                    ? 'Good for standard game downloads'
                    : 'May be slow for large game downloads'}
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="text-sm font-medium text-gray-400">Game Recommendations</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { 
                    name: 'Mobile Legends', 
                    status: (results.ping?.ping || 0) < 100 ? 'Playable' : 'May lag',
                    icon: '/game-icon/ml.jpeg',
                    color: (results.ping?.ping || 0) < 100 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                  { 
                    name: 'PUBG Mobile', 
                    status: (results.download?.speed || 0) > 5 ? 'Smooth' : 'Performance limited',
                    icon: '/game-icon/pubg.jpeg',
                    color: (results.download?.speed || 0) > 5 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                  { 
                    name: 'Valorant', 
                    status: (results.ping?.ping || 0) < 80 ? 'Optimal' : 'May experience lag',
                    icon: '/game-icon/valo.jpeg',
                    color: (results.ping?.ping || 0) < 80 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                  { 
                    name: 'Genshin Impact', 
                    status: (results.download?.speed || 0) > 10 ? 'Smooth' : 'May stutter',
                    icon: '/game-icon/genshin.jpeg',
                    color: (results.download?.speed || 0) > 10 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                  { 
                    name: 'Free Fire', 
                    status: (results.ping?.ping || 0) < 120 ? 'Playable' : 'Lag may occur',
                    icon: '/game-icon/ff.jpeg',
                    color: (results.ping?.ping || 0) < 120 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                  { 
                    name: 'DOTA 2', 
                    status: (results.ping?.ping || 0) < 60 ? 'Very optimal' : 'May experience delay',
                    icon: '/game-icon/dota.jpeg',
                    color: (results.ping?.ping || 0) < 60 ? 'text-emerald-500' : 'text-yellow-500'
                  },
                ].map((game, i) => (
                  <div 
                    key={i} 
                    className="flex items-center justify-between p-3 rounded-lg shadow-sm hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <img 
                        src={game.icon} 
                        alt={game.name}
                        className="w-8 h-8 rounded-md object-cover"
                        onError={(e) => {
                          // Fallback jika gambar tidak ditemukan
                          const target = e.target as HTMLImageElement;
                          target.src = '/game-icon/default.jpeg';
                        }}
                      />
                      <div>
                        <div className="font-medium text-gray-800 dark:text-gray-200">{game.name}</div>
                        <div className={`text-xs ${game.color}`}>{game.status}</div>
                      </div>
                    </div>
                    {game.color.includes('yellow') && (
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="mt-4 pt-4 border-t">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <WifiIcon className="w-4 h-4" />
                <span>Test server: {results.server?.name || 'Local'}</span>
                {results.server?.location && (
                  <span className="text-gray-400">({results.server.location})</span>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )}

  {/* Test Controls */}
  <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
    {testState === "completed" ? (
      <Button
        onClick={startSpeedTest}
        disabled={false}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                  rounded-lg text-sm font-medium text-foreground
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        <RotateCcw className="w-4 h-4" />
        Run Test Again
      </Button>
    ) : testState === "testing" ? (
      <Button
        disabled={true}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                  rounded-lg text-sm font-medium text-foreground opacity-50"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
        Testing...
      </Button>
    ) : (
      <Button
        onClick={startSpeedTest}
        disabled={false}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 border border-gray-300 dark:border-gray-600 
                  rounded-lg text-sm font-medium text-foreground
                  hover:bg-gray-100 dark:hover:bg-gray-700 transition"
      >
        {testState === "testing" ? (
          <>
            <svg
              className="animate-spin h-4 w-4 text-gray-600 dark:text-gray-300"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 
                  0 5.373 0 12h4zm2 5.291A7.962 
                  7.962 0 014 12H0c0 3.042 1.135 
                  5.824 3 7.938l3-2.647z"
              />
            </svg>
            Testing...
          </>
        ) : (
          <>
            <Play className="w-4 h-4" />
            Start Test
          </>
        )}
      </Button>
    )}
  </div>

  {/* Connection Info */}
  {(testState === 'completed' || testState === 'testing') && (
    <div className="mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
      <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
        Connection Information
      </h3>
      <div className="grid grid-cols-2 gap-4 text-sm">
        <div>
          <div className="text-gray-500 dark:text-gray-400">Ping</div>
          <div>{results.ping.ping?.toFixed(0)} ms</div>
        </div>
        <div>
          <div className="text-gray-500 dark:text-gray-400">Jitter</div>
          <div>{results.ping.jitter?.toFixed(1) || 'N/A'} ms</div>
        </div>
      </div>
    </div>
  )}
  </div>
  );
}