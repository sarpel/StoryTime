import React, { useState, useRef, useEffect } from 'react';

// --- Ikonlar ---
const SparklesIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-yellow-300"><path d="M9.94 14.32c.32-.08.67-.04 1.02.11.4.18.82.43 1.28.74 1.14.78 2.48 1.26 3.91 1.26.41 0 .8-.07 1.17-.2.32-.12.6-.3.82-.54.23-.24.39-.54.46-.88.07-.33.07-.68.04-1.03-.09-.9-.37-1.78-.8-2.6-.43-.82-.98-1.58-1.64-2.24-.67-.67-1.43-1.22-2.25-1.65-.82-.43-1.7-.7-2.6-.8-.35-.04-.7-.04-1.03.03-.34.07-.68.22-.95.45-.27.23-.48.52-.63.85-.15.33-.22.7-.22,1.07,0,1.43.48,2.77,1.26,3.91.49.7.99,1.33,1.52,1.88"/></svg>;
const BookOpenIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const PlayIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const PauseIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect></svg>;
const LoaderIcon = () => <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>;
const AlertTriangleIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 text-red-400"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const TrashIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 6h18m-2 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>;
const RefreshCwIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M3 2v6h6"/><path d="M21 12A9 9 0 0 0 6 5.3L3 8m0 8a9 9 0 0 0 18 0-9 9 0 0 0-6-8.7L21 16"/></svg>;
const SettingsIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 0 2l-.15.08a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1 0-2l.15-.08a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>;
const XIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;
const DownloadCloudIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14.899A7 7 0 1 1 15.71 8h1.79a4.5 4.5 0 0 1 2.5 8.242"/><path d="M12 12v9"/><path d="m16 17-4 4-4-4"/></svg>;
const CheckIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-green-500"><path d="M20 6 9 17l-5-5"/></svg>;
const EditIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>;
const CustomXIcon = () => <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-red-500"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>;

// --- Bileşenler (Components) ---

const SettingsModal = ({ isOpen, onClose, settings, setSettings }) => {
  if (!isOpen) return null;

  const [apiData, setApiData] = useState({ voices: [], elevenLabsModels: [], geminiModels: [] });
  const [isFetching, setIsFetching] = useState(false);
  const [fetchError, setFetchError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const [category, key] = name.split('.');
    setSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: value } }));
  };
  
  const handleSliderChange = (e) => {
    const { name, value } = e.target;
    const [category, key] = name.split('.');
    setSettings(prev => ({ ...prev, [category]: { ...prev[category], [key]: parseFloat(value) } }));
  };

  const handleFetchApiData = async () => {
    setIsFetching(true);
    setFetchError(null);
    try {
      if (!settings.api.gemini) throw new Error("Lütfen önce Gemini API anahtarınızı girin.");
      if (!settings.api.elevenlabs) throw new Error("Lütfen önce ElevenLabs API anahtarınızı girin.");

      const elevenLabsHeaders = { 'xi-api-key': settings.api.elevenlabs };
      const geminiApiUrl = `https://generativelanguage.googleapis.com/v1beta/models?key=${settings.api.gemini}`;

      const [voicesResponse, elevenModelsResponse, geminiModelsResponse] = await Promise.all([
        fetch('https://api.elevenlabs.io/v1/voices', { headers: elevenLabsHeaders }),
        fetch('https://api.elevenlabs.io/v1/models', { headers: elevenLabsHeaders }),
        fetch(geminiApiUrl)
      ]);

      if (!voicesResponse.ok) throw new Error(`ElevenLabs sesleri alınamadı: ${voicesResponse.statusText}`);
      const voicesData = await voicesResponse.json();
      if (!elevenModelsResponse.ok) throw new Error(`ElevenLabs modelleri alınamadı: ${elevenModelsResponse.statusText}`);
      const elevenModelsData = await elevenModelsResponse.json();

      if (!geminiModelsResponse.ok) throw new Error(`Gemini modelleri alınamadı: ${geminiModelsResponse.statusText}`);
      const geminiData = await geminiModelsResponse.json();
      const compatibleGeminiModels = geminiData.models.filter(model =>
        model.supportedGenerationMethods.includes("generateContent")
      );

      setApiData({ 
        voices: voicesData.voices, 
        elevenLabsModels: elevenModelsData,
        geminiModels: compatibleGeminiModels
      });

    } catch (error) {
      setFetchError(error.message);
    } finally {
      setIsFetching(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4">
      <div className="bg-gray-800 border border-purple-700 rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-700 flex justify-between items-center sticky top-0 bg-gray-800 z-10">
          <h2 className="text-2xl font-bold text-purple-300 flex items-center gap-3"><SettingsIcon />Ayarlar</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-700"><XIcon /></button>
        </div>
        <div className="p-6 space-y-8">
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">API Anahtarları</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gemini API Key</label>
                <input type="password" name="api.gemini" value={settings.api.gemini} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Gemini Modeli</label>
                <select name="api.gemini_model_id" value={settings.api.gemini_model_id} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500">
                  {apiData.geminiModels.length === 0 ? (
                    <option value="gemini-1.5-flash">gemini-1.5-flash (Varsayılan)</option>
                  ) : (
                    apiData.geminiModels.map(model => <option key={model.name} value={model.name.split('/')[1]}>{model.displayName}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ElevenLabs API Key</label>
                <input type="password" name="api.elevenlabs" value={settings.api.elevenlabs} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"/>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ElevenLabs Model ID</label>
                <select name="api.elevenlabs_model_id" value={settings.api.elevenlabs_model_id} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500">
                  {apiData.elevenLabsModels.length === 0 ? (
                    <option value="eleven_multilingual_v2">eleven_multilingual_v2 (Varsayılan)</option>
                  ) : (
                    apiData.elevenLabsModels.map(model => <option key={model.model_id} value={model.model_id}>{model.name}</option>)
                  )}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">ElevenLabs Voice ID</label>
                 <select name="api.elevenlabs_voice_id" value={settings.api.elevenlabs_voice_id} onChange={handleInputChange} className="w-full p-2 rounded bg-gray-800 border border-gray-600 focus:ring-purple-500 focus:border-purple-500">
                  {apiData.voices.length === 0 ? (
                    <option value="xsGHrtxT5AdDzYXTQT0d">Gönül Filiz (Varsayılan)</option>
                  ) : (
                    apiData.voices.map(voice => <option key={voice.voice_id} value={voice.voice_id}>{voice.name}</option>)
                  )}
                </select>
              </div>
              <div className="pt-2">
                <button onClick={handleFetchApiData} disabled={isFetching} className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 disabled:bg-blue-900">
                  {isFetching ? <LoaderIcon /> : <DownloadCloudIcon />} Sesleri ve Modelleri Çek
                </button>
                {fetchError && <p className="text-red-400 text-sm mt-2">{fetchError}</p>}
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Seslendirme Ayarları</h3>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300">Kararlılık (Stability): <span className="font-bold text-purple-300">{settings.voice.stability}</span></label>
                <input type="range" min="0" max="1" step="0.05" name="voice.stability" value={settings.voice.stability} onChange={handleSliderChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
              </div>
               <div>
                <label className="block text-sm font-medium text-gray-300">Benzerlik Artışı (Similarity Boost): <span className="font-bold text-purple-300">{settings.voice.similarity_boost}</span></label>
                <input type="range" min="0" max="1" step="0.05" name="voice.similarity_boost" value={settings.voice.similarity_boost} onChange={handleSliderChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
              </div>
            </div>
          </div>
          <div className="p-4 bg-gray-900/50 rounded-lg border border-gray-700">
            <h3 className="text-xl font-semibold text-purple-400 mb-4">Masal Üretim Ayarları</h3>
            <div>
              <label className="block text-sm font-medium text-gray-300">Tahmini Masal Süresi (dakika): <span className="font-bold text-purple-300">{settings.generation.duration}</span></label>
              <input type="range" min="1" max="15" step="1" name="generation.duration" value={settings.generation.duration} onChange={handleSliderChange} className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"/>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const StoryCarousel = ({ title, stories, actions, state }) => {
  if (stories.length === 0) {
    return (
      <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-800/50">
        <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2"><BookOpenIcon /> {title}</h2>
        <p className="text-gray-400">Burada gösterilecek masal yok.</p>
      </div>
    );
  }
  return (
    <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-xl border border-purple-800/50">
      <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2"><BookOpenIcon /> {title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 -mb-4">
        {stories.map(story => (
          <div key={story.id} className={`flex-shrink-0 w-64 bg-purple-900/50 rounded-lg p-4 flex flex-col justify-between shadow-lg transition-opacity duration-300 ${story.read ? 'opacity-60 hover:opacity-100' : ''}`}>
            <h4 className="font-bold text-lg mb-2 truncate">{story.title}</h4>
            <div className="flex items-center justify-end space-x-2 mt-4">
              {story.read && <button onClick={() => actions.toggleRead(story.id)} title="Tekrar Aktif Et" className="p-2 rounded-full bg-yellow-600 hover:bg-yellow-700 transition-colors"><RefreshCwIcon /></button>}
              <button onClick={() => actions.remove(story.id)} title="Masalı Sil" className="p-2 rounded-full bg-red-600 hover:bg-red-700 transition-colors"><TrashIcon /></button>
              <button onClick={() => actions.play(story)} disabled={state.isLoading || state.synthesizingId} title="Masalı Dinle" className="p-2 rounded-full bg-green-600 hover:bg-green-700 transition-colors disabled:bg-green-900">
                {state.synthesizingId === story.id ? <LoaderIcon /> : (state.playingId === story.id ? <PauseIcon /> : <PlayIcon />)}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const CustomVirtueButton = ({ onGenerate }) => {
  const [isEditing, setIsEditing] = useState(true);
  const [virtueName, setVirtueName] = useState('');
  const [inputValue, setInputValue] = useState('');

  const handleConfirm = () => {
    if (inputValue.trim()) {
      setVirtueName(inputValue.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setInputValue('');
    setIsEditing(true);
  };
  
  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleClick = () => {
    if (!isEditing && virtueName) {
      onGenerate(virtueName);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className={`relative flex items-center justify-center p-2 h-10 border-2 border-dashed rounded-lg cursor-pointer transition-colors
      ${isEditing ? 'border-gray-500' : 'border-teal-500 bg-teal-900/50 hover:bg-teal-800/50'}`}
    >
      {isEditing ? (
        <div className="flex items-center gap-1 w-full">
          <input 
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Özellik Giriniz"
            className="bg-transparent text-xs text-center w-full focus:outline-none placeholder-gray-500"
          />
          <button onClick={handleConfirm} className="p-1"><CheckIcon /></button>
          <button onClick={handleCancel} className="p-1"><CustomXIcon /></button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold text-teal-300">{virtueName}</span>
          <button onClick={handleEdit} className="p-1"><EditIcon /></button>
        </div>
      )}
    </div>
  );
};

export default function App() {
  const [prompt, setPrompt] = useState('');
  const [stories, setStories] = useState(() => {
    const savedStories = localStorage.getItem('masallar');
    return savedStories ? JSON.parse(savedStories) : [
      { id: 1, title: 'Cesur Şövalye ve Ejderha', content: 'Bir zamanlar...', read: false, audioUrl: null },
      { id: 2, title: 'Kayıp Hazine Adası', content: 'Kaptan Kanca...', read: true, audioUrl: null },
    ];
  });
  
  const [settings, setSettings] = useState(() => {
    const savedSettings = localStorage.getItem('ayarlar');
    const defaultSettings = {
      api: { gemini: '', gemini_model_id: 'gemini-1.5-flash', elevenlabs: '', elevenlabs_model_id: 'eleven_multilingual_v2', elevenlabs_voice_id: 'xsGHrtxT5AdDzYXTQT0d' },
      voice: { stability: 0.6, similarity_boost: 0.7 },
      generation: { duration: 5 }
    };
    return savedSettings ? JSON.parse(savedSettings) : defaultSettings;
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [synthesizingId, setSynthesizingId] = useState(null);
  const [playingId, setPlayingId] = useState(null);
  const [error, setError] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => { localStorage.setItem('ayarlar', JSON.stringify(settings)); }, [settings]);
  useEffect(() => { localStorage.setItem('masallar', JSON.stringify(stories)); }, [stories]);

  useEffect(() => {
    const audio = audioRef.current;
    const handleEnded = () => {
      if (playingId) setStories(prev => prev.map(s => s.id === playingId ? { ...s, read: true } : s));
      setPlayingId(null);
    };
    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playingId]);

  const callGeminiAPI = async (chatHistory, responseSchema) => {
    setIsLoading(true);
    setError(null);
    try {
      if (!settings.api.gemini) throw new Error("Gemini API anahtarı Ayarlar panelinde tanımlanmamış.");
      const model = settings.api.gemini_model_id || 'gemini-1.5-flash';
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${settings.api.gemini}`;
      const payload = { contents: chatHistory, generationConfig: { responseMimeType: "application/json", responseSchema } };
      const response = await fetch(apiUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) });
      if (!response.ok) throw new Error(`API hatası: ${response.status} ${await response.text()}`);
      const result = await response.json();
      if (result.candidates?.[0]) return JSON.parse(result.candidates[0].content.parts[0].text);
      throw new Error("API'den geçerli bir yanıt alınamadı.");
    } catch (err) {
      console.error("Gemini API hatası:", err);
      setError(err.message);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const callElevenLabsAPI = async (text) => {
    setError(null);
    try {
        if (!settings.api.elevenlabs) throw new Error("ElevenLabs API anahtarı Ayarlar panelinde tanımlanmamış.");
        const apiUrl = `https://api.elevenlabs.io/v1/text-to-speech/${settings.api.elevenlabs_voice_id}`;
        const headers = { 'Content-Type': 'application/json', 'xi-api-key': settings.api.elevenlabs };
        const body = JSON.stringify({ text, model_id: settings.api.elevenlabs_model_id, voice_settings: { stability: settings.voice.stability, similarity_boost: settings.voice.similarity_boost } });
        const response = await fetch(apiUrl, { method: 'POST', headers, body });
        if (!response.ok) throw new Error(`ElevenLabs API hatası: ${response.status} ${await response.text()}`);
        const audioBlob = await response.blob();
        return URL.createObjectURL(audioBlob);
    } catch (err) {
        console.error("ElevenLabs API hatası:", err);
        setError(err.message);
        return null;
    }
  };

  const handleGenerateStory = async () => {
    if (!prompt) { setError("Lütfen bir masal konusu girin."); return; }
    const systemPrompt = `Sen, 5 yaşındaki Türk kız çocukları için sevecen bir masalcısın. Masalların olumlu, öğretici ve güvenli olmalı. Kullanıcının isteğine göre, yaklaşık ${settings.generation.duration} dakika sürecek bir masal oluştur ve ilgi çekici bir başlık bul.`;
    const chatHistory = [{ role: "user", parts: [{ text: `${systemPrompt}\n\nİstek: "${prompt}"` }] }];
    const schema = { type: "OBJECT", properties: { "title": { "type": "STRING" }, "story": { "type": "STRING" } }, required: ["title", "story"] };
    const result = await callGeminiAPI(chatHistory, schema);
    if (result) {
      setStories(prev => [{ id: Date.now(), title: result.title, content: result.story, read: false, audioUrl: null }, ...prev]);
      setPrompt('');
    }
  };
  
  const handleSuggestIdea = async (virtue, detail) => {
    const ideaPrompt = virtue 
      ? `5 yaşındaki bir kız çocuğu için, içinde '${virtue}' erdemini anlatan, '${detail}' vurgulayan, tek cümlelik bir masal fikri öner. Yanıtını sadece {"title": "önerilen fikir"} formatında bir JSON olarak ver.`
      : `5 yaşındaki bir kız çocuğu için, Türkçe, yaratıcı ve eğlenceli bir uyku masalı konusu öner. Yanıtını sadece {"title": "önerilen başlık"} formatında bir JSON olarak ver.`;
    const schema = { type: "OBJECT", properties: { "title": { "type": "STRING" } }, required: ["title"] };
    const result = await callGeminiAPI([{ role: "user", parts: [{ text: ideaPrompt }] }], schema);
    if (result?.title) setPrompt(result.title);
  };

  const handlePlayPause = async (story) => {
    if (playingId && playingId !== story.id) { audioRef.current.pause(); setPlayingId(null); }
    if (playingId === story.id) { audioRef.current.pause(); setPlayingId(null); return; }
    if (story.audioUrl) {
      audioRef.current.src = story.audioUrl;
      audioRef.current.play().catch(e => console.error("Çalma hatası:", e));
      setPlayingId(story.id);
    } else {
      setSynthesizingId(story.id);
      const url = await callElevenLabsAPI(story.content);
      setSynthesizingId(null);
      if (url) {
        setStories(prev => prev.map(s => s.id === story.id ? { ...s, audioUrl: url } : s));
        audioRef.current.src = url;
        audioRef.current.play().catch(e => console.error("Çalma hatası:", e));
        setPlayingId(story.id);
      }
    }
  };

  const handleRemoveStory = (id) => setStories(prev => prev.filter(s => s.id !== id));
  const handleToggleReadStatus = (id) => setStories(prev => prev.map(s => s.id === id ? { ...s, read: !s.read } : s));

  const virtues = [
    { name: 'Dürüstlük', detail: 'doğruyu söylemenin önemi' },
    { name: 'Cesaret', detail: 'korkuların üstesinden gelme' },
    { name: 'Paylaşmak', detail: 'elindekileri başkalarıyla bölüşmenin güzelliği' },
    { name: 'Saygı', detail: 'büyüklere ve arkadaşlara karşı nazik olmak' },
  ];

  const activeStories = stories.filter(s => !s.read);
  const passiveStories = stories.filter(s => s.read);

  return (
    <div className="min-h-screen bg-gray-900 text-white font-sans p-4 sm:p-8" style={{background: 'linear-gradient(135deg, #1a202c, #2d3748)'}}>
      <audio ref={audioRef} />
      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} settings={settings} setSettings={setSettings} />
      
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-12">
          <div className="text-left">
            <h1 className="text-4xl sm:text-5xl font-bold text-purple-400 drop-shadow-lg">Uyku Masalları 🚀</h1>
            <p className="text-purple-200 mt-2">Hayal gücünü serbest bırak!</p>
          </div>
          <button onClick={() => setIsSettingsOpen(true)} title="Ayarlar" className="p-3 rounded-full bg-purple-800/50 hover:bg-purple-700/70 transition-colors"><SettingsIcon /></button>
        </header>

        <div className="bg-gray-800/50 backdrop-blur-sm p-6 rounded-2xl shadow-2xl mb-12 border border-purple-800/50">
          <h2 className="text-2xl font-semibold mb-4 text-purple-300 flex items-center gap-2"><SparklesIcon /> Yeni Bir Masal Yarat</h2>
          <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder="Bir masal konusu yazın veya aşağıdan bir erdem seçerek fikir isteyin..." className="w-full p-4 rounded-lg bg-gray-900 border-2 border-purple-700 focus:border-purple-500 focus:ring-purple-500 transition duration-200 text-white placeholder-gray-500" rows="3" disabled={isLoading}></textarea>
          {error && <div className="mt-4 p-3 bg-red-900/50 border border-red-700 rounded-lg flex items-center gap-3 text-red-300"><AlertTriangleIcon /><span>{error}</span></div>}
          
          <div className="mt-6 flex flex-col items-center gap-4">
            <button onClick={() => handleSuggestIdea()} disabled={isLoading} className="flex items-center justify-center gap-2 px-5 py-2 font-bold text-white text-base rounded-full bg-teal-600 hover:bg-teal-700 transition-all shadow-md">
                {isLoading ? <LoaderIcon /> : '✨'} Rastgele Fikir Ver
            </button>
            <div className="w-full h-10 relative -mt-2">
              <svg width="100%" height="100%" viewBox="0 0 400 40" preserveAspectRatio="none" className="absolute">
                <path d="M200 0 V 15" stroke="#4a5568" strokeWidth="2" />
                <path d="M200 15 C 150 15, 150 15, 50 40" stroke="#4a5568" strokeWidth="2" fill="none" />
                <path d="M200 15 C 175 15, 175 15, 125 40" stroke="#4a5568" strokeWidth="2" fill="none" />
                <path d="M200 15 C 225 15, 225 15, 275 40" stroke="#4a5568" strokeWidth="2" fill="none" />
                <path d="M200 15 C 250 15, 250 15, 350 40" stroke="#4a5568" strokeWidth="2" fill="none" />
              </svg>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 w-full max-w-4xl">
              {virtues.map(v => (
                <button key={v.name} onClick={() => handleSuggestIdea(v.name, v.detail)} disabled={isLoading} className="p-2 text-xs font-semibold text-purple-200 bg-purple-900/50 border-2 border-purple-800 rounded-lg hover:bg-purple-800/50 transition-colors">
                  {v.name}
                </button>
              ))}
              <CustomVirtueButton onGenerate={(virtue) => handleSuggestIdea(virtue, `önemi`)} />
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <button onClick={handleGenerateStory} disabled={isLoading || !prompt} className="flex items-center justify-center gap-3 px-6 py-3 font-bold text-white text-lg rounded-full bg-purple-600 hover:bg-purple-700 active:bg-purple-800 transition-all duration-200 ease-in-out shadow-lg hover:shadow-xl transform hover:-translate-y-1 disabled:bg-purple-900 disabled:text-gray-400 disabled:cursor-not-allowed disabled:transform-none">
              {isLoading ? <LoaderIcon /> : '🦄'} Masal Oluştur
            </button>
          </div>
        </div>

        <div className="space-y-12">
          <StoryCarousel title="Aktif Masallar" stories={activeStories} actions={{ play: handlePlayPause, remove: handleRemoveStory, toggleRead: handleToggleReadStatus }} state={{ isLoading, synthesizingId, playingId }}/>
          <StoryCarousel title="Okunmuş Masallar" stories={passiveStories} actions={{ play: handlePlayPause, remove: handleRemoveStory, toggleRead: handleToggleReadStatus }} state={{ isLoading, synthesizingId, playingId }}/>
        </div>
      </div>
    </div>
  );
}
