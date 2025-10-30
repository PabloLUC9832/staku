import { useState } from 'react';
import { adminAPI } from '../services/api';

export const AdminPanel = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error' | null;
    text: string;
  }>({ type: null, text: '' });
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setMessage({ type: null, text: '' });
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
      setMessage({ type: null, text: '' });
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: 'error', text: 'Por favor selecciona un archivo' });
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await adminAPI.uploadExcel(file);

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Archivo cargado exitosamente',
        });
        setFile(null);
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Error al cargar el archivo',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error de conexión con el servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClearData = async () => {
    if (!confirm('¿Estás seguro de eliminar todos los datos?')) {
      return;
    }

    setLoading(true);
    setMessage({ type: null, text: '' });

    try {
      const response = await adminAPI.clearData();

      if (response.success) {
        setMessage({
          type: 'success',
          text: response.message || 'Datos eliminados exitosamente',
        });
      } else {
        setMessage({
          type: 'error',
          text: response.message || 'Error al eliminar los datos',
        });
      }
    } catch (error) {
      setMessage({
        type: 'error',
        text: 'Error de conexión con el servidor',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4 max-w-3xl">
          <div className="bg-white rounded-lg shadow-md p-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Panel de Administración
            </h2>

            {/* Upload Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Cargar Archivo Excel
              </h3>

              <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                      dragActive
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onDragEnter={handleDrag}
                  onDragLeave={handleDrag}
                  onDragOver={handleDrag}
                  onDrop={handleDrop}
              >
                <input
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleFileChange}
                    className="hidden"
                    id="file-upload"
                />

                <label
                    htmlFor="file-upload"
                    className="cursor-pointer flex flex-col items-center"
                >
                  <svg
                      className="w-16 h-16 text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                  >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <span className="text-gray-600 font-medium">
                  {file
                      ? file.name
                      : 'Arrastra un archivo o haz clic para seleccionar'}
                </span>
                  <span className="text-gray-400 text-sm mt-2">
                  Solo archivos .xlsx o .xls
                </span>
                </label>
              </div>

              <button
                  onClick={handleUpload}
                  disabled={!file || loading}
                  className={`w-full mt-4 py-3 px-4 rounded-lg font-semibold transition-colors ${
                      !file || loading
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
              >
                {loading ? 'Procesando...' : 'Subir Archivo'}
              </button>
            </div>

            {/* Clear Data Section */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-700 mb-4">
                Gestión de Datos
              </h3>
              <button
                  onClick={handleClearData}
                  disabled={loading}
                  className="w-full py-3 px-4 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {loading ? 'Eliminando...' : 'Eliminar Todos los Datos'}
              </button>
            </div>

            {/* Message Display */}
            {message.type && (
                <div
                    className={`p-4 rounded-lg ${
                        message.type === 'success'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                    }`}
                >
                  {message.text}
                </div>
            )}
          </div>
        </div>
      </div>
  );
};