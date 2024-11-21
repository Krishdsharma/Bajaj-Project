import React, { useState } from 'react';
import axios from 'axios';

const App = () => {
    const [inputData, setInputData] = useState('');
    const [file, setFile] = useState(null);
    const [response, setResponse] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleInputChange = (e) => {
        setInputData(e.target.value);
    };

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setFile(reader.result.split(',')[1]); // Get base64 string without the prefix
            };
            reader.readAsDataURL(selectedFile);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setResponse(null);

        const dataArray = inputData.split(',').map(item => item.trim());

        try {
            const res = await axios.post('https://bajaj-project-nine.vercel.app/bfhl', {
                data: dataArray,
                file_b64: file
            });
            setResponse(res.data);
        } catch (err) {
            setError(err.response ? err.response.data : err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '20px' }}>
            <h1>Data Submission</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Enter Data (comma-separated):
                        <input
                            type="text"
                            value={inputData}
                            onChange={handleInputChange}
                            required
                            placeholder="e.g. M, 1, 334, 4, B, Z, a, 7"
                        />
                    </label>
                </div>
                <div>
                    <label>
                        Upload File:
                        <input type="file" onChange={handleFileChange} required />
                    </label>
                </div>
                <button type="submit">Submit</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {response && (
                <div>
                    <h2>Response:</h2>
                    <pre>{JSON.stringify(response, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default App;