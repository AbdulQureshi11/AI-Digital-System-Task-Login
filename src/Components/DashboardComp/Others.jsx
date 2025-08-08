import React, { useState, useEffect } from 'react'

const Others = () => {
  const [logs, setLogs] = useState({ mongo: [], sql: [] })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token') 

    fetch('/api/allLogs', {
      headers: {
        'Authorization': `Bearer ${token}`   
      }
    })
      .then(res => {
        if (!res.ok) {
          throw new Error('Failed to fetch logs')
        }
        return res.json()
      })
      .then(data => {
        setLogs(data.logs || { mongo: [], sql: [] })
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  if (loading) return <p className="text-center mt-10 text-gray-600">Loading logs...</p>
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>

  const formatDate = (dt) => {
    if (!dt) return 'N/A'
    const dateObj = new Date(dt)
    return isNaN(dateObj.getTime()) ? 'Invalid Date' : dateObj.toLocaleString()
  }

  const prettyJson = (obj) => {
    try {
      return JSON.stringify(obj, null, 2)
    } catch {
      return 'Invalid Data'
    }
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">Operation Logs Overview</h1>

      {/* Mongo Logs */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 text-indigo-700 border-b border-indigo-300 pb-2">
          MongoDB Logs ({logs.mongo.length})
        </h2>
        {logs.mongo.length === 0 ? (
          <p className="text-gray-500 italic">No MongoDB logs found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {logs.mongo.map(log => (
              <li
                key={log._id}
                className="p-4 bg-white shadow rounded border border-gray-200 hover:shadow-md transition"
              >
                <p><strong>Operation:</strong> {log.logtype || 'N/A'}</p>
                <p><strong>Date & Time:</strong> {formatDate(log.datetime)}</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
                  <strong>Details:</strong>
                  {'\n'}
                  {prettyJson(log.data_after_update)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* SQL Logs */}
      <section>
        <h2 className="text-2xl font-semibold mb-4 text-green-700 border-b border-green-300 pb-2">
          SQL Logs ({logs.sql.length})
        </h2>
        {logs.sql.length === 0 ? (
          <p className="text-gray-500 italic">No SQL logs found.</p>
        ) : (
          <ul className="space-y-4 max-h-96 overflow-y-auto">
            {logs.sql.map(log => (
              <li
                key={log.id}
                className="p-4 bg-white shadow rounded border border-gray-200 hover:shadow-md transition"
              >
                <p><strong>Operation:</strong> {log.logtype || 'N/A'}</p>
                <p><strong>Date & Time:</strong> {formatDate(log.datetime)}</p>
                <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm mb-2">
                  <strong>Details Before Update:</strong>
                  {'\n'}
                  {prettyJson(log.data_before_update)}
                </pre>
                <pre className="bg-gray-100 p-2 rounded overflow-auto text-sm">
                  <strong>Details After Update:</strong>
                  {'\n'}
                  {prettyJson(log.data_after_update)}
                </pre>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  )
}

export default Others
