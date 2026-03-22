import React, { useState } from 'react';
import { Link2, Copy, Check, ExternalLink, Loader2, Scissors } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function App() {
  const [url, setUrl] = useState('');
  const [shortUrl, setShortUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    setLoading(true);
    setError('');
    setShortUrl('');
    setCopied(false);

    try {
      const response = await fetch('https://gotiny.cc/api', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: url }),
      });

      const data = await response.json();

      if (response.ok && data.length > 0) {
        const code = data[0].code;
        setShortUrl(`https://gotiny.cc/${code}`);
      } else {
        setError('Ocorreu um erro ao encurtar o link. Verifique a URL.');
      }
    } catch (err) {
      setError('Erro de conexão. Tente novamente mais tarde.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#f5f5f5] flex flex-col items-center justify-center p-4 font-sans">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="bg-white rounded-3xl shadow-sm border border-black/5 p-8 md:p-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-black text-white p-2 rounded-xl">
              <Scissors size={24} />
            </div>
            <h1 className="text-2xl font-semibold tracking-tight text-gray-900">CleanShort</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Link2 size={18} />
              </div>
              <input
                type="url"
                placeholder="Cole seu link longo aqui..."
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:outline-none focus:ring-2 focus:ring-black/5 focus:border-gray-200 transition-all text-gray-800 placeholder:text-gray-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-black text-white rounded-2xl font-medium hover:bg-gray-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Encurtando...
                </>
              ) : (
                'Encurtar Link'
              )}
            </button>
          </form>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-6 p-4 bg-red-50 text-red-600 rounded-xl text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            {shortUrl && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mt-8 p-6 bg-gray-50 rounded-2xl border border-gray-100"
              >
                <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">Link Encurtado</p>
                <div className="flex items-center gap-2">
                  <div className="flex-1 truncate font-medium text-gray-900 bg-white border border-gray-100 px-4 py-3 rounded-xl">
                    {shortUrl}
                  </div>
                  <button
                    onClick={copyToClipboard}
                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-gray-600"
                    title="Copiar link"
                  >
                    {copied ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
                  </button>
                  <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-3 bg-white border border-gray-100 rounded-xl hover:bg-gray-50 transition-all text-gray-600"
                    title="Abrir link"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-gray-400">
            Simples. Rápido. Limpo.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
