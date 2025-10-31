import { useState, useEffect } from 'react';
import { dataAPI } from '../services/api';
import type {Runner} from '../types/runner.types';

export const RunnerTable = () => {
  const [runners, setRunners] = useState<Runner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBranch, setFilterBranch] = useState('');

  useEffect(() => {
    fetchRunners();
  }, []);

  const fetchRunners = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await dataAPI.getAllRunners();

      if (response.success && response.data) {
        setRunners(response.data);
      } else {
        setError('No se pudieron cargar los datos');
      }
    } catch (err) {
      setError('Error de conexión con el servidor');
    } finally {
      setLoading(false);
    }
  };

  // Obtener categorías y ramas únicas para filtros
  const categories = Array.from(new Set(runners.map(r => r.category))).filter(Boolean);
  const branches = Array.from(new Set(runners.map(r => r.branch))).filter(Boolean);

  // Filtrar runners
  const filteredRunners = runners.filter(runner => {
    const matchesSearch =
        runner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.bib.toLowerCase().includes(searchTerm.toLowerCase()) ||
        runner.club.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = !filterCategory || runner.category === filterCategory;
    const matchesBranch = !filterBranch || runner.branch === filterBranch;

    return matchesSearch && matchesCategory && matchesBranch;
  });

  if (loading) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Cargando datos...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
            <p className="font-bold">Error</p>
            <p>{error}</p>
            <button
                onClick={fetchRunners}
                className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
            >
              Reintentar
            </button>
          </div>
        </div>
    );
  }

  return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="mb-8">
            <img src="Live.svg" alt="En vivo logo" width="50"></img>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              Resultados en vivo
            </h2>
            <img src="1920X1080_STAKU.png" alt="Staku portada" width="500"></img>
            <p className="text-gray-600">
              Total de corredores: <span className="font-semibold">{filteredRunners.length}</span>
              {/*<br></br>Powered by: <span className="font-semibold"><img src="Logo PacerTime.svg" alt="PacerTime Logo" width="50"></img></span>*/}
            </p>
          </div>

          {/* Filters */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Buscar
                </label>
                <input
                    type="text"
                    placeholder="Nombre, Bib o Club..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Categoría
                </label>
                <select
                    value={filterCategory}
                    onChange={e => setFilterCategory(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                  ))}
                </select>
              </div>

              {/* Branch Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rama
                </label>
                <select
                    value={filterBranch}
                    onChange={e => setFilterBranch(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">Todas</option>
                  {branches.map(branch => (
                      <option key={branch} value={branch}>
                        {branch}
                      </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Clear Filters */}
            {(searchTerm || filterCategory || filterBranch) && (
                <button
                    onClick={() => {
                      setSearchTerm('');
                      setFilterCategory('');
                      setFilterBranch('');
                    }}
                    className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  Limpiar filtros
                </button>
            )}
          </div>

          {/* Table */}
          {filteredRunners.length === 0 ? (
              <div className="bg-white rounded-lg shadow-md p-12 text-center">
                <p className="text-gray-500 text-lg">
                  No se encontraron corredores con los filtros aplicados
                </p>
              </div>
          ) : (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Posición
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bib
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Competidor
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Categoría
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Rama
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Club
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Vueltas
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Distancia
                      </th>
                    </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRunners.map((runner, index) => (
                        <tr
                            key={runner.id}
                            className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {runner.position <= 3 && (
                                  <span className="text-2xl mr-2">
                              {runner.position === 1 && '🥇'}
                                    {runner.position === 2 && '🥈'}
                                    {runner.position === 3 && '🥉'}
                            </span>
                              )}
                              <span className="text-sm font-medium text-gray-900">
                            {runner.position}
                          </span>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {runner.bib}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {runner.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                          {runner.category}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {runner.branch}
                        </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {runner.club}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {runner.laps}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {runner.distance}
                          </td>
                        </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
          )}
        </div>
        <center>
        <br></br><h1>Powered by: </h1><img src="Logo PacerTime.svg" alt="PacerTime Logo" width="100"></img>
        </center>
      </div>
  );
};